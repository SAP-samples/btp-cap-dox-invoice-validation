import { ShellBar, ShellBarDomRef, StandardListItem, UI5WCSlotsNode, Ui5CustomEvent } from "@ui5/webcomponents-react";
import Logo from "@assets/sap-logo.svg";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext";
import { ShellBarMenuItemClickEventDetail } from "@ui5/webcomponents-fiori/dist/ShellBar.js";
import { useI18nBundle } from "@ui5/webcomponents-react-base";

export default function HeaderBar() {
    const { isAdmin, isLoadingInfo } = useContext(UserContext);
    const i18n = useI18nBundle("app");
    const [primaryTitle, setPrimaryTitle] = useState("");
    const [menuItems, setMenuItems] = useState<UI5WCSlotsNode>();

    useEffect(() => {
        const onAdminPage = document.location.href.endsWith("admin");
        if (!isLoadingInfo()) {
            setPrimaryTitle(
                i18n.getText({ key: onAdminPage ? "adminDashboard" : "invoiceValidation", defaultText: "" })
            );
            if (!isAdmin()) return;
            setMenuItems(
                <StandardListItem data-key={onAdminPage ? "2" : "1"}>
                    {i18n.getText({ key: onAdminPage ? "invoiceValidation" : "adminDashboard", defaultText: "" })}
                </StandardListItem>
            );
        }
    }, [isLoadingInfo, isAdmin]);

    function navigateToMenuItem(e: Ui5CustomEvent<ShellBarDomRef, ShellBarMenuItemClickEventDetail>) {
        console.log(e.detail.item.dataset.key);
        if (e.detail.item.dataset.key === "1") {
            setPrimaryTitle(i18n.getText({ key: "adminDashboard", defaultText: "" }));
            setMenuItems(
                <StandardListItem data-key="2">
                    {i18n.getText({ key: "invoiceValidation", defaultText: "" })}
                </StandardListItem>
            );
            document.location.href = "#admin";
        }
        if (e.detail.item.dataset.key === "2") {
            setPrimaryTitle(i18n.getText({ key: "invoiceValidation", defaultText: "" }));
            setMenuItems(
                <StandardListItem data-key="1">
                    {i18n.getText({ key: "adminDashboard", defaultText: "" })}
                </StandardListItem>
            );
            document.location.href = "#";
        }
    }

    return (
        <ShellBar
            primaryTitle={primaryTitle}
            style={{ borderBottom: "1px solid #ccc" }}
            onLogoClick={() => (document.location.href = "/")}
            menuItems={menuItems}
            onMenuItemClick={(e) => navigateToMenuItem(e)}
        >
            <img slot="logo" src={Logo} />
        </ShellBar>
    );
}
