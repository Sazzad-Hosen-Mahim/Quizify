import Sidebar from "./Sidebar";

const ExaminerSingleQuestion = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="w-3/4 p-6">
        <h1>Welcome to Examinee Unique Question Paper</h1>
      </div>
    </div>
  );
};

export default ExaminerSingleQuestion;
