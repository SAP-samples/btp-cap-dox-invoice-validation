import { useEffect, useState, useContext } from "react";
import { Page } from "@ui5/webcomponents-react";

import { Invoices } from "@entities";
import InvoicesTable from "./InvoicesTable";
import Surface from "@/custom/Surface";
import { UserContext } from "@/contexts/UserContext";
import { spacing } from "@ui5/webcomponents-react-base";

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
            <Surface>
                <InvoicesTable
                    invoices={assignedInvoices}
                    titleKey="invoicesToBeValidated"
                    noDataKey="notCVOfAnyInvoice"
                    sortedBy="dueDate"
                />
                <InvoicesTable
                    invoices={otherInvoices}
                    titleKey="otherInvoices"
                    noDataKey="noOtherInvoices"
                    sortedBy="projectName"
                    styles={{ ...spacing.sapUiMediumMarginTop }}
                />
            </Surface>
        </Page>
    );
}
