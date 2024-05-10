import {
    Positions,
    PositionCorrections,
    DeductionVersions,
    RetentionVersions,
    Deductions,
    Retentions
} from "@entities";
import { formatDate } from "@/formatters";

export interface Metadata {
    invoiceId: string;
    projectName: string;
    dueDate: string;
    costGroup: string;
    grossAmount: number;
    newGrossAmount: number;
}

function sortByLatestToOldest(elements: PositionCorrections | DeductionVersions | RetentionVersions) {
    // do not sort in place here
    return [...elements].sort(
        (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
    );
}

function preparePositions(positions: Positions) {
    const corrections = positions.map((position) => {
        const corrections = sortByLatestToOldest(position.corrections as PositionCorrections) as PositionCorrections;
        const latestCorrection = corrections[0];
        // get last element
        const [positionInInvoice] = corrections.slice(-1);
        return {
            descriptor: position.descriptor as string,
            unitPrice: latestCorrection.revisedUnitPrice as number,
            quantity: latestCorrection.revisedUnitQuantity as number,
            originalUnitPrice: positionInInvoice.revisedUnitPrice,
            originalQuantity: positionInInvoice.revisedUnitQuantity,
            changedBy: latestCorrection.createdBy as string,
            changedAt: formatDate(latestCorrection.createdAt as string),
            reason: latestCorrection.reason ?? ""
        };
    });
    return corrections;
}

export async function downloadSnapshot(
    metadata: Metadata,
    pdfBytesBase64String: string,
    currentTime: string,
    positions: Positions,
    totalCorrectionOverPositions: number,
    deductions: Deductions,
    retentions: Retentions
) {
    const body = {
        metadata,
        originalInvoiceBase64String: pdfBytesBase64String,
        currentTime,
        corrections: preparePositions(positions),
        totalCorrectionOverPositions,
        deductions,
        retentions
    };
    const response = await fetch("/snapshot/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (response.ok) {
        const data = await response.json();

        // DOWNLOAD OF SNAPSHOT

        const bytesAsciiEncoded = atob(data.snapshotBase64 as string);
        const bytes = Uint8Array.from(bytesAsciiEncoded, (char) => char.codePointAt(0) as number);
        const objectUrl = window.URL.createObjectURL(new Blob([bytes]));

        // CREATE ANCHOR LINK AS INTERMEDIARY TO THEN DOWNLOAD FILE
        const link = document.createElement("a");
        link.setAttribute("href", objectUrl);
        link.setAttribute("display", "none");
        link.download = "invoice-validation-snapshot.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
