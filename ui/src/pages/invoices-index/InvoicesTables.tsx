import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import { spacing } from "@ui5/webcomponents-react-base";
import "@ui5/webcomponents-icons/dist/alert.js";

import { Invoices } from "@entities";
import { useEffect, useState } from "react";
import Surface from "@/custom/Surface";
import { BASE_URL_CAP } from "@/constants";
import InvoicesTable from "./InvoicesTable";

let bgJob: number; // id of background job that checks if dox is done

export default function InvoicesTables({
    assignedInvoices,
    otherInvoices
}: {
    assignedInvoices: Invoices;
    otherInvoices: Invoices;
}) {
    const [extractionState, setExtractionState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        doxExtract(); // just fire and forget, endpoint checks if invoices need to be analyzed
        checkExtractionStatusesOfAllInvoices().then(() => {
            // React calls effect two times at dev time, make sure job is started once
            if (!bgJob) bgJob = window.setInterval(checkExtractionStatusesOfAllInvoices, 10000);
        });
    }, []);

    const doxExtract = () => {
        return fetch(`${BASE_URL_CAP}/doxExtractFromInvoices`, {
            method: "POST",
            headers: { "content-type": "application/json" }
        });
    };

    async function checkExtractionStatusesOfAllInvoices() {
        if (bgJob && Object.values(extractionState).every((done) => done)) {
            window.clearInterval(bgJob);
            return;
        }
        const resp = await fetch(`${BASE_URL_CAP}/areInvoiceExtractionsCompleted()`);
        if (resp.ok) {
            const data = await resp.json();
            const state: { [invoiceID: string]: boolean } = {};
            for (const ID of data.done) state[ID] = true;
            for (const ID of data.pending) state[ID] = false;
            setExtractionState(state);
        }
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
