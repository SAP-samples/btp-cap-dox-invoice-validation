import {
    FileUploader,
    AnalyticalTable,
    AnalyticalTableColumnDefinition,
    Button,
    Toolbar,
    ToolbarSpacer,
    Title,
    TextAlign
} from "@ui5/webcomponents-react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";

import { Document, Documents, Invoice } from "@entities";
import { BASE_URL_CAP } from "@/constants";
import DeleteButton from "@/custom/DeleteButton";
import { formatDate } from "@/formatters";
import Surface from "@/custom/Surface";
import { UserContext } from "@/contexts/UserContext";
import { Dispatch, SetStateAction, useCallback, useContext, useMemo } from "react";

interface AllDocumentsTableData {
    fileName: string;
    uploadedOn: string;
    uploadedBy: string;
    s3BucketKey: string;
    ID: string;
}

interface CellInstance {
    cell: {
        row: {
            original: AllDocumentsTableData;
        };
    };
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: any;
}

export default function DocumentsCard({
    additionalDocuments,
    setAdditionalDocuments,
    invoice,
    isCVState,
    setDialogState,
    isInvoiceImmutable
}: {
    additionalDocuments: Documents;
    setAdditionalDocuments: Dispatch<SetStateAction<Documents>>;
    invoice: Invoice;
    isCVState: boolean;
    setDialogState: Dispatch<
        SetStateAction<{
            showDialog: boolean;
            dialogText: string;
            onConfirm: () => void;
        }>
    >;
    isInvoiceImmutable: boolean;
}) {
    const i18n = useI18nBundle("app");
    const { isAdmin } = useContext(UserContext);
    const isUserAdmin = isAdmin();

    function getAllDocumentsTableData(): AllDocumentsTableData[] {
        return additionalDocuments.map((document) => {
            return {
                fileName: document.fileName as string,
                uploadedOn: formatDate(document.createdAt as string),
                uploadedBy: document.createdBy as string,
                s3BucketKey: document.s3BucketKey as string,
                ID: document.ID as string
            };
        });
    }

    async function uploadDocument(invoiceID: string, fileName: string, base64String: string) {
        const response = await fetch(`${BASE_URL_CAP}/uploadFileToS3`, {
            method: "POST",
            headers: new Headers({ "content-type": "application/json" }),
            body: JSON.stringify({
                invoiceID,
                fileName,
                file: base64String
            })
        });
        if (response.ok) {
            const uploadedDocument = (await response.json()) as Document;
            setAdditionalDocuments([...additionalDocuments, uploadedDocument]);
        }
    }
    function UploadDocumentButton() {
        return (
            <FileUploader
                hideInput
                onChange={(event) => {
                    const files = event.detail.files;
                    if (files) {
                        const document = files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            if (reader.result) {
                                let base64String = reader.result as string;
                                base64String = base64String.replace("data:", "").replace(/^.+,/, "");
                                uploadDocument(invoice.invoiceID as string, document.name, base64String).catch(
                                    console.log
                                );
                            }
                        };
                        reader.readAsDataURL(document);
                    }
                }}
                style={{
                    ...spacing.sapUiTinyMarginBegin,
                    ...spacing.sapUiMediumMarginTop,
                    ...spacing.sapUiMediumMarginBottom
                }}
            >
                <Button icon="add" design="Transparent">
                    {i18n.getText({ key: "uploadDocument", defaultText: "" })}
                </Button>
            </FileUploader>
        );
    }

    const deleteDocument = useCallback(
        async (s3BucketKey: string, documentId: string, event: React.MouseEvent<HTMLElement> | undefined) => {
            const button = event?.target as HTMLButtonElement;
            button.disabled = true;
            try {
                const response = await fetch(`${BASE_URL_CAP}/deleteFileFromS3`, {
                    method: "POST",
                    headers: new Headers({ "content-type": "application/json" }),
                    body: JSON.stringify({
                        s3BucketKey,
                        documentId
                    })
                });
                if (response.ok) {
                    const documents = [...additionalDocuments];
                    const index = documents.findIndex((doc) => doc.ID === documentId);
                    if (index !== -1) {
                        // remove previously deleted document from state
                        documents.splice(index, 1);
                        setAdditionalDocuments(documents);
                    }
                }
            } catch (err) {
                console.log(err);
            } finally {
                button.disabled = false;
            }
        },
        [additionalDocuments, setAdditionalDocuments]
    );

    const allDocumentsTableColumns: Array<AnalyticalTableColumnDefinition> = useMemo(() => {
        const columns: Array<AnalyticalTableColumnDefinition> = [
            {
                Cell: (instance: CellInstance) => DocumentFileName(instance),
                Header: `${i18n.getText({ key: "document", defaultText: "" })}`,
                accessor: "document"
            },
            {
                Header: `${i18n.getText({ key: "uploadedOn", defaultText: "" })}`,
                accessor: "uploadedOn"
            },
            {
                Header: `${i18n.getText({ key: "uploadedBy", defaultText: "" })}`,
                accessor: "uploadedBy"
            }
        ];
        if (!isInvoiceImmutable && (isCVState || isUserAdmin)) {
            columns.push({
                Cell: (instance: CellInstance) => (
                    <DeleteButton
                        onClickFunction={(event) =>
                            setDialogState({
                                showDialog: true,
                                dialogText: i18n.getText({ key: "deleteDocumentDialog", defaultText: "" }),
                                onConfirm: () => {
                                    void deleteDocument(
                                        instance.cell.row.original.s3BucketKey,
                                        instance.cell.row.original.ID,
                                        event
                                    );
                                    setDialogState((previousState) => ({
                                        ...previousState,
                                        showDialog: false
                                    }));
                                }
                            })
                        }
                    />
                ),
                Header: "",
                accessor: ".",
                hAlign: TextAlign.Center,
                disableFilters: true,
                disableGroupBy: true,
                disableResizing: true,
                disableSortBy: true,
                width: 64
            });
        }
        return columns;
    }, [deleteDocument, i18n, isCVState, isUserAdmin, setDialogState]);

    return (
        <Surface style={spacing.sapUiMediumMarginTop}>
            <AnalyticalTable
                header={
                    <Toolbar design="Transparent" toolbarStyle="Standard">
                        <Title level={"H5"} style={{ ...spacing.sapUiTinyMarginBegin }}>
                            {i18n.getText({ key: "allDocuments", defaultText: "" })}
                        </Title>
                        {!isInvoiceImmutable && (isCVState || isUserAdmin) && (
                            <>
                                <ToolbarSpacer />
                                <UploadDocumentButton />
                            </>
                        )}
                    </Toolbar>
                }
                noDataText={i18n.getText({ key: "noDocuments", defaultText: "" })}
                data={getAllDocumentsTableData()}
                columns={allDocumentsTableColumns}
                minRows={1}
            />
        </Surface>
    );
}

function DocumentFileName(instance: CellInstance) {
    function fetchDocument(s3BucketKey: string) {
        return fetch(`${BASE_URL_CAP}/getPdfBytesByKey(s3BucketKey='${s3BucketKey}')`);
    }
    const originalData = instance.cell.row.original;
    return (
        <a
            className="downloadLink"
            download={originalData.fileName}
            onClick={async (event) => {
                const link = event.target as HTMLAnchorElement;
                const href = link.getAttribute("href");
                // on first time click, after that href is already set to object url
                if (!href) {
                    let bucketKey = originalData.s3BucketKey;
                    // valid odata urls must not contain raw "/"
                    bucketKey = bucketKey.replace("/", "%2F");
                    const response = await fetchDocument(bucketKey);
                    if (response.ok) {
                        const data = await response.json();
                        const bytesAsciiEncoded = atob(data.value as string);
                        const bytes = Uint8Array.from(bytesAsciiEncoded, (char) => char.codePointAt(0) as number);
                        const objectUrl = window.URL.createObjectURL(new Blob([bytes]));
                        link.setAttribute("href", objectUrl);
                        link.click();
                    }
                }
            }}
        >
            {originalData.fileName}
        </a>
    );
}
