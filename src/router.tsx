import { createBrowserRouter } from "react-router-dom";
import GlobalWrapper from "./components/GlobalWrapper";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/SignUp";

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
    ],
  },
]);

export default router;
