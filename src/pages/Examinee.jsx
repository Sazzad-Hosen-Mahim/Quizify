import { useState } from "react";
import { Home, FileText, User } from "lucide-react";
import { useToken } from "../hooks/TokenContext";

const Examinee = () => {
  const [activeTab, setActiveTab] = useState("home");

  const { user } = useToken();
  console.log(user);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 p-5 flex flex-col gap-4 border-r border-gray-700">
        <h2 className="text-xl font-bold text-center">Examinee Dashboard</h2>
        <button
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 ps-12 ${
            activeTab === "home" ? "bg-gray-700" : ""
          }`}
          onClick={() => setActiveTab("home")}
        >
          <Home size={20} /> Home
        </button>
        <button
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 ps-12 ${
            activeTab === "exams" ? "bg-gray-700" : ""
          }`}
          onClick={() => setActiveTab("exams")}
        >
          <FileText size={20} /> Question Paper
        </button>
        <button
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 ps-12 ${
            activeTab === "profile" ? "bg-gray-700" : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <User size={20} /> Profile
        </button>
      </div>

      {/* Content Area */}
      <div className="w-3/4 p-6">
        <h1>Welcome to Examinee dashboard</h1>
      </div>
    </div>
  );
};

export default Examinee;
