import { useEffect, useState } from "react";
import { Home, FileText, User, Search } from "lucide-react";
import { Pagination } from "@heroui/react";
import { useToken } from "../hooks/TokenContext";
import useAxiosSecure from "../hooks/useAxios";
import useDebounce from "../hooks/useDebounseDefault"; // Debounce hook

const Candidate = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, approvalToken } = useToken();
  const [question, setQuestion] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const Axios = useAxiosSecure();

  // Function to fetch all question papers
  const fetchAllQuestionPapers = async () => {
    try {
      console.log("Fetching all question papers...");
      const response = await Axios.get("questionPaper/getAllQuestionPapersForCandidate", {
        headers: { Authorization: approvalToken },
      });

      setQuestion(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch all question papers on mount
  useEffect(() => {
    fetchAllQuestionPapers();
  }, [approvalToken]);

  // Fetch searched question papers or all when search is cleared
  useEffect(() => {
    if (!debouncedSearchTerm) {
      fetchAllQuestionPapers(); // If search is cleared, show all questions
      return;
    }

    const fetchSearchedQuestionPapers = async () => {
      try {
        console.log(`Searching for "${debouncedSearchTerm}"...`);
        const response = await Axios.get("search/searchForCandidate", {
          params: { searchTerm: debouncedSearchTerm, limit, page },
          headers: { Authorization: approvalToken },
        });

        setQuestion(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchedQuestionPapers();
  }, [debouncedSearchTerm, page]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 p-5 flex flex-col gap-4 border-r border-gray-700">
        <h2 className="text-xl font-bold text-center">Examinee Dashboard</h2>
        {/* <button
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 ps-12 ${
            activeTab === "home" ? "bg-gray-700" : ""
          }`}
          onClick={() => setActiveTab("home")}
        >
          <Home size={20} /> Home
        </button> */}
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
        <h1 className="text-2xl font-bold mb-4">Welcome to Candidate Dashboard</h1>

        {/* Search Input */}
        <div className="mb-4 flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search question papers..."
            className="bg-transparent text-white outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Show Cards if "exams" tab is active */}
        {activeTab === "exams" && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {question.length > 0 ? (
                question.map((data) => (
                  <div key={data.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold">{data.subject}</h2>
                    <p className="text-gray-400">Duration: {data.duration} mins</p>
                    <p className="text-gray-400">Total Marks: {data.totalMarks}</p>
                    <button
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                      onClick={() => console.log(`Starting exam for ${data.subject}`)}
                    >
                      Start Exam
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-red-500">No question papers available.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <Pagination
                totalPages={5} // Adjust based on API response
                currentPage={page}
                onPageChange={setPage}
                showEdges
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Candidate;
