import cds from "@sap/cds";
import FormData from "form-data";
import { Request, Service } from "@sap/cds/apis/services";
import xsenv from "@sap/xsenv";
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
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

const DOX_DESTINATION_PREMIUM: string = "DOX_PREMIUM_INVOICE_VALIDATION";

const s3: any = xsenv.getServices(({ objectstore: { label: "objectstore" } })).objectstore;
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
        this.on("getPositionsFromDOX", this.getPositionsFromDOX);
        this.on("getFileFromS3", (req: Request) => this.getFileFromS3(req.data.s3BucketKey as string));
        this.on("getLineItemsFromDOX", this.getLineItemsFromDOX);
        this.on("areInvoiceExtractionsCompleted", this.areInvoiceExtractionsCompleted);

        // ACTIONS
        this.on("setCV", this.setCV);
        this.on("acceptOrRejectInvoice", this.acceptOrRejectInvoice);
        this.on("assignProjectRole", this.assignProjectRole);
        this.on("uploadFileToS3", this.uploadFileToS3);
        this.on("uploadToDOXToGetPositions", this.uploadToDOXToGetPositions);
        this.on("uploadToDOXToGetLineItems", this.uploadToDOXToGetLineItems);
        this.on("deleteFileFromS3", this.deleteFileFromS3);
        this.on("checkAllDocumentsExtractions", this.checkAllDocumentsExtractions);

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
        const files = await fs.promises.readdir(dir).catch((err) => console.log("Could not read sample invoices to upload. DOX analysis might expect them to be in S3.", err));
        if (!Array.isArray(files)) return;
        // cut off '.pdf'
        let id = files[0].split(".")[0];
        const invoice = await SELECT.one.from(Invoices).where({ invoiceID: id });

        let uploads: Promise<PutObjectCommandOutput>[];
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
        return Promise.all(uploads).catch((err) => console.log("One time upload of sample invoices failed", err))
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

    private async getDoxConnection(): Promise<Service> {
        return await cds.connect.to(DOX_DESTINATION_PREMIUM);
    }

    private uploadInvoicesWithoutJobIDToDOX = async (invoices: any[]) => {
        const invoicesWithoutJobIDs = invoices.filter(
            (invoice) => !invoice.doxPositionsJobID || !invoice.doxLineItemsJobID
        );
        for (const invoiceWithoutJobID of invoicesWithoutJobIDs) {
            const data = { data: { id: invoiceWithoutJobID.invoiceID } };
            const positionsJobID = await this.uploadToDOXToGetPositions(data);
            const lineItemsJobID = await this.uploadToDOXToGetLineItems(data);
            invoices.forEach((invoice) => {
                if (invoice.invoiceID == invoiceWithoutJobID.invoiceID) {
                    invoice.doxPositionsJobID = positionsJobID;
                    invoice.doxLineItemsJobID = lineItemsJobID;
                }
            });
        }
    };

    private cacheDOXResultsInS3 = async (invoiceID: string, extractionType: string, extraction: string) => {
        const s3Client = this.getS3Client();
        const key = invoiceID + extractionType + ".json";
        const buffer = Buffer.from(extraction);

        const command = new PutObjectCommand({ Bucket: BUCKET_S3, Body: buffer, Key: key });
        await s3Client.send(command);
        return;
    };

    private getDOXResultsFromS3 = async (invoiceID: string, extractionType: string) => {
        const key = invoiceID + extractionType + ".json";
        const s3Client = this.getS3Client();
        const command = new GetObjectCommand({ Bucket: BUCKET_S3, Key: key });
        const response = await s3Client.send(command);
        const body = await response.Body.transformToString("utf-8");
        return body;
    };

    private checkDocumentExtractionStatusInterval: NodeJS.Timeout = null;

    private checkDocumentExtractionStatusIntervalCallback = async (invoice: any, intervalTimeout: any) => {
        const doxLineItems = await this.getLineItemsOfInvoice(invoice.invoiceID);
        const doxPositions = await this.getPositionsOfInvoice(invoice.invoiceID);
        if (!doxPositions.status && !doxLineItems.status) {
            await this.cacheDOXResultsInS3(invoice.invoiceID, "lineItems", JSON.stringify(doxLineItems.lineItems));
            await this.cacheDOXResultsInS3(invoice.invoiceID, "positions", JSON.stringify(doxPositions.positions));
            this.currentlyCheckingDocumentExtractions--;
            clearInterval(this.checkDocumentExtractionStatusInterval);
            return;
        }
        if (intervalTimeout < Date.now()) {
            this.currentlyCheckingDocumentExtractions--;
            clearInterval(this.checkDocumentExtractionStatusInterval);
            return;
        }
    };

    private checkAllDocumentsExtractionsBackgroundJob = () => {
        cds.spawn({}, async () => {
            const invoices: { invoiceID?: string; doxPositionsJobID?: string; doxLineItemsJobID?: string }[] =
                await SELECT.from(Invoices).columns(`{ invoiceID, doxPositionsJobID, doxLineItemsJobID }`);
            await this.uploadInvoicesWithoutJobIDToDOX(invoices);
            this.currentlyCheckingDocumentExtractions--;
            for (const invoice of invoices) {
                this.currentlyCheckingDocumentExtractions++;
                if (
                    (await this.getStoredPositionsForInvoice(invoice.invoiceID)) &&
                    (await this.getStoredLineItemsForInvoice(invoice.invoiceID))
                ) {
                    this.currentlyCheckingDocumentExtractions--;
                    continue;
                }
                const doxPositions = await this.getPositionsOfInvoice(invoice.invoiceID);
                const doxLineItems = await this.getLineItemsOfInvoice(invoice.invoiceID);
                if (!doxPositions.status && !doxLineItems.status) {
                    await this.cacheDOXResultsInS3(
                        invoice.invoiceID,
                        "lineItems",
                        JSON.stringify(doxLineItems.lineItems)
                    );
                    await this.cacheDOXResultsInS3(
                        invoice.invoiceID,
                        "positions",
                        JSON.stringify(doxPositions.positions)
                    );
                    this.currentlyCheckingDocumentExtractions--;
                    continue;
                }
                const intervalTimeout = Date.now() + 1000 * 60 * 3;
                this.checkDocumentExtractionStatusInterval = setInterval(
                    () => this.checkDocumentExtractionStatusIntervalCallback(invoice, intervalTimeout),
                    10000
                );
            }
        });
    };

    private currentlyCheckingDocumentExtractions = 0;
    private checkAllDocumentsExtractions = async () => {
        if (this.currentlyCheckingDocumentExtractions != 0) return;
        this.currentlyCheckingDocumentExtractions++;
        /* cds.run(`
                CREATE COLLECTION "${Date.now()}";
                `) */
        this.checkAllDocumentsExtractionsBackgroundJob();
        const invoices: { invoiceID?: string; doxPositionsJobID?: string; doxLineItemsJobID?: string }[] =
            await SELECT.from(Invoices).columns(`{ invoiceID, doxPositionsJobID, doxLineItemsJobID }`);
        const storedInvoices: string[] = invoices
            .filter(
                async (invoice) =>
                    (await this.getStoredPositionsForInvoice(invoice.invoiceID)) &&
                    (await this.getStoredLineItemsForInvoice(invoice.invoiceID))
            )
            .map((invoice) => invoice.invoiceID);
        const waitingFor: string[] = invoices
            .filter((invoice) => !storedInvoices.includes(invoice.invoiceID))
            .map((invoice) => invoice.invoiceID);
        return { storedInvoices: storedInvoices, waitingFor: waitingFor };
    };

    private areInvoiceExtractionsCompleted = async (req: Request) => {
        const invoices: { invoiceID?: string; doxPositionsJobID?: string; doxLineItemsJobID?: string }[] =
            await SELECT.from(Invoices).columns(`{ invoiceID, doxPositionsJobID, doxLineItemsJobID }`);
        const doxConnection = await this.getDoxConnection();
        const doxResponse: {
            results: {
                status: string;
                id: string;
                fileName: string;
                documentType: string;
                created: string;
                finished?: string;
                clientId?: string;
            }[];
        } = await doxConnection.send("GET", "/document/jobs");
        const doxDocumentIDMapToInvoiceID: { [documentID: string]: string } = {};
        const invoiceDocuments = doxResponse.results.filter((document) => {
            for (const invoice of invoices)
                if (invoice.doxPositionsJobID == document.id || invoice.doxLineItemsJobID == document.id) {
                    doxDocumentIDMapToInvoiceID[document.id] = invoice.invoiceID;
                    return true;
                }
            return false;
        });
        let invoicesInfo: { invoiceID: string; status: string }[] = invoiceDocuments.map((invoiceDocument) => {
            return {
                invoiceID: doxDocumentIDMapToInvoiceID[invoiceDocument.id],
                status: invoiceDocument.status
            };
        });
        invoices.forEach((invoice) => {
            if (!invoicesInfo.find((info) => info.invoiceID == invoice.invoiceID))
                invoicesInfo.push({ invoiceID: invoice.invoiceID, status: "PENDING" });
        });
        const invoicesInfoWithoutDuplicateInvoices: typeof invoicesInfo = Object.values(
            invoicesInfo.reduce((acc: any, { invoiceID, status }) => {
                acc[invoiceID] = acc[invoiceID] || { invoiceID, status: "DONE" };
                if (status === "PENDING") {
                    acc[invoiceID].status = "PENDING";
                }
                return acc;
            }, {})
        );
        const isDocumentProcessedMap: { [invoiceID: string]: boolean } = {};
        invoicesInfoWithoutDuplicateInvoices.forEach((info: any) => {
            if (info.status == "DONE") isDocumentProcessedMap[info.invoiceID] = true;
            else isDocumentProcessedMap[info.invoiceID] = false;
        });
        return isDocumentProcessedMap;
    };

    // easy cache by storing the results in a file on the server
    private getStoredPositionsForInvoice = async (invoiceID: string) => {
        let fileContent;
        try {
            fileContent = await this.getDOXResultsFromS3(invoiceID, "positions");
        } catch (err) {}
        if (fileContent) return JSON.parse(fileContent.toString());
        return null;
    };

    private getPositionsOfInvoice = async (invoiceID: string) => {
        const storedJobID = (
            await SELECT.from(Invoices).columns(`{ doxPositionsJobID }`).where({ invoiceID: invoiceID })
        )[0].doxPositionsJobID;
        if (!storedJobID) throw new Error("No stored job ID found for invoice " + invoiceID);

        const storedPositions = await this.getStoredPositionsForInvoice(invoiceID);
        if (storedPositions) return { positions: storedPositions, storedLoad: true };

        const path = "/document/jobs/" + storedJobID;

        const doxConnection = await this.getDoxConnection();
        const json = await doxConnection.send("GET", path);

        if (json.status == "PENDING") return { status: "PENDING" };
        return { positions: json, storedLoad: false };
    };

    private getPositionsFromDOX = async (req: Request) => {
        const { data } = req;
        const invoiceID: string = data.id;
        const json = await this.getPositionsOfInvoice(invoiceID);

        return JSON.stringify(this.mapLineItemsToPositions(json.positions.extraction.lineItems));
    };

    private mapLineItemsToPositions(lineItems: any) {
        return lineItems.map((lineItemsOfLine: any) => lineItemsOfLine[0]);
    }

    private async getFormDataForDOXUpload(invoiceID: string, DOX_OPTIONS: object, pdfName: string): Promise<FormData> {
        const formData = new FormData();
        const pdfFile = await this.getPDFById(invoiceID);
        const pdfByteArray = await pdfFile.transformToByteArray();
        formData.append("options", JSON.stringify(DOX_OPTIONS));
        let buffer = Buffer.from(pdfByteArray);
        formData.append("file", buffer, pdfName);
        return formData;
    }

    private currentlyUploadingDocumentForPositions: { [invoiceID: string]: boolean } = {};
    private uploadToDOXToGetPositions = async (req: Request | { data: { id: string } }) => {
        const { data } = req;
        const invoiceID: string = data.id;
        if (this.currentlyUploadingDocumentForPositions[invoiceID]) return;
        this.currentlyUploadingDocumentForPositions[invoiceID] = true;
        const storedJobID = (
            await SELECT.from(Invoices).columns(`{ doxPositionsJobID }`).where({ invoiceID: invoiceID })
        )[0].doxPositionsJobID;
        if (storedJobID && storedJobID != "") return storedJobID;

        const pdfName: string = invoiceID + "-Positions.pdf";
        const path = "/document/jobs";
        const DOX_OPTIONS = {
            clientId: "default",
            documentType: "custom",
            schemaId: "ad3d4870-0703-4f63-9059-7ff385a57a20",
            enrichtment: {}
        };

        const formData = await this.getFormDataForDOXUpload(invoiceID, DOX_OPTIONS, pdfName);

        const doxConnection = await this.getDoxConnection();

        const json = await doxConnection.send("POST", path, formData.getBuffer(), formData.getHeaders());

        const jobID = json.id;
        await UPDATE(Invoices, invoiceID).with({ doxPositionsJobID: jobID });
        this.currentlyUploadingDocumentForPositions[invoiceID] = false;
        return jobID;
    };

    // easy cache by storing the results in a file on the server
    private getStoredLineItemsForInvoice = async (invoiceID: string) => {
        let fileContent;
        try {
            fileContent = await this.getDOXResultsFromS3(invoiceID, "lineItems");
        } catch (err) {}
        if (fileContent) return JSON.parse(fileContent.toString());
        return null;
    };

    private getLineItemsOfInvoice = async (invoiceID: string): Promise<any> => {
        const storedLineItems = await this.getStoredLineItemsForInvoice(invoiceID);
        if (storedLineItems) return { lineItems: storedLineItems, storedLoad: true };
        const storedJobID = (
            await SELECT.from(Invoices).columns(`{ doxLineItemsJobID }`).where({ invoiceID: invoiceID })
        )[0].doxLineItemsJobID;

        const path = "/document/jobs/" + storedJobID;

        const doxConnection = await this.getDoxConnection();
        const json = await doxConnection.send("GET", path);

        if (json.status == "PENDING") return { status: "PENDING" };
        return { lineItems: json, storedLoad: false };
    };

    private getLineItemsFromDOX = async (req: Request) => {
        const { data } = req;
        const invoiceID: string = data.id;
        const json = await this.getLineItemsOfInvoice(invoiceID);
        return JSON.stringify(json.lineItems.extraction.lineItems);
    };

    private currentlyUploadingDocumentForLineItems: { [invoiceID: string]: boolean } = {};
    private uploadToDOXToGetLineItems = async (req: Request | { data: { id: string } }) => {
        const { data } = req;
        const invoiceID: string = data.id;
        if (this.currentlyUploadingDocumentForLineItems[invoiceID]) return;
        this.currentlyUploadingDocumentForLineItems[invoiceID] = true;
        const storedJobID = (
            await SELECT.from(Invoices).columns(`{ doxLineItemsJobID }`).where({ invoiceID: invoiceID })
        )[0].doxLineItemsJobID;
        if (storedJobID && storedJobID != "") return storedJobID;

        const pdfName: string = invoiceID + "-LineItems.pdf";
        const path = "/document/jobs";
        const DOX_OPTIONS = {
            clientId: "default",
            documentType: "invoice",
            extraction: { lineItemFields: ["description", "netAmount", "quantity", "unitPrice", "unitOfMeasure"] }
        };

        const formData = await this.getFormDataForDOXUpload(invoiceID, DOX_OPTIONS, pdfName);

        const doxConnection = await this.getDoxConnection();
        const json = await doxConnection.send("POST", path, formData.getBuffer(), formData.getHeaders());

        const jobID = json.id;
        await UPDATE(Invoices, invoiceID).with({ doxLineItemsJobID: jobID });
        this.currentlyUploadingDocumentForLineItems[invoiceID] = false;
        return jobID;
    };

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

    /* HELPERS */

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

interface Item {
    name: string;
    category: string;
    value: string;
    rawValue: string;
    type: string;
    page: number;
    confidence: number;
    coordinates: Coordinates;
    label: string;
    index?: number;
}

interface Coordinates {
    x: number;
    y: number;
}

interface InputObject {
    lineItems: Item[][];
}

interface OutputObject {
    lineItems: Item[];
}
