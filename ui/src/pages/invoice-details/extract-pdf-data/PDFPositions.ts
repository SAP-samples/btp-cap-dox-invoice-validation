import { BASE_URL_CAP } from "@/constants";

export interface NormalizedCoordinates {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export interface PositionCoordinates {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface InvoicePosition {
    position: string;
    originalPositionString: string;
    coordinates: PositionCoordinates;
    page: number;
    normalizedCoordinates?: NormalizedCoordinates;
}

export class PDFPositions {
    // ++++++++HARD CODED WITH SCHLOSSEREI PAULY++++++++
    // PDF is the result of the execution of getTextOfGeneratedPDF.py

    private id: string;
    constructor(id: string) {
        this.id = id;
    }

    private async fetchPositionsFromDOX() {
        const positionsResponse = await fetch(`${BASE_URL_CAP}/getPositionsFromDOX(id='${this.id}')`, {
            method: "GET",
            headers: new Headers({ "content-type": "application/json" })
        });
        const positions = JSON.parse((await positionsResponse.json()).value);
        return positions;
    }

    public async getPositions(): Promise<InvoicePosition[]> {
        const positionsFromDOX: any[] = await this.fetchPositionsFromDOX();
        const positions: InvoicePosition[] = positionsFromDOX.map((positionFromDox) => {
            return {
                position: positionFromDox.value,
                originalPositionString: positionFromDox.rawValue,
                coordinates: positionFromDox.coordinates,
                page: positionFromDox.page
            };
        });
        return positions;
    }
}
