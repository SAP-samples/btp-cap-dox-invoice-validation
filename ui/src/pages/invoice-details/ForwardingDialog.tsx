import { useState } from "react";
import { Dialog, List, StandardListItem, Button, FlexBox } from "@ui5/webcomponents-react";
import { spacing, useI18nBundle } from "@ui5/webcomponents-react-base";

import { Invoice, Projects_User, Projects_Users, Roles } from "@entities";
import { ROLE_DISPLAY_STRING_I18N_MAPPING } from "@/formatters";

interface IForwardingDialog {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    invoice: Invoice;
    possibleCV: Projects_Users;
    forwardForCorrection: (projectId: string, invoiceId: string, memberId: string) => Promise<void>;
}

export default function ForwardingDialog({
    open,
    setOpen,
    invoice,
    possibleCV,
    forwardForCorrection
}: IForwardingDialog) {
    const i18n = useI18nBundle("app");
    const [idSelectedMember, setIdSelectedMember] = useState<string>("");
    return (
        <Dialog open={open} headerText={i18n.getText({ key: "forwardTo", defaultText: "" })}>
            <List
                mode="SingleSelect"
                separators="All"
                noDataText={i18n.getText({ key: "noOneToForwardTo", defaultText: "" })}
            >
                {possibleCV.map((member: Projects_User) => {
                    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
                    // @ts-ignore
                    const memberId = member.user_ID as string;
                    return (
                        <StandardListItem
                            key={memberId}
                            description={i18n.getText({
                                key: ROLE_DISPLAY_STRING_I18N_MAPPING[member.role as Roles] as string,
                                defaultText: ""
                            })}
                            onClick={() => setIdSelectedMember(memberId)}
                        >
                            {memberId}
                        </StandardListItem>
                    );
                })}
            </List>
            <FlexBox style={{ width: "100%", ...spacing.sapUiMediumMarginTop }} direction="Row" justifyContent="End">
                <Button
                    disabled={!idSelectedMember}
                    design="Emphasized"
                    style={spacing.sapUiTinyMarginEnd}
                    onClick={() => {
                        const projectId = invoice.project?.ID as string;
                        const invoiceId = invoice.invoiceID as string;
                        forwardForCorrection(projectId, invoiceId, idSelectedMember).catch(console.log);
                    }}
                >
                    OK
                </Button>
                <Button design="Transparent" style={spacing.sapUiSmallMarginEnd} onClick={() => setOpen(false)}>
                    {i18n.getText({ key: "cancel", defaultText: "" })}
                </Button>
            </FlexBox>
        </Dialog>
    );
}
