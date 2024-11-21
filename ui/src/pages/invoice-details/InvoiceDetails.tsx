import {
    Text,
    ObjectStatus,
    FlexBox,
    Button,
    Title,
    Label,
    DynamicPageTitle,
    DynamicPage,
    DynamicPageHeader,
    SplitterLayout,
    SplitterElement,
    MessageBox,
    MessageBoxActions,
    Bar,
    BarDesign
} from "@ui5/webcomponents-react";
import { useState, useEffect, useLayoutEffect, useContext, useRef } from "react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";
import { useParams } from "react-router-dom";
import "@ui5/webcomponents-icons/dist/accept.js";
import "@ui5/webcomponents-icons/dist/decline.js";

import {
    Invoice,
    Position,
    Positions,
    PositionCorrections,
    Documents,
    FlowStatuses,
    Projects_Users,
    WorkflowStatus,
    Deductions,
    Deduction,
    Retentions,
    Retention
} from "@entities";
import { BASE_URL_CAP } from "@/constants";
import { WORKFLOW_STATUS_I18N_KEY_MAPPING, formatDate, getCurrentFlowStatus } from "@/formatters";

import { UserContext } from "@/contexts/UserContext";
import {
    InvoiceCorrection,
    NewPositionInsertion,
    ChangePositionCorrection,
    ChangeDeductionCorrection,
    NewDeductionInsertion,
    NewRetention,
    ChangeRetention
} from "./view-states";
import ForwardingDialog from "./ForwardingDialog";
import ConfirmationDialog from "@/custom/ConfirmationDialog";
import { Metadata, downloadSnapshot } from "./download-snapshot";
import HistoryDialog from "./HistoryDialog";
import AnnotatedPDFViewer from "./AnnotatedPDFViewer";

export enum ViewState {
    INVOICE_CORRECTION = "INVOICE_CORRECTION",
    ADD_NEW_POSITION = "ADD_NEW_POSITION",
    CHANGE_CORRECTION = "CHANGE_CORRECTION",
    ADD_NEW_DEDUCTION = "ADD_NEW_DEDUCTION",
    CHANGE_DEDUCTION_CORRECTION = "CHANGE_DEDUCTION_CORRECTION",
    ADD_NEW_RETENTION = "ADD_NEW_RETENTION",
    CHANGE_RETENTION = "CHANGE_RETENTION"
}
export interface CorrectionSession {
    position: Position;
    previousCorrections: PositionCorrections;
}
export interface PdfBytes {
    data: Uint8Array;
}

export default function InvoiceDetails() {
    const { id } = useParams();
    const [viewState, setViewState] = useState<ViewState>(ViewState.INVOICE_CORRECTION);

    const [openForwardingDialog, setOpenForwardingDialog] = useState<boolean>(false);
    const [isCVState, setIsCVState] = useState<boolean>(false);
    const { deriveListOfPossibleCV, isCV, isAccountingMember, isExternalValidator } = useContext(UserContext);

    const [invoiceDetails, setInvoiceDetails] = useState<Invoice>({} as Invoice);
    const [positions, setPositions] = useState<Positions>([]);
    const [correctionSession, setCorrectionSession] = useState<CorrectionSession>({} as CorrectionSession);
    const [deductions, setDeductions] = useState<Deductions>([]);
    const [focusedDeduction, setFocusedDeduction] = useState<Deduction>({});
    const [retentions, setRetentions] = useState<Retentions>([]);
    const [focusedRetention, setFocusedRetention] = useState<Retention>({});

    const [pdfBytes, setPdfBytes] = useState<PdfBytes | undefined>(undefined);
    // store pdf as base64 string for download of snapshot later
    // because Uint8Array eventually becomes detached
    const pdfBytesBase64String = useRef("");
    const pdfScrollbarRef = useRef<HTMLDivElement>(null);
    const [navigateToPositionInPDF, setNavigateToPositionInPDF] = useState<((props: any) => void) | null>(null);
    const [additionalDocuments, setAdditionalDocuments] = useState<Documents>([]);
    const [selectedFinalInvoiceStatus, setSelectedFinalInvoiceStatus] = useState<WorkflowStatus | null>(null);

    const [windowHeight, setWindowHeight] = useState<number>(0);
    const [PDFViewerWidth, setPDFViewerWidth] = useState<number>(0);

    const [openHistoryDialog, setOpenHistoryDialog] = useState<boolean>(false);
    const [initialNewPositionCorrectionValues, setInitialNewPositionCorrectionValues] = useState();

    useLayoutEffect(() => {
        const updateSize = () => {
            centerPage();
            setWindowHeight(window.innerHeight);
        };
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    useEffect(() => {
        fetchSelectedInvoice(id as string).catch(console.log);
        fetchPdfBytes(id as string).catch(console.log);
    }, [id]);

    async function fetchSelectedInvoice(id: string) {
        const url =
            BASE_URL_CAP +
            `/Invoices('${id}')?$expand=project($expand=users),positions($expand=corrections),deductions($expand=corrections),retentions($expand=corrections),additionalDocuments,statuses`;
        const response = await fetch(url);
        if (response.ok) {
            const data = (await response.json()) as Invoice;
            setPositions(data.positions as Positions);
            setAdditionalDocuments(data.additionalDocuments as Documents);
            setDeductions(data.deductions as Deductions);
            setRetentions(data.retentions as Retentions);

            const invoiceDetails: Invoice = { ...data };
            delete invoiceDetails.positions;
            delete invoiceDetails.additionalDocuments;
            // store all invoice data except positions, which are stored in other state
            setInvoiceDetails(invoiceDetails);
        }
    }

    async function fetchPdfBytes(invoiceID: string) {
        const response = await fetch(`${BASE_URL_CAP}/getPdfBytesByInvoiceID(invoiceID='${invoiceID}')`);
        if (response.ok) {
            const data = await response.json();
            const pdfAsAscii = atob(data.value as string);
            // decode base64 string representing pdf data back as shown
            // here: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
            const pdfBytes = Uint8Array.from(pdfAsAscii, (char) => char.codePointAt(0) as number);
            setPdfBytes({ data: pdfBytes });
            pdfBytesBase64String.current = data.value as string;
        }
    }

    async function forwardForCorrection(projectId: string, invoiceId: string, idNewCV: string) {
        const body: any = {
            projectId: projectId,
            invoiceId: invoiceId,
            idNewCV: idNewCV
        };
        const response = await fetch(`${BASE_URL_CAP}/setCV`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const data = await response.json();
            const statusHistory = invoiceDetails.statuses as FlowStatuses;
            statusHistory.push(data.newFlowStatus);
            setIsCVState(false);
            // @ts-ignore
            // eslint-disable-next-line camelcase
            setInvoiceDetails({ ...invoiceDetails, statuses: statusHistory, CV_user_ID: idNewCV });
            setOpenForwardingDialog(false);
        }
    }

    async function acceptOrRejectInvoice(invoiceId: string, status: WorkflowStatus) {
        const body: any = {
            status: status,
            invoiceId: invoiceId
        };
        const response = await fetch(`${BASE_URL_CAP}/acceptOrRejectInvoice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            const data = await response.json();
            const statusHistory = invoiceDetails.statuses as FlowStatuses;
            statusHistory.push(data.newFlowStatus);
            // @ts-ignore
            // eslint-disable-next-line camelcase
            setInvoiceDetails({ ...invoiceDetails, CV_user_ID: null, CV_project_ID: null, statuses: statusHistory });
            setIsCVState(false);
        }
    }

    const handleChangeCorrectionClick = (positionID: string) => {
        setViewState(ViewState.CHANGE_CORRECTION);
        const position = positions.find((position) => position.ID === positionID);
        if (position) {
            const sortedCorrections = [...(position.corrections ?? [])].sort(
                // sort corrections from latest to oldest
                (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
            );
            setCorrectionSession({ position: position, previousCorrections: sortedCorrections });
        }
    };

    const handleChangeDeductionCorrectionClick = (deduction: Deduction) => {
        setViewState(ViewState.CHANGE_DEDUCTION_CORRECTION);
        setFocusedDeduction(deduction);
    };

    const handleChangeRentionClick = (retention: Retention) => {
        setViewState(ViewState.CHANGE_RETENTION);
        setFocusedRetention(retention);
    };

    const [dialogState, setDialogState] = useState<{
        showDialog: boolean;
        dialogText: string;
        onConfirm: () => void;
    }>({
        showDialog: false,
        dialogText: "",
        onConfirm: () => {}
    });

    function getDedicatedView(viewState: ViewState): JSX.Element {
        switch (viewState) {
            case ViewState.ADD_NEW_POSITION:
                return (
                    <NewPositionInsertion
                        handleBackAndSaveButton={() => {
                            setViewState(ViewState.INVOICE_CORRECTION);
                        }}
                        id={id as string}
                        positions={positions}
                        setPositions={setPositions}
                        initialValues={initialNewPositionCorrectionValues}
                        setInitialValues={setInitialNewPositionCorrectionValues}
                    />
                );
            case ViewState.CHANGE_CORRECTION:
                return (
                    <ChangePositionCorrection
                        correctionSession={correctionSession}
                        onCancel={() => {
                            setViewState(ViewState.INVOICE_CORRECTION);
                            setCorrectionSession({} as CorrectionSession);
                        }}
                        positions={positions}
                        setPositions={setPositions}
                    />
                );
            case ViewState.ADD_NEW_DEDUCTION:
                return (
                    <NewDeductionInsertion
                        onCancel={() => setViewState(ViewState.INVOICE_CORRECTION)}
                        invoice={invoiceDetails}
                        setDeductions={setDeductions}
                    />
                );
            case ViewState.CHANGE_DEDUCTION_CORRECTION:
                return (
                    <ChangeDeductionCorrection
                        deductions={deductions}
                        onCancel={() => {
                            setViewState(ViewState.INVOICE_CORRECTION);
                        }}
                        focusedDeduction={focusedDeduction}
                        setDeductions={setDeductions}
                    />
                );
            case ViewState.ADD_NEW_RETENTION:
                return (
                    <NewRetention
                        invoice={invoiceDetails}
                        setRetentions={setRetentions}
                        onCancel={() => setViewState(ViewState.INVOICE_CORRECTION)}
                    />
                );
            case ViewState.CHANGE_RETENTION:
                return (
                    <ChangeRetention
                        retentions={retentions}
                        setRetentions={setRetentions}
                        onCancel={() => setViewState(ViewState.INVOICE_CORRECTION)}
                        focusedRetention={focusedRetention}
                    />
                );
            default:
                return (
                    <InvoiceCorrection
                        invoice={invoiceDetails}
                        positions={positions}
                        setPositions={setPositions}
                        setViewState={setViewState}
                        handleChangeCorrectionClick={handleChangeCorrectionClick}
                        additionalDocuments={additionalDocuments}
                        setAdditionalDocuments={setAdditionalDocuments}
                        handleChangeDeductionCorrectionClick={handleChangeDeductionCorrectionClick}
                        handleChangeRetentionClick={handleChangeRentionClick}
                        isCVState={isCVState}
                        deductions={deductions}
                        setDeductions={setDeductions}
                        retentions={retentions}
                        setRetentions={setRetentions}
                        totalCorrection={totalCorrection}
                        setDialogState={setDialogState}
                        navigateToPositionInPDF={navigateToPositionInPDF}
                    />
                );
        }
    }

    const activeView: JSX.Element = getDedicatedView(viewState);
    const i18n = useI18nBundle("app");
    let translatedStatus = "";
    let flowStatus;
    if (Object.keys(invoiceDetails).includes("statuses")) {
        const workflowStatuses = invoiceDetails.statuses as FlowStatuses;
        flowStatus = getCurrentFlowStatus(workflowStatuses);
        const translationKey = WORKFLOW_STATUS_I18N_KEY_MAPPING[flowStatus] as string;
        translatedStatus = i18n.getText({ key: translationKey, defaultText: "" });
    }
    let confirmInvoiceStatusMessage = "";
    if (selectedFinalInvoiceStatus) {
        let placeholderInserted = "";
        if (selectedFinalInvoiceStatus === WorkflowStatus.ACCEPTED) {
            // string interpolation of translation string
            placeholderInserted = i18n.getText({ key: "accept", defaultText: "" });
        } else {
            placeholderInserted = i18n.getText({ key: "reject", defaultText: "" });
        }
        confirmInvoiceStatusMessage = i18n.getText(
            { key: "confirmInvoiceStatus", defaultText: "" },
            placeholderInserted.toLowerCase()
        );
    }

    let possibleNewCV: Projects_Users = [];
    let hasAccountingMemberRole = false;
    let hasExternalValidatorRole = false;
    if (Object.keys(invoiceDetails).includes("project")) {
        const projectStaff = invoiceDetails.project?.users as Projects_Users;
        possibleNewCV = deriveListOfPossibleCV(projectStaff);
        // @ts-ignore
        if (isCV(invoiceDetails.CV_user_ID as string) && !isCVState) setIsCVState(true);
        const projectId = invoiceDetails.project?.ID as string;
        hasAccountingMemberRole = isAccountingMember(projectId);
        hasExternalValidatorRole = isExternalValidator(projectId);
    }

    // PAGE SPLITTER

    let pageSplitterIsClicked: boolean;

    const centerPage = () => {
        const parentElementWidth = document.getElementById("pdfSplitterElement")?.parentElement?.offsetWidth;
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const splitterButtonWidth = document.getElementById("pageSplitter")?.childNodes[1]?.offsetWidth;
        if (parentElementWidth && splitterButtonWidth) {
            (document.getElementById("pdfSplitterElement") as HTMLElement).style.flex =
                "0 0 " + (parentElementWidth - splitterButtonWidth) / 2 + "px";
            const pdfSplitterElementWidth = getPDFSplitterElementWidth();
            if (pdfSplitterElementWidth != undefined) setPDFWidth(pdfSplitterElementWidth);
        }
    };

    function setPDFWidth(width: number) {
        if (width < window.innerWidth * 0.4) {
            setPDFViewerWidth(window.innerWidth * 0.4);
            return;
        }
        setPDFViewerWidth(width);
    }

    function getPDFSplitterElementWidth(): number | undefined {
        return document.getElementById("pdfSplitterElement")?.offsetWidth;
    }

    function releasePageSplitter() {
        if (pageSplitterIsClicked) {
            pageSplitterIsClicked = !pageSplitterIsClicked;
            const pdfSplitterElementWidth = getPDFSplitterElementWidth();
            if (pdfSplitterElementWidth != undefined) setPDFWidth(pdfSplitterElementWidth);
        }
    }

    document.onmouseup = releasePageSplitter;

    const pageSplitterSlider = document.getElementById("pageSplitter")?.children[1];
    if (pageSplitterSlider) {
        pageSplitterSlider.addEventListener("mousedown", () => {
            pageSplitterIsClicked = true;
        });
        pageSplitterSlider.addEventListener("dblclick", centerPage);
    }
    const dynamicPage = document.getElementById("dynamicPage");
    if (dynamicPage) dynamicPage.style.maxHeight = "calc(100% - " + dynamicPage.offsetTop + "px)";

    const deductionsTotal: number = deductions.reduce(
        (total: number, current: Deduction) => total + (current.amount || 0),
        0
    );

    const retentionsTotal: number = retentions.reduce(
        (total: number, current: Retention) => total + (current.amount || 0),
        0
    );

    const getCorrectionAmountOfPosition = (position: Position) => {
        const correctionsArray = position.corrections as PositionCorrections;

        if (correctionsArray) {
            correctionsArray.sort(
                (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
            );
            const latestCorrection = correctionsArray[0];
            const firstCorrection = correctionsArray[correctionsArray.length - 1];
            if (
                latestCorrection.revisedUnitPrice &&
                latestCorrection.revisedUnitQuantity &&
                firstCorrection.revisedUnitPrice &&
                firstCorrection.revisedUnitQuantity
            ) {
                const difference =
                    latestCorrection.revisedUnitPrice * latestCorrection.revisedUnitQuantity -
                    firstCorrection.revisedUnitPrice * firstCorrection.revisedUnitQuantity;
                return difference;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    };

    function totalCorrection() {
        const totalCorrectionAmount = positions.reduce(
            (accumulator, position) => accumulator + getCorrectionAmountOfPosition(position),
            0
        );
        return totalCorrectionAmount;
    }

    const sumPositionCorrections = totalCorrection();
    function calculateFinalPrice() {
        if (invoiceDetails.total) {
            const netInvoice = invoiceDetails.total + sumPositionCorrections - retentionsTotal - deductionsTotal;
            return netInvoice;
        }
        return -1;
    }

    const finalPrice = calculateFinalPrice();

    return (
        <>
            <DynamicPage
                id="dynamicPage"
                style={{ width: "100%", overflow: "hidden" }}
                alwaysShowContentHeader
                showHideHeaderButton={false}
                headerContentPinnable={false}
                headerTitle={
                    <DynamicPageTitle
                        actions={
                            <>
                                <Button design="Transparent" onClick={() => setOpenHistoryDialog(true)}>
                                    {i18n.getText({ key: "history", defaultText: "" })}
                                </Button>
                                <Button
                                    design="Emphasized"
                                    onClick={() => {
                                        const { invoiceID, project, dueDate, costGroup, total } = invoiceDetails;
                                        const metadata: Metadata = {
                                            invoiceId: invoiceID as string,
                                            projectName: project?.name as string,
                                            dueDate: formatDate(dueDate as string),
                                            costGroup: costGroup as string,
                                            grossAmount: total as number,
                                            newGrossAmount: finalPrice
                                        };
                                        const now = new Date();
                                        const currentTime =
                                            formatDate(now.toISOString()) +
                                            ", " +
                                            now.toLocaleTimeString("en", { timeStyle: "short", hour12: false });
                                        downloadSnapshot(
                                            metadata,
                                            pdfBytesBase64String.current,
                                            currentTime,
                                            [...positions].sort((a, b) => a.index! - b.index!),
                                            sumPositionCorrections,
                                            deductions,
                                            retentions
                                        ).catch(console.log);
                                    }}
                                >
                                    {i18n.getText("download")}
                                </Button>
                            </>
                        }
                        header={<Title>{invoiceDetails.company}</Title>}
                    ></DynamicPageTitle>
                }
                headerContent={
                    <DynamicPageHeader>
                        <FlexBox direction="Row">
                            <FlexBox direction="Column">
                                <Label>{i18n.getText({ key: "project", defaultText: "" })}</Label>
                                <Text style={spacing.sapUiTinyMarginTop}>{invoiceDetails.project?.name}</Text>
                            </FlexBox>
                            <FlexBox direction="Column" style={spacing.sapUiMediumMarginBegin}>
                                <Label>{i18n.getText({ key: "invoiceNumber", defaultText: "" })}</Label>
                                <Text style={spacing.sapUiTinyMarginTop}>{invoiceDetails.invoiceID}</Text>
                            </FlexBox>
                            <FlexBox direction="Column" style={spacing.sapUiMediumMarginBegin}>
                                <Label>{i18n.getText({ key: "costGroup", defaultText: "" })}</Label>
                                <Text style={spacing.sapUiTinyMarginTop}>{invoiceDetails.costGroup}</Text>
                            </FlexBox>
                            <FlexBox direction="Column" style={spacing.sapUiMediumMarginBegin}>
                                <Label>{i18n.getText({ key: "dueDate", defaultText: "" })}</Label>
                                <Text style={spacing.sapUiTinyMarginTop}>
                                    {invoiceDetails.dueDate ? formatDate(invoiceDetails.dueDate) : ""}
                                </Text>
                            </FlexBox>
                            <FlexBox direction="Column" style={spacing.sapUiMediumMarginBegin}>
                                <Label>{i18n.getText({ key: "mwst", defaultText: "" })}</Label>
                                <Text style={spacing.sapUiTinyMarginTop}>19 %</Text>
                            </FlexBox>
                            <FlexBox direction="Column" style={spacing.sapUiMediumMarginBegin}>
                                <Label>{i18n.getText({ key: "workflowStatus", defaultText: "" })}</Label>
                                <ObjectStatus style={spacing.sapUiTinyMarginTop} state="Information" showDefaultIcon>
                                    {translatedStatus}
                                </ObjectStatus>
                            </FlexBox>
                            {flowStatus !== WorkflowStatus.ACCEPTED && flowStatus !== WorkflowStatus.REJECTED && (
                                <FlexBox direction="Column" style={spacing.sapUiMediumMarginBegin}>
                                    <Label>{i18n.getText({ key: "validatorStatus", defaultText: "" })}</Label>
                                    <ObjectStatus
                                        style={spacing.sapUiTinyMarginTop}
                                        showDefaultIcon
                                        state={isCVState ? "Information" : "Warning"}
                                    >
                                        {isCVState
                                            ? i18n.getText({ key: "isCV", defaultText: "" })
                                            : i18n.getText({ key: "isNotCV", defaultText: "" })}
                                    </ObjectStatus>
                                </FlexBox>
                            )}
                            <FlexBox direction="Column" style={spacing.sapUiMediumMarginBegin}>
                                <Label>{i18n.getText({ key: "grossAmount", defaultText: "" })}</Label>
                                <Text
                                    style={{
                                        ...spacing.sapUiTinyMarginTop,
                                        textDecoration:
                                            finalPrice !== -1 && invoiceDetails.total != finalPrice
                                                ? "line-through #30914C"
                                                : "none"
                                    }}
                                >
                                    {invoiceDetails.total && invoiceDetails.total?.toFixed(2) + " EUR"}
                                </Text>
                            </FlexBox>
                            <FlexBox direction="Column" style={spacing.sapUiMediumMarginBegin}>
                                <Label>{i18n.getText({ key: "newGrossAmount", defaultText: "" })}</Label>
                                <Text style={{ color: "#30914C", ...spacing.sapUiTinyMarginTop }}>
                                    {finalPrice != -1 && finalPrice.toFixed(2) + "EUR"}
                                </Text>
                            </FlexBox>
                        </FlexBox>
                    </DynamicPageHeader>
                }
                footer={
                    isCVState ? (
                        <>
                            <Bar
                                design={BarDesign.FloatingFooter}
                                endContent={
                                    <>
                                        {(hasAccountingMemberRole || hasExternalValidatorRole) && (
                                            <Button design="Emphasized" onClick={() => setOpenForwardingDialog(true)}>
                                                {i18n.getText({ key: "forward", defaultText: "" })}
                                            </Button>
                                        )}
                                        {hasAccountingMemberRole && (
                                            <>
                                                <Button
                                                    design="Positive"
                                                    icon="accept"
                                                    onClick={() =>
                                                        setSelectedFinalInvoiceStatus(
                                                            WorkflowStatus.ACCEPTED as WorkflowStatus
                                                        )
                                                    }
                                                >
                                                    {i18n.getText({ key: "accept", defaultText: "" })}
                                                </Button>
                                                <Button
                                                    design="Negative"
                                                    icon="decline"
                                                    onClick={() =>
                                                        setSelectedFinalInvoiceStatus(
                                                            WorkflowStatus.REJECTED as WorkflowStatus
                                                        )
                                                    }
                                                >
                                                    {i18n.getText({ key: "reject", defaultText: "" })}
                                                </Button>
                                            </>
                                        )}
                                    </>
                                }
                            />
                        </>
                    ) : undefined
                }
            >
                <SplitterLayout
                    id={"pageSplitter"}
                    style={{ height: isCVState ? windowHeight - 280 : windowHeight - 240 }}
                >
                    <SplitterElement size={window.innerWidth + "px"} id="pdfSplitterElement">
                        <div style={{ height: "calc(100% - 1rem)" }}>
                            <AnnotatedPDFViewer
                                width={PDFViewerWidth}
                                pdfBytes={pdfBytes}
                                onDocumentLoadSuccessFunction={centerPage}
                                id={id}
                                setInitialNewPositionCorrectionValues={setInitialNewPositionCorrectionValues}
                                setViewState={setViewState}
                                pdfScrollbarRef={pdfScrollbarRef}
                                setNavigateToPositionInPDF={setNavigateToPositionInPDF}
                                positions={positions}
                                setCorrectionSession={setCorrectionSession}
                                isCVState={isCVState}
                            />
                        </div>
                    </SplitterElement>
                    <SplitterElement size={window.innerWidth + "px"}>
                        <div
                            style={{
                                overflow: "scroll",
                                width: "100%"
                            }}
                        >
                            <FlexBox direction="Column" style={{ flex: 1, padding: "0rem 1rem 0.25rem 1rem" }}>
                                {activeView}
                            </FlexBox>
                        </div>
                    </SplitterElement>
                </SplitterLayout>
            </DynamicPage>
            <ForwardingDialog
                open={openForwardingDialog}
                setOpen={setOpenForwardingDialog}
                invoice={invoiceDetails}
                possibleCV={possibleNewCV}
                forwardForCorrection={forwardForCorrection}
            />
            <ConfirmationDialog
                dialogText={dialogState.dialogText}
                openDialog={dialogState.showDialog}
                onConfirm={dialogState.onConfirm}
                onCancel={() =>
                    setDialogState((previousState) => ({
                        ...previousState,
                        showDialog: false
                    }))
                }
            ></ConfirmationDialog>
            <MessageBox
                type="Confirm"
                open={!!selectedFinalInvoiceStatus}
                onClose={(event) => {
                    // should work according to docs of MessageBox
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
                    if (!!selectedFinalInvoiceStatus && event.detail.action === MessageBoxActions.OK) {
                        acceptOrRejectInvoice(invoiceDetails.invoiceID as string, selectedFinalInvoiceStatus)
                            .then(() => setSelectedFinalInvoiceStatus(null))
                            .catch(console.log);
                        // on cancel click
                    } else setSelectedFinalInvoiceStatus(null);
                }}
            >
                <Text>{confirmInvoiceStatusMessage}</Text>
            </MessageBox>
            <HistoryDialog
                openHistoryDialog={openHistoryDialog}
                setOpenHistoryDialog={setOpenHistoryDialog}
                positions={positions}
                deductions={deductions}
                retentions={retentions}
            />
        </>
    );
}
