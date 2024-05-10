import { Text, MessageBox, MessageBoxActions } from "@ui5/webcomponents-react";

export default function ConfirmationDialog({
    dialogText,
    openDialog,
    onConfirm,
    onCancel
}: {
    dialogText: string;
    openDialog: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <MessageBox
            type="Confirm"
            open={openDialog}
            onClose={(event: any) => {
                if (event.detail.action === MessageBoxActions.OK) {
                    onConfirm();
                } else {
                    onCancel();
                }
            }}
        >
            <Text>{dialogText}</Text>
        </MessageBox>
    );
}
