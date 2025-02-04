import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useToken } from "../../hooks/TokenContext";
import useAxiosSecure from "../../hooks/useAxios";
import ExaminerQuestionCard from "./ExaminerQuestionCard";

const ExaminerQuestionPaperDashboard = () => {
  const [question, setQuestion] = useState([]);
  const [loading, setLoading] = useState(true);

  // Axios hook
  const Axios = useAxiosSecure();

  // Approval Token
  const { approvalToken } = useToken();

  useEffect(() => {
    const getAllQuestionPaper = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(
          "questionPaper/allQuestionPapersOfExaminee",
          {
            headers: {
              Authorization: approvalToken,
            },
          }
        );
        setQuestion(response?.data?.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getAllQuestionPaper();
  }, [approvalToken]);

  return (
    <div className="flex h-screen bg-[#2E3944] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="w-3/4 p-6 ">
        <div className="flex justify-between mb-5 pe-8">
          <h1>Welcome to Examinee Unique Question Paper</h1>
          <button
            href="#_"
            className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white hover:bg-white group rounded-lg"
          >
            <span className="w-48 h-48 rounded rotate-[-40deg] bg-teal-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
            <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
              Create Question Paper
            </span>
          </button>
        </div>
        <div>
          {loading ? (
            <div className="text-center text-blue-400">Loading...</div>
          ) : Array.isArray(question) && question.length > 0 ? (
            question.map((q, i) => (
              <ExaminerQuestionCard key={i} question={q} />
            ))
          ) : (
            <p>No question paper available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExaminerQuestionPaperDashboard;
