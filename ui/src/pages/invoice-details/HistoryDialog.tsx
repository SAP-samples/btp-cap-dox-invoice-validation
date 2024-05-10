import { Bar, Button, Dialog, Tab, TabContainer } from "@ui5/webcomponents-react";
import { Deductions, Positions, Retentions } from "@entities";
import { useI18nBundle } from "@ui5/webcomponents-react-base";

import PositionHistory from "./history/PositionsHistory";
import DeductionsHistory from "./history/DeductionsHistory";
import RetentionsHistory from "./history/RetentionsHistory";

export default function HistoryDialog({
    openHistoryDialog,
    setOpenHistoryDialog,
    positions,
    deductions,
    retentions
}: {
    openHistoryDialog: boolean;
    setOpenHistoryDialog: React.Dispatch<React.SetStateAction<boolean>>;
    positions: Positions;
    deductions: Deductions;
    retentions: Retentions;
}) {
    const i18n = useI18nBundle("app");
    return (
        <Dialog
            open={openHistoryDialog}
            onAfterClose={() => setOpenHistoryDialog(false)}
            footer={
                <Bar
                    design="Footer"
                    endContent={
                        <Button design="Transparent" onClick={() => setOpenHistoryDialog(false)}>
                            {i18n.getText({ key: "close", defaultText: "" })}
                        </Button>
                    }
                />
            }
            headerText="History"
            resizable
            stretch
        >
            <TabContainer>
                <Tab text="Positions">
                    <PositionHistory positions={positions} />
                </Tab>
                <Tab text="Deductions">
                    <DeductionsHistory deductions={deductions} />
                </Tab>
                <Tab text="Retentions">
                    <RetentionsHistory retentions={retentions} />
                </Tab>
            </TabContainer>
        </Dialog>
    );
}
