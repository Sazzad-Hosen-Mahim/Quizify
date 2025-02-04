import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import NotFound from "../pages/NotFound";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Admin from "../pages/Admin";
import Examinee from "../pages/Examinee";
import PrivateRoute from "./PrivateRoute";
import Candidate from "../pages/Candidate";
import ExaminerQuestionPaper from "../components/Examiner/ExaminerQuestionPaper";
// import ExaminerSingleQuestion from "../components/Examiner/ExaminerQuestionPaper";
import ExaminerSingleQuestionNew from "../components/Examiner/ExaminerSingleQuestion";
import ExaminerQuestionPaperDashboard from "../components/Examiner/ExaminerQuestionPaper";

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
        path: "/login",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/admin/dashboard",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <Admin />
          </PrivateRoute>
        ),
      },
      {
        path: "/examinee/dashboard",
        element: (
          <PrivateRoute allowedRoles={["examinee"]}>
            <Examinee />
          </PrivateRoute>
        ),
      },
      {
        path: "/examinee/dashboard/questionPaper",
        element: (
          <PrivateRoute allowedRoles={["examinee"]}>
            <ExaminerQuestionPaperDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/examinee/dashboard/singleQuestion/:id",
        element: (
          <PrivateRoute allowedRoles={["examinee"]}>
            <ExaminerSingleQuestionNew />
          </PrivateRoute>
        ),
      },
      {
        path: "/candidate/dashboard",
        element: (
          <PrivateRoute allowedRoles={["candidate"]}>
            <Candidate />
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
