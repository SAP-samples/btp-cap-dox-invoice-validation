import { BASE_URL_CAP } from "@/constants";
import { NormalizedCoordinates } from "./PDFPositions";

interface LineItemCoordinates {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface InvoiceLineItem {
    category: string;
    confidence: number;
    index?: number;
    label: string;
    rawValue: string;
    type: string;
    value: string | number;
    coordinates: LineItemCoordinates;
    normalizedCoordinates?: NormalizedCoordinates;
    page: number;
    name: string;
}

export interface DoxServiceResponse {
    headerFields: any;
    lineItems: InvoiceLineItem[];
}

export class PDFLineItems {
    private id: string;

    constructor(id: string) {
        this.id = id;
    }

    private async fetchLineItemsFromDOX(): Promise<any> {
        return await fetch(`${BASE_URL_CAP}/doxGetLineItems(invoiceID='${this.id}')`);
    }

    private async getInvoiceEntries() {
        const doxServiceResponse = await this.fetchLineItemsFromDOX();
        if (doxServiceResponse.ok) {
            const doxServiceResponseJson = await doxServiceResponse.json();
            const lineItems = doxServiceResponseJson.value;
            return lineItems;
        } else throw new Error("Fetching DOX Service for LineItems failed with documentID " + this.id);
    }

    public async getDoxServiceResponse() {
        return this.getInvoiceEntries();
    }
}
