import { Home, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-1/4 bg-black p-5 flex flex-col gap-4 border-r border-gray-600">
      <h2 className="text-xl font-bold text-center">Examinee Dashboard</h2>

      <Link
        to="/examinee/dashboard"
        className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-800  ${
          location.pathname === "/examinee/dashboard" ? "bg-mainBlue" : ""
        }`}
      >
        <Home size={20} /> Home
      </Link>

      <Link
        to="/examinee/dashboard/questionPaper"
        className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-800  ${
          location.pathname.startsWith("/examinee/dashboard/questionPaper") ||
          location.pathname.startsWith("/examinee/dashboard/singleQuestion")
            ? "bg-mainBlue"
            : ""
        }`}
      >
        <FileText size={20} /> Question Paper
      </Link>
    </div>
  );
};

export default Sidebar;
