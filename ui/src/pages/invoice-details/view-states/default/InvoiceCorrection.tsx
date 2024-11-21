import "@ui5/webcomponents-icons/dist/feeder-arrow.js";

import { Positions, Invoice, Retention, Retentions, Deductions, Deduction, Documents } from "@entities";

import PositionsCard from "./PositionsCard";
import DeductionsCard from "./DeductionsCard";
import RetentionsCard from "./RetentionsCard";
import DocumentsCard from "./DocumentsCard";
import { ViewState } from "../../InvoiceDetails";
import { Dispatch, SetStateAction } from "react";

// THIS IS THE DEFAULT VIEW STATE SHOWN ON THE RIGHT SIDE WHEN NAVIGATING
// TO THE INVOICE DETAILS PAGE

export default function InvoiceCorrection({
    invoice,
    positions,
    setPositions,
    handleChangeCorrectionClick,
    setViewState,
    additionalDocuments,
    setAdditionalDocuments,
    handleChangeDeductionCorrectionClick,
    handleChangeRetentionClick,
    isCVState,
    totalCorrection,
    deductions,
    setDeductions,
    retentions,
    setRetentions,
    setDialogState,
    navigateToPositionInPDF,
    isInvoiceImmutable
}: {
    invoice: Invoice;
    positions: Positions;
    setPositions: Dispatch<SetStateAction<Positions>>;
    handleChangeCorrectionClick: (positionID: string) => void;
    setViewState: Dispatch<SetStateAction<ViewState>>;
    additionalDocuments: Documents;
    setAdditionalDocuments: Dispatch<SetStateAction<Documents>>;
    handleChangeDeductionCorrectionClick: (deduction: Deduction) => void;
    handleChangeRetentionClick: (retention: Retention) => void;
    isCVState: boolean;
    totalCorrection: () => number;
    deductions: Deductions;
    setDeductions: Dispatch<SetStateAction<Deductions>>;
    retentions: Retentions;
    setRetentions: Dispatch<SetStateAction<Retentions>>;
    setDialogState: Dispatch<
        SetStateAction<{
            showDialog: boolean;
            dialogText: string;
            onConfirm: () => void;
        }>
    >;
    navigateToPositionInPDF: ((props: any) => void) | null;
    isInvoiceImmutable: boolean;
}) {
    const retentionsTotal: number = retentions.reduce(
        (total: number, current: Retention) => total + (current.amount || 0),
        0
    );

    const deductionsTotal: number = deductions.reduce(
        (total: number, current: Deduction) => total + (current.amount || 0),
        0
    );

    const sumPositionCorrections = totalCorrection();

    return (
        <>
            <PositionsCard
                positions={positions}
                setPositions={setPositions}
                handleChangeCorrectionClick={handleChangeCorrectionClick}
                sumPositionCorrections={sumPositionCorrections}
                setViewState={setViewState}
                isCVState={isCVState}
                setDialogState={setDialogState}
                navigateToPositionInPDF={navigateToPositionInPDF}
                isInvoiceImmutable={isInvoiceImmutable}
            />
            <DeductionsCard
                deductions={deductions}
                setDeductions={setDeductions}
                deductionsTotal={deductionsTotal}
                setViewState={setViewState}
                handleChangeDeductionCorrectionClick={handleChangeDeductionCorrectionClick}
                isCVState={isCVState}
                setDialogState={setDialogState}
                isInvoiceImmutable={isInvoiceImmutable}
            />
            <RetentionsCard
                retentions={retentions}
                setRetentions={setRetentions}
                retentionsTotal={retentionsTotal}
                handleChangeRetentionClick={handleChangeRetentionClick}
                setViewState={setViewState}
                isCVState={isCVState}
                setDialogState={setDialogState}
                isInvoiceImmutable={isInvoiceImmutable}
            />
            <DocumentsCard
                additionalDocuments={additionalDocuments}
                setAdditionalDocuments={setAdditionalDocuments}
                invoice={invoice}
                isCVState={isCVState}
                setDialogState={setDialogState}
                isInvoiceImmutable={isInvoiceImmutable}
            />
        </>
    );
}
