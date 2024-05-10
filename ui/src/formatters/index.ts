import { WorkflowStatus, FlowStatuses, Roles } from "@entities";

/**
 * Formats date to dd.mm.yyyy in local timee
 * @param timestamp ISO timestamp representing the exact date
 * @returns The formatted date
 */
export function formatDate(timestamp: string) {
    const date = new Date(timestamp);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return day + "." + month + "." + year;
}

export function turnBytesToBase64String(bytes: Uint8Array) {
    const decoder = new TextDecoder("utf-8");
    const utf8String = decoder.decode(bytes);
    return btoa(utf8String);
}

export const WORKFLOW_STATUS_I18N_KEY_MAPPING: { [key in WorkflowStatus]?: string } = {
    [WorkflowStatus.ACCOUNTING_MEMBER_CHECK]: "workflowStatusAccountingMemberCheck",
    [WorkflowStatus.EXTERNAL_VALIDATOR_CHECK]: "workflowStatusExternalValidatorCheck",
    [WorkflowStatus.FINAL_APPROVAL]: "workflowStatusFinalApproval",
    [WorkflowStatus.ACCEPTED]: "workflowStatusAccepted",
    [WorkflowStatus.REJECTED]: "workflowStatusRejected"
};

export const ROLE_DISPLAY_STRING_I18N_MAPPING: { [key in Roles]?: string } = {
    [Roles.ACCOUNTING_MEMBER]: "accountingMember",
    [Roles.EXTERNAL_VALIDATOR]: "externalValidator"
};

export function getCurrentFlowStatus(statusHistory: FlowStatuses) {
    let statuses = [...statusHistory];
    // sort newest to oldest
    statuses = statuses.sort(
        (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
    );
    const currentStatus = statuses[0].descriptor as WorkflowStatus;
    return currentStatus;
}

export function handleNumberPaste(event: React.ClipboardEvent<HTMLElement>) {
    let pastedValue: string = event.clipboardData.getData("Text");
    const element = event.target;
    event.preventDefault();
    if (pastedValue.lastIndexOf(",") > pastedValue.lastIndexOf(".")) {
        pastedValue = pastedValue.replace(/\./g, "");
        pastedValue = pastedValue.replace(",", ".");
    } else {
        pastedValue = pastedValue.replace(/,/g, "");
    }

    const parsedValue = parseFloat(pastedValue);
    if (isNaN(parsedValue) || parsedValue < 0) return;
    // @ts-ignore
    element.value = pastedValue;
    return parseFloat(pastedValue);
}
