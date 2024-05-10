import { PDFPositions, InvoicePosition } from "./PDFPositions";
import { PDFLineItems, InvoiceLineItem } from "./PDFLineItems";

interface VerticalTolerenceInterval {
    minY: number;
    maxY: number;
}

export interface LineItems {
    description: InvoiceLineItem;
    quantity: InvoiceLineItem;
    unitOfMeasure: InvoiceLineItem;
    unitPrice: InvoiceLineItem;
    netAmount: InvoiceLineItem;
}

export interface MatchedLineItemsToPositions {
    [key: string]: {
        position?: InvoicePosition;
        lineItems: InvoiceLineItem[];
    };
}

export class PDFData {
    private id: string;
    private matchedPositionToLineItems: MatchedLineItemsToPositions = {};

    constructor(id: string) {
        this.id = id;
    }

    public async getExtractedPDFData(): Promise<MatchedLineItemsToPositions> {
        const positions: InvoicePosition[] = await this.getPositions();
        const lineItems = (await this.getDoxServiceResponse()) as InvoiceLineItem[][];
        this.getCombinedPositionsWithLineItems(positions, lineItems);
        return this.matchedPositionToLineItems;
    }

    private async getPositions() {
        return await new PDFPositions(this.id).getPositions();
    }

    private async getDoxServiceResponse() {
        return await new PDFLineItems(this.id).getDoxServiceResponse();
    }

    private getCombinedPositionsWithLineItems(positions: InvoicePosition[], lineItems: InvoiceLineItem[][]) {
        lineItems.forEach((lineItemsInSameRow) => {
            this.getPositionToLineItems(lineItemsInSameRow, positions);
        });
        return this.matchedPositionToLineItems;
    }

    private getPositionToLineItems(lineItemsInSameRow: InvoiceLineItem[], positions: InvoicePosition[]) {
        if (lineItemsInSameRow.length < 4) return;
        const firstLineItem = lineItemsInSameRow[0];
        let foundValidPosition = false;
        positions.every((position) => {
            const verticalToleranceIntervalForTextInSameLine: { minY: number; maxY: number } =
                this.getVerticalToleranceIntervalForTextInSameLine(position.coordinates.y);
            if (
                this.isPositionOnSamePageAndLineAsFirstLineItem(
                    firstLineItem,
                    position,
                    verticalToleranceIntervalForTextInSameLine
                )
            ) {
                foundValidPosition = true;
                this.matchLineItemsToPosition(position, lineItemsInSameRow);
                return false;
            }
            return true;
        });
        if (foundValidPosition) return;
        this.matchedPositionToLineItems = {
            ...this.matchedPositionToLineItems,
            [this.counter.toString()]: {
                lineItems: lineItemsInSameRow
            }
        };
        this.counter++;
    }

    private counter = 0;

    private matchLineItemsToPosition(position: InvoicePosition, lineItemsInSameRow: InvoiceLineItem[]) {
        this.matchedPositionToLineItems = {
            ...this.matchedPositionToLineItems,
            [this.counter.toString()]: {
                position: position,
                lineItems: lineItemsInSameRow
            }
        };
        this.counter++;
    }

    private isPositionOnSamePageAndLineAsFirstLineItem(
        lineItem: InvoiceLineItem,
        position: InvoicePosition,
        verticalToleranceIntervalForTextInSameLine: VerticalTolerenceInterval
    ) {
        const { minY, maxY } = verticalToleranceIntervalForTextInSameLine;
        return lineItem.coordinates.y > minY && lineItem.coordinates.y < maxY && position.page == lineItem.page;
    }

    private getVerticalToleranceIntervalForTextInSameLine(y: number): { minY: number; maxY: number } {
        return { minY: y - y * 0.01, maxY: y + y * 0.01 };
    }
}
