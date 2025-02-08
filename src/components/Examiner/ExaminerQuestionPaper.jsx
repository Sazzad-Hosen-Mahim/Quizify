import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useToken } from "../../hooks/TokenContext";
import useAxiosSecure from "../../hooks/useAxios";
import ExaminerQuestionCard from "./ExaminerQuestionCard";
import CreateQuestionPaperModal from "./CreateQuestionPaperModal";
import { FaSearch } from "react-icons/fa";

const ExaminerQuestionPaperDashboard = () => {
  const [question, setQuestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [allQuestionPaper, setAllQuestionPaper] = useState([]);

  const [showModal, setShowModal] = useState(false);
  // const [questionPapers, setQuestionPapers] = useState([]);

  // Axios hook
  const Axios = useAxiosSecure();

  // Approval Token
  const { approvalToken } = useToken();

  const fetchQuestionPapers = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(
        "questionPaper/allQuestionPapersOfExaminee",
        {
          headers: { Authorization: approvalToken },
        }
      );
      setQuestion(response?.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionPapers();
  }, [approvalToken]);

  const handleQuestionAdded = () => {
    fetchQuestionPapers(); // Re-fetch updated question papers
  };

  //search functionality
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!searchTerm) {
          // If search is empty, reset to all question papers
          setAllQuestionPaper(question);
          return;
        }

        const response = await Axios.get(
          `/search/searchForExaminee?searchTerm=${searchTerm}&limit=10&page=0`,
          {
            headers: { Authorization: approvalToken },
          }
        );

        console.log("Search Response:", response.data);
        const users = response?.data?.data;

        if (Array.isArray(users)) {
          setAllQuestionPaper(users.length ? users : []);
        } else {
          console.warn("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const delayDebounceFn = setTimeout(fetchUsers, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, Axios, approvalToken, question]);

  console.log(question);

  return (
    <div className="flex text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="w-3/4 p-6 h-screen bg-cyan-800/50">
        <div className="flex justify-between mb-5 pe-8 ">
          <h1 className="text-2xl font-bold">Examinee Question Paper</h1>
          <div className="relative flex items-center">
            {/* Search Icon */}
            <FaSearch className="absolute left-3 text-gray-400" />
            {/* Input Field */}
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white hover:bg-white group rounded-lg"
          >
            <span className="w-48 h-48 rounded rotate-[-40deg] bg-teal-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
            <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
              Create Question Paper
            </span>
          </button>
        </div>
        {showModal && (
          <CreateQuestionPaperModal
            onClose={() => setShowModal(false)}
            onQuestionAdded={handleQuestionAdded}
          />
        )}
        <div>
          {loading ? (
            <div className="text-center text-blue-400">Loading...</div>
          ) : Array.isArray(allQuestionPaper) && allQuestionPaper.length > 0 ? (
            allQuestionPaper.map((q, i) => (
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
