import { Home, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const ExaminerSingleQuestion = () => {
  const location = useLocation();
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 p-5 flex flex-col gap-4 border-r border-gray-700">
        <h2 className="text-xl font-bold text-center">Examinee Dashboard</h2>
        <Link
          to="/examinee/dashboard"
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 ps-12 ${
            location.pathname === "/examinee/dashboard" ? "bg-gray-700" : ""
          }`}
        >
          <Home size={20} /> Home
        </Link>
        <Link
          to="/examinee/dashboard/questionPaper"
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 ps-12 ${
            location.pathname === "/examinee/dashboard" ? "bg-gray-700" : ""
          }`}
        >
          <FileText size={20} /> Question Paper
        </Link>
      </div>

      {/* Content Area */}
      <div className="w-3/4 p-6">
        <h1>Welcome to Examinee Unique single papaer</h1>
      </div>
    </div>
  );
};

export default ExaminerSingleQuestion;
