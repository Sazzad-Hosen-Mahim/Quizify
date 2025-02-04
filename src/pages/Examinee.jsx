import { useToken } from "../hooks/TokenContext";
import Sidebar from "../components/Examiner/Sidebar";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxios";
import QuestionCard from "../components/QustionPaper/QuestionPaper";

import { Pagination } from "@heroui/react";



const Examinee = () => {
  const [question, setQuestion] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

  // Axios hook
  const Axios = useAxiosSecure();
  // Approval Token
  const { approvalToken } = useToken();

  useEffect(() => {
    const getAllQuestionPaper = async () => {
      try {
        console.log("Fetching data from API...");
        console.log("Authorization Token:", approvalToken);

        const response = await Axios.get(
          "questionPaper/getAllQuestionPapersForExaminer",
          {
            headers: {
              Authorization: approvalToken,
            },
          }
        );

        console.log("Response Data:", response?.data);
        setQuestion(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error(
          "Response Data:",
          error.response?.data || "No response data"
        );
        console.error("Status Code:", error.response?.status);
      }
    };

    getAllQuestionPaper();
  }, [approvalToken]);

  // Calculate total pages
  const totalPages = Math.ceil(question.length / itemsPerPage);

  // Get paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = question.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}

      <div className="w-3/4 p-6">
        {/* Grid for Question Cards */}
        <div className="grid grid-cols-3 gap-4">
          {currentQuestions.length > 0 ? (
            currentQuestions.map((data, index) => <QuestionCard key={index} {...data} QPid={data.id} />)
          ) : (
            <p className="text-red-500">No question papers available.</p>
          )}
        </div>

        {/* Hero UI Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={setCurrentPage}
              size="md"
              className="text-white"
              color="white"
              rounded
            />
          </div>

      <div className="w-3/4 p-6 grid grid-cols-3 gap-2">
        {Array.isArray(question) && question.length > 0 ? (
          question.map((data, index) => (
            <QuestionCard key={index} {...data} QPid={data.id} />
          ))
        ) : (
          <p className="text-red-500">No question papers available.</p>

        )}
      </div>
    </div>
  );
};

export default Examinee;
