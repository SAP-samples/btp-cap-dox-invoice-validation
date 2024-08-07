import { useEffect, useState, useContext } from "react";
import { Page } from "@ui5/webcomponents-react";

import { Invoices } from "@entities";
import InvoicesTables from "./InvoicesTables";
import { UserContext } from "@/contexts/UserContext";

export default function InvoicesIndex() {
    const [invoices, setInvoices] = useState<Invoices>([]);
    async function fetchAllInvoices() {
        const response = await fetch("/api/odata/v4/invoice-assessment/Invoices?$expand=project,statuses,CV");
        if (response.ok) {
            /* eslint-disable @typescript-eslint/no-unsafe-assignment */
            const data = await response.json();
            /* eslint-disable @typescript-eslint/no-unsafe-member-access */
            setInvoices(data.value as Invoices);
        }
    }

    const { isCV } = useContext(UserContext);
    // @ts-ignore
    const assignedInvoices = invoices.filter((invoice) => isCV(invoice.CV_user_ID as string));
    // @ts-ignore
    const otherInvoices = invoices.filter((invoice) => !isCV(invoice.CV_user_ID as string));

    useEffect(() => {
        fetchAllInvoices().catch(console.log);
    }, []);

    return (
        <Page disableScrolling style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
            <InvoicesTables assignedInvoices={assignedInvoices} otherInvoices={otherInvoices} />
        </Page>
    );
}
