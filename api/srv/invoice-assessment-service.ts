import cds, { Request, Service } from "@sap/cds";
import FormData from "form-data";
import xsenv from "@sap/xsenv";
import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
    PutObjectCommandOutput
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

import {
    Projects_Users,
    Users,
    Invoices,
    Documents,
    Invoice,
    Roles,
    WorkflowStatus,
    FlowStatuses,
    DeductionVersions,
    Deductions,
    Deduction,
    Retentions,
    RetentionVersions,
    Retention,
    Projects
} from "#cds-models/dox";
import log from "./logging";

const DOX_DESTINATION_PREMIUM: string = "DOX_PREMIUM_INVOICE_VALIDATION"; // dox, as in Document Information Extqraction service
const DOX_EXTRA_POSITIONS_SCHEMA = "invoicePositions";

const s3: any = xsenv.getServices({ objectstore: { label: "objectstore" } }).objectstore;
const BUCKET_S3: string = s3.bucket;
const ACCESS_KEY_ID_S3: string = s3.access_key_id;
const ACCESS_KEY_SECRET_S3: string = s3.secret_access_key;
const REGION_S3: string = s3.region;

export class InvoiceAssessmentService extends cds.ApplicationService {
    async init() {
        this.on("DELETE", "Projects_Users", async (req: Request, next) => {
            //@ts-ignore
            const assignment = await SELECT.one.from(req.subject);
            const role = assignment.role;
            const user = assignment.user_ID;
            log.revoke(role, user);
            return next();
        });

        this.on("CREATE", "Positions", (req: Request, next) => {
            log.newPosition();
            return next();
        });

        this.on("DELETE", "Positions", (req: Request, next) => {
            log.deletedPosition();
            return next();
        });

        this.on("CREATE", "PositionCorrections", (req: Request, next) => {
            log.changedPosition();
            return next();
        });

        this.on("CREATE", "Deductions", (req: Request, next) => {
            log.newDeduction();
            return next();
        });

        this.on("DELETE", "Deductions", (req: Request, next) => {
            log.deletedDeduction();
            return next();
        });

        this.on("UPDATE", "Deductions", (req: Request, next) => {
            log.changedDeduction();
            return next();
        });

        this.on("CREATE", "Retentions", (req: Request, next) => {
            log.newRetention();
            return next();
        });

        this.on("DELETE", "Retentions", (req: Request, next) => {
            log.deletedRetention();
            return next();
        });

        this.on("UPDATE", "Retentions", (req: Request, next) => {
            log.changedRetention();
            return next();
        });
        super.init();
        // FUNCTIONS
        this.on("getUserInfo", this.getUserInfo);
        this.on("getPdfBytesByInvoiceID", this.getPdfBytesByInvoiceID);
        this.on("getPdfBytesByKey", this.getPdfBytesByKey);
        this.on("getFileFromS3", (req: Request) => this.getFileFromS3(req.data.s3BucketKey as string));
        this.on("areInvoiceExtractionsCompleted", this.areInvoiceExtractionsCompleted);
        this.on("doxGetPositions", this.doxGetPositions);
        this.on("doxGetLineItems", this.doxGetLineItems);

        // ACTIONS
        this.on("setCV", this.setCV);
        this.on("acceptOrRejectInvoice", this.acceptOrRejectInvoice);
        this.on("assignProjectRole", this.assignProjectRole);
        this.on("uploadFileToS3", this.uploadFileToS3);
        this.on("deleteFileFromS3", this.deleteFileFromS3);
        this.on("doxExtractFromInvoices", this.doxExtractFromInvoices);

        this.after(["CREATE", "UPDATE"], "Deductions", this.recordLatestDeduction);
        this.after(["CREATE", "UPDATE"], "Retentions", this.recordLatestRetention);

        // one-time upload of sample invoices if not there yet
        this.uploadSamplesS3();
    }

    private getUserInfo = async (req: Request) => {
        const userId = req.user.id;
        const { givenName, familyName } = req.user.attr;
        const projectRoles = await SELECT.from(Projects_Users)
            .columns(`{ project_ID as projectId, role, craft }`)
            .where({ user_ID: userId });

        let company = "";
        const user = await SELECT.one.from(Users, userId);
        if (user && user.company) {
            company = user.company;
        }

        return {
            id: userId,
            givenName: givenName,
            familyName: familyName,
            company: company,
            isAdmin: req.user.is("admin"),
            projectRoles: projectRoles
        };
    };

    /* Set current validator of invoice */
    private setCV = async (req: Request) => {
        const requestorUserId = req.user.id;
        const { projectId, idNewCV, invoiceId } = req.data;
        const invoice = (await SELECT.one.from(Invoices, invoiceId)) as Invoice;
        // @ts-ignore
        const isCV = invoice.CV_user_ID === requestorUserId;
        if (isCV && idNewCV) {
            const requestorProjectRole = (
                await SELECT.one.from(Projects_Users, {
                    project_ID: projectId,
                    user_ID: requestorUserId
                })
            ).role;
            const newCVProjectRole = (
                await SELECT.one.from(Projects_Users, {
                    project_ID: projectId,
                    user_ID: idNewCV
                })
            ).role;
            if (requestorProjectRole !== newCVProjectRole) {
                // actually set new CV
                await UPDATE(Invoices, invoiceId).with({ CV_user_ID: idNewCV });
                const nextStatus = this.getNextFlowStatus(newCVProjectRole);
                const result = await INSERT.into(FlowStatuses, [
                    {
                        descriptor: nextStatus,
                        invoice_invoiceID: invoiceId,
                        processor_user_ID: idNewCV,
                        processor_project_ID: projectId
                    }
                ]);
                // insertion successful
                if (result > 0) {
                    const idFlowStatus = [...result][0].ID;
                    const newFlowStatus = await SELECT.one.from(FlowStatuses, idFlowStatus);
                    log.forward(requestorUserId, idNewCV);
                    return { message: "successfully set new CV", newFlowStatus: newFlowStatus };
                }
            }
        }
        req.reject(403, "Forbidden");
    };

    /* Accept/reject invoice a part of the last step in the workflow */
    private acceptOrRejectInvoice = async (req: Request) => {
        const { status, invoiceId }: { status: "ACCEPTED" | "REJECTED"; invoiceId: String } = req.data;
        const results = await SELECT.from(FlowStatuses)
            .where({ invoice_invoiceID: invoiceId })
            .orderBy("createdAt desc")
            .limit(1);
        // @ts-ignore
        const { processor_project_ID: projectId, processor_user_ID: CV } = results[0];
        // role of new potentially CV
        const projectRole = (
            await SELECT.one.from(Projects_Users, {
                project_ID: projectId,
                user_ID: req.user.id
            })
        ).role;

        if (!["ACCEPTED", "REJECTED"].includes(status)) req.reject(400, "Bad Request");
        // @ts-ignore
        if (CV !== req.user.id || projectRole !== Roles.ACCOUNTING_MEMBER) req.reject(403, "Forbidden");
        let newFlowStatus;
        const result = await INSERT.into(FlowStatuses, [
            {
                // there is no processor anymore in this stage => leave as null
                descriptor: status,
                invoice_invoiceID: invoiceId
            }
        ]);
        // insertion successful
        if (result > 0) {
            const idFlowStatus = [...result][0].ID;
            newFlowStatus = await SELECT.one.from(FlowStatuses, idFlowStatus);
            // invoice has reached end of worklfow => does not have current validator anymore
            await UPDATE(Invoices, invoiceId).with({ CV_user_ID: null, CV_project_ID: null });
        }
        if (status === "ACCEPTED") {
            log.accept(req.user.id);
        }
        if (status === "REJECTED") {
            log.reject(req.user.id);
        }
        return { message: "success", newFlowStatus: newFlowStatus };
    };

    /* Assign role to a user for a specific project */
    private assignProjectRole = async (req: Request) => {
        if (!req.user.is("admin")) req.reject(403, "Forbidden");
        const { projectId, userId, role, craft }: { projectId: string; userId: string; role: string; craft: string } =
            req.data;
        const user = await SELECT.one.from(Users, userId);
        const project = (await SELECT.one.from(Projects)).name;
        const roleAssignment = await SELECT.one.from(Projects_Users, {
            project_ID: projectId,
            user_ID: userId
        });
        // user exists, but not assigned to project yet
        if (user && !roleAssignment) {
            await INSERT.into(Projects_Users, [{ project_ID: projectId, user_ID: userId, role: role, craft: craft }]);
        }
        // user exists and was previously assigned to project
        else if (user && roleAssignment) {
            await UPDATE(Projects_Users, { user_ID: userId, project_ID: projectId }).with({ role: role, craft: craft });
        }
        // user does not exist yet
        else if (!user) {
            await INSERT.into(Users, { ID: userId });
            await INSERT.into(Projects_Users, { user_ID: userId, project_ID: projectId, role: role, craft: craft });
        }
        log.assign(project, role, userId);
        return { message: "successfully set user role" };
    };

    /* INTERACTION WITH AMAZON S3 */

    private getPdfBytesByInvoiceID = async (req: Request) => {
        const invoiceID = req.data.invoiceID as string;
        return (await this.getPDFById(invoiceID)).transformToString("base64");
    };

    private getPdfBytesByKey = async (req: Request) => {
        const s3BucketKey = req.data.s3BucketKey as string;
        return (await this.getFileFromS3(s3BucketKey)).transformToString("base64");
    };

    private getFileFromS3 = async (s3BucketKey: string) => {
        const s3Client = this.getS3Client();
        const command = new GetObjectCommand({ Bucket: BUCKET_S3, Key: s3BucketKey });
        const response = await s3Client.send(command);
        return response.Body;
    };

    private async getPDFById(invoiceID: string) {
        const bucketKey = (await SELECT.one.from(Invoices, { invoiceID })).s3BucketKey;
        const bytes = this.getFileFromS3(bucketKey);
        return bytes;
    }

    private uploadFileToS3 = async (req: Request) => {
        const {
            invoiceID,
            fileName,
            file: base64String
        }: { invoiceID: string; fileName: string; file: string } = req.data;

        const s3Client = this.getS3Client();
        const key = invoiceID + "/" + fileName;
        // @ts-ignore
        const fileData = Buffer.from(base64String, "base64");

        const command = new PutObjectCommand({ Bucket: BUCKET_S3, Body: fileData, Key: key });
        const response = await s3Client.send(command);
        if (response["$metadata"].httpStatusCode === 200) {
            const result = await INSERT.into(Documents, [{ invoice_invoiceID: invoiceID, fileName, s3BucketKey: key }]);
            const idInsertedDocument = [...result][0].ID;
            const insertedDocument = await SELECT.one.from(Documents, idInsertedDocument);
            log.documentsUploaded();
            return insertedDocument;
        }
        return;
    };

    private async uploadSamplesS3() {
        // the sample invoices lie here
        const dir = path.join(__dirname, "samples");
        const files = await fs.promises
            .readdir(dir)
            .catch((err) => console.log("Expected directory 'samples' with sample invoices, but not found.", err));
        if (!Array.isArray(files) || (Array.isArray(files) && files.length === 0)) return;
        // cut off '.pdf'
        let id = files[0].split(".")[0];
        const invoice = await SELECT.one.from(Invoices).where({ invoiceID: id });

        let uploads: Promise<PutObjectCommandOutput>[] = [];
        // sanity check, use job id as indicator if already in bucket
        if (!(invoice && invoice.doxPositionsJobID)) {
            const s3 = this.getS3Client();
            uploads = files.map((filename) => {
                id = filename.split(".")[0];
                const cmd = new PutObjectCommand({
                    Bucket: BUCKET_S3,
                    Key: id + "/" + filename,
                    Body: fs.readFileSync(path.join(dir, filename))
                });
                return s3.send(cmd);
            });
        }
        return Promise.all(uploads).catch((err) => console.log("One-time upload to S3 failed", err));
    }

    private deleteFileFromS3 = async (req: Request) => {
        const { s3BucketKey, documentId } = req.data;
        const s3Client = this.getS3Client();

        const command = new DeleteObjectCommand({ Bucket: BUCKET_S3, Key: s3BucketKey });
        const response = await s3Client.send(command);
        if (response["$metadata"].httpStatusCode === 204) {
            await DELETE.from(Documents).where({ ID: documentId });
            return { message: "successfully deleted" };
        }
        return;
    };

    private getS3Client = () => {
        return new S3Client({
            region: REGION_S3,
            credentials: { accessKeyId: ACCESS_KEY_ID_S3, secretAccessKey: ACCESS_KEY_SECRET_S3 }
        });
    };

    /* INTERACTION WITH DOX */

    /* Entry point to extract line items from invoices (pdfs). Note, we need one extra schema
    just for positions because default invoice schema doesn't include them. We store dox job ids alongside invoice */
    private doxExtractFromInvoices = async () => {
        // TODO: called twice by effect, any way to prevent this?
        const todos = (await SELECT.from(Invoices).columns(`{ invoiceID, doxPositionsJobID }`)) // todos, the invoices not yet analyzed
            .filter((inv) => !inv.doxPositionsJobID)
            .map((inv) => inv.invoiceID);
        if (todos.length === 0) return;
        // initial sample invoice '3420987413543' not analyzed yet -> no dox schema for positions yet either
        if (todos.find((ID) => ID === "3420987413543")) await this.doxCreatePositionsSchema();

        // prettier-ignore
        const jobs = await Promise.all(todos.map((invoiceID) =>
                                        [this.doxUploadInvoice(invoiceID, DOX_EXTRA_POSITIONS_SCHEMA), this.doxUploadInvoice(invoiceID)])
                                        .flat());
        // prettier-ignore
        await Promise.all(todos.map( async (ID, i) =>
                            // @ts-ignore
                            await UPDATE(Invoices, ID).with({ doxPositionsJobID: jobs[i*2].id, doxLineItemsJobID: jobs[i*2 + 1].id })));
        return;
    };

    /* Upload invoice first for dox to extract from it */
    private doxUploadInvoice = async (invoiceID: string, schemaName?: string) => {
        const form = await this.doxFormData(
            invoiceID,
            {
                clientId: "default",
                schemaName: schemaName ?? "SAP_invoice_schema",
                documentType: schemaName ? "custom" : "invoice"
            },
            schemaName ? invoiceID + "-Positions.pdf" : invoiceID + "-LineItems.pdf"
        );
        const doxConnection = await this.getDoxConnection();
        return await doxConnection.send("POST", "/document/jobs", form.getBuffer(), form.getHeaders());
    };

    private async doxFormData(invoiceID: string, DOX_OPTIONS: object, pdfName: string): Promise<FormData> {
        const formData = new FormData();
        const pdfFile = await this.getPDFById(invoiceID);
        const pdfByteArray = await pdfFile.transformToByteArray();
        formData.append("options", JSON.stringify(DOX_OPTIONS));
        let buffer = Buffer.from(pdfByteArray);
        formData.append("file", buffer, pdfName);
        return formData;
    }

    /* Returns ids of invoices which dox has (not) finished analysing just yet */
    private areInvoiceExtractionsCompleted = async () => {
        const invs = await SELECT.from(Invoices).columns(`{ invoiceID, doxPositionsJobID, doxLineItemsJobID }`);
        const jobs = (await (await this.getDoxConnection()).send("GET", "/document/jobs")).results;
        const ret: { done: string[]; pending: string[] } = { done: [], pending: [] };
        for (const inv of invs) {
            const pos = jobs.find((jb: any) => jb.id === inv.doxPositionsJobID);
            const li = jobs.find((jb: any) => jb.id === inv.doxLineItemsJobID);

            // prettier-ignore
            pos && pos.status === "DONE" && li && li.status === "DONE" ? ret.done.push(inv.invoiceID) : ret.pending.push(inv.invoiceID);
        }
        return ret;
    };

    private doxGetPositions = async (req: Request) => {
        const ID = req.data.invoiceID as string;
        const jobID = (await SELECT.one.from(Invoices, ID).columns(`{ doxPositionsJobID }`)).doxPositionsJobID;
        if (!jobID) req.reject(400, "No job ID found, invoice probably not yet analyzed");

        const resp = await (await this.getDoxConnection()).send("GET", "/document/jobs/" + jobID);
        return resp.extraction.lineItems.map((item: any) => item[0]);
    };

    private doxGetLineItems = async (req: Request) => {
        const ID = req.data.invoiceID as string;
        const jobID = (await SELECT.one.from(Invoices, ID).columns(`{ doxLineItemsJobID }`)).doxLineItemsJobID;
        const resp = await (await this.getDoxConnection()).send("GET", "/document/jobs/" + jobID);
        return resp.extraction.lineItems;
    };

    private doxCreatePositionsSchema = async () => {
        const schema = {
            clientId: "default",
            documentType: "custom",
            name: DOX_EXTRA_POSITIONS_SCHEMA,
            schemaDescription: "Schema to extract the positions of an invoice",
            documentTypeDescription: "" // is required
        };
        const doxConnection = await this.getDoxConnection();
        let schemaId;
        try {
            const doxResponse: any = await doxConnection.send("POST", "/schemas", schema);
            schemaId = doxResponse.id;
        } catch (e) {
            throw new Error("Failed to create schema. Schema probably already exists");
        }
        const payloadToAddPositionLineItem: { headerFields: []; lineItemFields: {}[] } = {
            headerFields: [],
            lineItemFields: [
                {
                    name: "position",
                    label: "",
                    description:
                        "first column in invoice table. Might need two lines as its column is quite narrow. Examples for positions are 01.01. . .0030 or 02. . . . If after position, there is no description for this position, the position belongs to the last position.",
                    defaultExtractor: {},
                    predefined: false,
                    setupType: "static",
                    setupTypeVersion: "2.0.0",
                    setup: { type: "auto", priority: 1 },
                    formattingType: "string",
                    formatting: {},
                    formattingTypeVersion: "1.0.0"
                }
            ]
        };
        await doxConnection.send(
            "POST",
            "/schemas/" + schemaId + "/versions/1/fields?clientId=default",
            payloadToAddPositionLineItem
        );
        await doxConnection.send("POST", "/schemas/" + schemaId + "/versions/1/activate?clientId=default");
    };

    private getDoxConnection = () => cds.connect.to(DOX_DESTINATION_PREMIUM);

    /* ------------------------------------------ */

    /* Track previous versions of a deduction, including the latest one */
    private recordLatestDeduction = async (results: any) => {
        const latestDeductionVersion = await SELECT.one.from(Deductions, results.ID);
        const { ID, amount, reason }: Deduction = latestDeductionVersion;
        await INSERT.into(DeductionVersions, [
            {
                deduction_ID: ID,
                amount: amount,
                reason: reason
            }
        ]);
    };

    private recordLatestRetention = async (results: any) => {
        const latestRetentionVersion = await SELECT.one.from(Retentions, results.ID);
        const { ID, amount, reason }: Retention = latestRetentionVersion;
        await INSERT.into(RetentionVersions, [
            {
                retention_ID: ID,
                amount: amount,
                reason: reason
            }
        ]);
    };

    private getNextFlowStatus = (roleNewCV: Roles) => {
        switch (roleNewCV) {
            case Roles.EXTERNAL_VALIDATOR:
                return WorkflowStatus.EXTERNAL_VALIDATOR_CHECK;
            case Roles.ACCOUNTING_MEMBER:
                return WorkflowStatus.FINAL_APPROVAL;
            default:
                return "";
        }
    };
}
