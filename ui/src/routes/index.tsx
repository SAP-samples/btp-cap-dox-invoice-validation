import { createHashRouter } from "react-router-dom";

import { Login } from "../pages/login";
import { InvoicesIndex } from "../pages/invoices-index";
import { InvoiceDetails } from "../pages/invoice-details";
import { Admin } from "../pages/admin";
import ErrorPage from "../custom/ErrorPage";

export const router = createHashRouter([
    {
        path: "/",
        element: <InvoicesIndex />,
        errorElement: <ErrorPage />
    },
    {
        path: "/invoices/:id",
        element: <InvoiceDetails />,
        errorElement: <ErrorPage />
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />
    },
    {
        path: "/admin",
        element: <Admin />,
        errorElement: <ErrorPage />
    }
]);
