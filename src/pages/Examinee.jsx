import { useToken } from "../hooks/TokenContext";
import Sidebar from "../components/Examiner/Sidebar";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxios";
import QuestionCard from "../components/QustionPaper/QuestionPaper";

import { Pagination } from "@heroui/react";



const Examinee = () => {
  const [question, setQuestion] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const Axios = useAxiosSecure();
  const { approvalToken } = useToken();

  useEffect(() => {
    const getAllQuestionPaper = async () => {
      try {
        const response = await Axios.get(
          "questionPaper/getAllQuestionPapersForExaminer",
          { headers: { Authorization: approvalToken } }
        );

        setQuestion(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getAllQuestionPaper();
  }, [approvalToken]);

  const totalPages = Math.ceil(question.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = question.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="w-3/4 p-6">
      

        <div className="grid grid-cols-3 gap-4">
          {currentQuestions.length > 0 ? (
            currentQuestions.map((data) => (
              <QuestionCard key={data.id} {...data} QPid={data.id} />
            ))
          ) : (
            <p className="text-red-500">No question papers available.</p>
          )}
        </div>

      
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
        )}
      </div>
    </div>
  );
};

export default Examinee;