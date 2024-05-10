import { pdfjs, Document, Page } from "react-pdf";
import { useState, useRef } from "react";
import { Loader } from "@ui5/webcomponents-react";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { PdfBytes } from "./InvoiceDetails";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();

const optionsForDocument = {
    //when experiencing problems with pdf-js, try commenting the following line
    verbosity: pdfjs.VerbosityLevel.ERRORS
};

export default function PDFViewer({
    width,
    pdfBytes,
    onDocumentLoadSuccessFunction,
    pdfChildElements,
    pdfScrollbarRef
}: {
    width: number;
    pdfBytes: PdfBytes | undefined;
    onDocumentLoadSuccessFunction: () => void;
    pdfChildElements: any;
    pdfScrollbarRef: React.RefObject<HTMLDivElement>;
}) {
    const [numberOfPages, setNumberOfPages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumberOfPages(numPages);
        onDocumentLoadSuccessFunction();
        setIsLoading(false);
    }

    const pageRef = useRef<HTMLDivElement | null>(null);

    return (
        <>
            <div
                className="sapScrollBar"
                ref={pdfScrollbarRef}
                style={{
                    position: "absolute",
                    height: "100%",
                    overflow: "auto",
                    overflowX: "hidden",
                    minWidth: width - 50,
                    width: "calc(" + width + "px - 1rem)",
                    visibility: isLoading ? "hidden" : "visible"
                }}
            >
                {pdfChildElements}
                {isLoading && <Loader style={{ position: "absolute", top: 8, visibility: "visible" }} />}
                <Document
                    file={pdfBytes}
                    loading=""
                    error=""
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={() => setIsLoading(false)}
                    options={optionsForDocument}
                >
                    {Array.from(new Array(numberOfPages), (_, index) => {
                        // start counting pages with 1
                        const pageNumber = index + 1;
                        return (
                            <Page
                                loading=""
                                error=""
                                key={`page_${pageNumber}`}
                                pageNumber={pageNumber}
                                renderAnnotationLayer={false}
                                width={width - 12}
                            >
                                <div
                                    ref={pageRef}
                                    style={{ position: "absolute", height: "100%", width: "0px", visibility: "hidden" }}
                                ></div>
                            </Page>
                        );
                    })}
                </Document>
            </div>
        </>
    );
}
