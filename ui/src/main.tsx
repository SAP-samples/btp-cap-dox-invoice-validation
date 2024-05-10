import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@ui5/webcomponents-react/dist/Assets.js";
import { ThemeProvider } from "@ui5/webcomponents-react";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme";
import { registerI18nLoader } from "@ui5/webcomponents-base/dist/asset-registries/i18n.js";
import parse from "@ui5/webcomponents-base/dist/PropertiesFileFormat.js";

import "./index.css";
import { UserProvider } from "@/contexts/UserContext";

// defines the different routes
import { router } from "@routes";
import SessionTimeoutDialog from "./custom/SessionTimeoutDialog";
import HeaderBar from "./pages/HeaderBar";

const SUPPORTED_LOCALS = ["en", "de"];
SUPPORTED_LOCALS.forEach((localeToRegister) => {
    registerI18nLoader("app", localeToRegister, async (localeId) => {
        const props = await (await fetch(`/messagebundle_${localeId}.properties`)).text();
        return parse(props);
    });
});

setTheme("sap_horizon");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider>
            <UserProvider>
                <>
                    <SessionTimeoutDialog />
                    <HeaderBar />
                    <RouterProvider router={router} />
                </>
            </UserProvider>
        </ThemeProvider>
    </React.StrictMode>
);
