import PDFViewer from "./PDFViewer";
import { ViewState, PdfBytes, CorrectionSession } from "./InvoiceDetails";
import { useEffect, useState, useContext } from "react";
import { PDFData, MatchedLineItemsToPositions } from "./extract-pdf-data/PDFData";
import { InvoicePosition } from "./extract-pdf-data/PDFPositions";
import { InvoiceLineItem } from "./extract-pdf-data/PDFLineItems";
import { Text } from "@ui5/webcomponents-react";
import { Position, Positions } from "@entities";
import { UserContext } from "@/contexts/UserContext";

export interface InvoiceEntry {
    index: number;
    position?: string;
    description: string;
    quantity: number;
    unitOfMeasure: string;
    unitPrice: string;
    netAmount: string;
}

interface MatchedLineItemToPosition {
    position?: InvoicePosition;
    lineItems: InvoiceLineItem[];
}

export default function AnnotatedPDFViewer({
    width,
    pdfBytes,
    onDocumentLoadSuccessFunction,
    id,
    setInitialNewPositionCorrectionValues,
    setViewState,
    pdfScrollbarRef,
    setNavigateToPositionInPDF,
    positions,
    setCorrectionSession,
    isCVState
}: {
    width: number;
    pdfBytes: PdfBytes | undefined;
    onDocumentLoadSuccessFunction: () => void;
    id: string | undefined;
    setInitialNewPositionCorrectionValues: React.Dispatch<React.SetStateAction<any>>;
    setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
    pdfScrollbarRef: React.RefObject<HTMLDivElement>;
    setNavigateToPositionInPDF: React.Dispatch<React.SetStateAction<(props: any) => void>>;
    positions: Positions;
    setCorrectionSession: React.Dispatch<React.SetStateAction<CorrectionSession>>;
    isCVState: boolean;
}) {
    const [pdfAnnotations, setPdfAnnotations] = useState<JSX.Element[]>();

    const { isAdmin } = useContext(UserContext);

    let counter = 0;

    function boxElement(matchedLineItemToPosition: MatchedLineItemToPosition, index: number): JSX.Element {
        const lineItems = matchedLineItemToPosition.lineItems;
        const minY = Math.min(...lineItems.map((lineItem) => lineItem.coordinates.y));
        const page = lineItems[0].page;
        const lineHeight = Math.max(
            ...lineItems.map((lineItem) => lineItem.coordinates.y - minY + lineItem.coordinates.h)
        );

        return (
            <div key={counter++}>
                <div
                    key={counter++}
                    style={{
                        position: "absolute",
                        marginLeft: 2 + "%",
                        marginTop: (page - 1) * 144.22 + minY * 144.2 + "%",
                        zIndex: 10,
                        paddingTop: lineHeight * 170 + "%",
                        paddingLeft: 97 + "%",
                        backgroundColor: "gray",
                        opacity: 0.2,
                        borderRadius: 5,
                        cursor: "pointer"
                    }}
                    onClick={() => clickOnInvoiceLineInPDF(matchedLineItemToPosition, index)}
                    className="invoiceLineButton"
                ></div>
                <div
                    style={{
                        position: "absolute",
                        marginLeft: 2 + "%",
                        marginTop: (page - 1) * 144.22 + minY * 144.2 + "%",
                        zIndex: 10,
                        paddingLeft: "2%"
                    }}
                >
                    <Text>
                        {index}
                        <div id={"marker" + index}></div>
                    </Text>
                </div>
            </div>
        );
    }

    const clickOnInvoiceLineInPDF = (matchedLineItemToPosition: any, index: any) => {
        if (!isAdmin() && !isCVState) return;
        const lineItems = matchedLineItemToPosition.lineItems;
        // if index not already corrected ==>
        // otherwise open changepositioncorrection of this index
        let correctedPosition: Position;
        let positionAlreadyCorrected = false;
        for (const position of positions) {
            if (position.index == index) {
                positionAlreadyCorrected = true;
                correctedPosition = position;
                break;
            }
        }
        if (positionAlreadyCorrected) {
            setViewState(ViewState.CHANGE_CORRECTION);
            const sortedCorrections = [...(correctedPosition!.corrections ?? [])].sort(
                // sort corrections from latest to oldest
                (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
            );
            setCorrectionSession({ position: correctedPosition!, previousCorrections: sortedCorrections });
            return;
        }
        setViewState(ViewState.ADD_NEW_POSITION);
        let description: string = "";
        let netAmount: string = "";
        let quantity: number = 0;
        let unitOfMeasure: string = "";
        let unitPrice: string = "";
        lineItems.forEach((lineItem: any) => {
            if (lineItem.name == "description") description = lineItem.value as string;
            if (lineItem.name == "netAmount") netAmount = lineItem.value as string;
            if (lineItem.name == "quantity") quantity = lineItem.value as number;
            if (lineItem.name == "unitOfMeasure") unitOfMeasure = lineItem.value as string;
            if (lineItem.name == "unitPrice") unitPrice = lineItem.value as string;
        });

        setInitialNewPositionCorrectionValues({
            index: index,
            position: matchedLineItemToPosition.position?.position,
            description: description,
            netAmount: netAmount,
            quantity: quantity,
            unitOfMeasure: unitOfMeasure,
            unitPrice: unitPrice
        });
    };

    const getBoxesToDisplay = async (): Promise<JSX.Element[]> => {
        const matchedLineItemsToPosition: MatchedLineItemsToPositions = await new PDFData(id!).getExtractedPDFData();
        const boxes: JSX.Element[] = [];
        Object.keys(matchedLineItemsToPosition).forEach((line: string, index: number) => {
            boxes.push(boxElement(matchedLineItemsToPosition[line], index));
        });
        return boxes;
    };

    useEffect(() => {
        getBoxesToDisplay()
            .then((boxes) => {
                setPdfAnnotations(() => {
                    return boxes;
                });
                setNavigateToPositionInPDF(() => {
                    return (props: any) => {
                        const element = document.getElementById("marker" + props.cell.value);
                        if (!element) return;
                        element.scrollIntoView({ behavior: "instant", block: "start" });
                        pdfScrollbarRef.current!.scrollTo({
                            top: pdfScrollbarRef.current!.scrollTop - 20,
                            behavior: "instant"
                        });
                    };
                });
            })
            .catch((err) => console.log(err));
    }, [positions]);

    return (
        <>
            <PDFViewer
                width={width}
                pdfBytes={pdfBytes}
                onDocumentLoadSuccessFunction={onDocumentLoadSuccessFunction}
                pdfChildElements={pdfAnnotations}
                pdfScrollbarRef={pdfScrollbarRef}
            />
        </>
    );
}
