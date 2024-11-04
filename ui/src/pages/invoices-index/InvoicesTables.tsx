import "@ui5/webcomponents-icons/dist/navigation-right-arrow.js";
import { spacing } from "@ui5/webcomponents-react-base";
import "@ui5/webcomponents-icons/dist/alert.js";

import { Invoices } from "@entities";
import Surface from "@/custom/Surface";
import InvoicesTable from "./InvoicesTable";

export default function InvoicesTables({
    assignedInvoices,
    otherInvoices,
    extractionState
}: {
    assignedInvoices: Invoices;
    otherInvoices: Invoices;
    extractionState: { [invoiceID: string]: boolean };
}) {
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
