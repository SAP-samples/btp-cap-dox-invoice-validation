import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import { spacing } from "@ui5/webcomponents-react-base";
import "@ui5/webcomponents-icons/dist/alert.js";

import { Invoices } from "@entities";
import { useEffect, useState } from "react";
import Surface from "@/custom/Surface";
import { BASE_URL_CAP } from "@/constants";
import InvoicesTable from "./InvoicesTable";

export default function InvoicesTables({
    assignedInvoices,
    otherInvoices,
}: {
    assignedInvoices: Invoices;
    otherInvoices: Invoices;
}) {

    const [extractionState, setExtractionState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        uploadAndFetchAllDocuments().then(()=>checkExtractionStatusesOfAllInvoices().catch(console.log)).catch(console.log);
    }, []);

    const uploadAndFetchAllDocuments = async () =>
        await fetch(`${BASE_URL_CAP}/checkAllDocumentsExtractions`, {
            method: "POST",
            body: JSON.stringify({}),
            headers: new Headers({ "content-type": "application/json" })
        });

    async function checkExtractionStatusesOfAllInvoices() {
        const res = await (await fetch(`${BASE_URL_CAP}/areInvoiceExtractionsCompleted()`, { method: "GET" })).json();
        if (Object.values(res.value).includes(false)) {
            setTimeout(()=>checkExtractionStatusesOfAllInvoices(), 5000);
        }
        setExtractionState(res.value);
    }

    return (
        <Surface>
            <InvoicesTable 
                invoices={assignedInvoices}
                titleKey="invoicesToBeValidated"
                noDataKey="notCVOfAnyInvoice"
                sortedBy="dueDate"
                extractionState={extractionState}
            />
            <InvoicesTable
                invoices={otherInvoices}
                titleKey="otherInvoices"
                noDataKey="noOtherInvoices"
                sortedBy="projectName"
                styles={{ ...spacing.sapUiMediumMarginTop }}
                extractionState={extractionState}
            />
        </Surface>
    );
}
