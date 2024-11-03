import { useEffect, useState, useContext } from "react";
import { Page, MessageBox } from "@ui5/webcomponents-react";

import { Invoices } from "@entities";
import InvoicesTables from "./InvoicesTables";
import { UserContext } from "@/contexts/UserContext";
import { BASE_URL_CAP } from "@/constants";

let bgJob: number; // id of background job that checks if dox is done

export default function InvoicesIndex() {
    const [invoices, setInvoices] = useState<Invoices>([]);
    const [showMessage, setShowMessage] = useState(false);
    const [extractionState, setExtractionState] = useState<{ [invoiceID: string]: boolean }>({});

    const { isCV } = useContext(UserContext);
    // @ts-ignore
    const assignedInvoices = invoices.filter((invoice) => isCV(invoice.CV_user_ID as string));
    // @ts-ignore
    const otherInvoices = invoices.filter((invoice) => !isCV(invoice.CV_user_ID as string));

    useEffect(() => {
        fetchAllInvoices().catch(console.log);
        updateExtractionState();
    }, []);

    async function updateExtractionState() {
        const vals = Object.values(extractionState);
        if (bgJob && vals.every((done) => done) && vals.length > 0) {
            console.log("everything done, clearing interval now");
            window.clearInterval(bgJob);
            return;
        }
        console.log("api call now, checking extraction state now");
        const resp = await fetch(`${BASE_URL_CAP}/areInvoiceExtractionsCompleted()`);
        if (resp.ok) {
            const data = await resp.json();
            // let user kick of line items extraction from missing invoices using dox
            if (data.pending.length > 0) setShowMessage(true);

            const state: { [invoiceID: string]: boolean } = {};
            for (const ID of data.done) state[ID] = true;
            for (const ID of data.pending) state[ID] = false;
            console.log("setting state now, state is", state, "data is", data);
            setExtractionState(state);
        }
    }

    async function fetchAllInvoices() {
        const response = await fetch("/api/odata/v4/invoice-assessment/Invoices?$expand=project,statuses,CV");
        if (response.ok) {
            /* eslint-disable @typescript-eslint/no-unsafe-assignment */
            const data = await response.json();
            /* eslint-disable @typescript-eslint/no-unsafe-member-access */
            setInvoices(data.value as Invoices);
        }
    }

    // TODO: translate content of msg
    return (
        <>
            <Page disableScrolling style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
                <InvoicesTables
                    assignedInvoices={assignedInvoices}
                    otherInvoices={otherInvoices}
                    extractionState={extractionState}
                />
            </Page>
            <MessageBox
                type="Information"
                open={showMessage}
                onClose={() => {
                    // prettier-ignore
                    fetch(`${BASE_URL_CAP}/doxExtractFromInvoices`, { method: "POST", headers: { "content-type": "application/json" } })
                        .then(() => { if (!bgJob) bgJob = window.setInterval(updateExtractionState, 10000); });
                    setShowMessage(false);
                }}
            >
                The line items of some invoices still need to be extracted. This will only take a moment.
            </MessageBox>
        </>
    );
}
