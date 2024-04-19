import { createBrowserRouter } from "react-router-dom";
import GlobalWrapper from "./components/GlobalWrapper";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/SignUp";
import UsersDashboard from "./pages/Dashboard/Users/UsersDashboard";
import AdminsDashboard from "./pages/Dashboard/Admins/AdminsDashboard";
import Rooms from "./pages/Auth/Rooms";

const router = createBrowserRouter([
    {
        path: "/",
        element: <GlobalWrapper />,
        children: [
            { path: "/", element: <Login /> },
            {
                path: "/signup",
                element: <Signup />,
            },
            {
                path: "/rooms",
                element: <Rooms />,
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
