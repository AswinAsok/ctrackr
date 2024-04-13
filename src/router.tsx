import { createBrowserRouter } from "react-router-dom";
import GlobalWrapper from "./components/GlobalWrapper";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/SignUp";
import UsersDashboard from "./pages/Dashboard/Users/UsersDashboard";
import AdminsDashboard from "./pages/Dashboard/Admins/AdminsDashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <GlobalWrapper />,
        children: [
            { path: "/login", element: <Login /> },
            {
                path: "/signup",
                element: <Signup />,
            },
            {
                path: "/users/dashboard",
                element: <UsersDashboard />,
            },
            {
                path: "/admins/dashboard",
                element: <AdminsDashboard />,
            },
        ],
    },
]);

export default router;
