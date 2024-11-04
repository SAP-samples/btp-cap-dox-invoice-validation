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
        updateExtractionState({ mounting: true });
    }, []);

    async function updateExtractionState({ mounting = false }: { mounting?: boolean } = {}) {
        // We only want to show the message once on component mount, thus the mounting flag.
        console.log("call api now to check extraction state");
        const resp = await fetch(`${BASE_URL_CAP}/areInvoiceExtractionsCompleted()`);
        if (resp.ok) {
            const data = await resp.json();
            // let user kick of line items extraction from missing invoices using dox
            if (mounting && data.pending.length > 0) setShowMessage(true);

            const state: { [invoiceID: string]: boolean } = {};
            for (const ID of data.done) state[ID] = true;
            for (const ID of data.pending) state[ID] = false;
            console.log("set new extraction state now, new state is", state);
            setExtractionState(state);

            // everything done, time to stop bg job
            const vals = Object.values(state);
            if (bgJob && vals.every((done) => done) && vals.length > 0) {
                console.log("everything done, stopping background job now");
                window.clearInterval(bgJob);
            }
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
                        .then(() => { if (!bgJob) {
                                // TODO: what if a dox job failes ? (status: FAILED)
                                bgJob = window.setInterval(updateExtractionState, 10000);
                                console.log("starting background job now");
                            }
                        });
                    setShowMessage(false);
                }}
            >
                The line items of some invoices still need to be extracted. This will only take a moment.
            </MessageBox>
        </>
    );
}
