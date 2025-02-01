import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Admin from "../pages/Admin";
import PrivateAdminRoute from "./PrivateAdminRoute";
import Examinee from "../pages/Examinee";
import PrivateRoute from "./PrivateRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        path: "/",
        element: <Home />,
      },
      {
        index: true,
        path: "/login",
        element: <SignIn />,
      },
      {
        index: true,
        path: "/signup",
        element: <SignUp />,
      },
      {
        index: true,
        path: "/admin",
        element: (
          <PrivateAdminRoute>
            <Admin />
          </PrivateAdminRoute>
        ),
      },
      {
        index: true,
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Examinee />
          </PrivateRoute>
        ),
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
