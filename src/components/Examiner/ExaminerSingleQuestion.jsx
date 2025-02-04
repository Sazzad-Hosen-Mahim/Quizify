import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxios";
import { useToken } from "../../hooks/TokenContext";

const ExaminerSingleQuestionNew = () => {
  const location = useLocation();
  const questionData = location.state || {};
  const [mcqSet, setMcqSet] = useState(questionData.data?.MCQSet || []);
  const [showModal, setShowModal] = useState(false);
  const [selectedMcqId, setSelectedMcqId] = useState(null);
  const Axios = useAxiosSecure();

  //retrieving token
  const { approvalToken } = useToken();

  const handleDeleteClick = (mcqId) => {
    setSelectedMcqId(mcqId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await Axios.delete(
        `questionPaper/removeMCQ?qid=${questionData?.data?.id}&mcqId=${selectedMcqId}`,
        {
          headers: {
            Authorization: approvalToken,
          },
        }
      );
      setMcqSet(mcqSet.filter((mcq) => mcq.mcqId !== selectedMcqId));
      setShowModal(false);
    } catch (error) {
      console.error("Failed to delete MCQ", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="w-3/4 p-6 overflow-scroll overflow-x-clip">
        <h1 className="text-2xl font-bold mb-4 text-blue-400">
          Examinee Unique Single Paper
        </h1>

        {questionData ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg ">
            <p className="mb-2">
              <strong className="text-blue-300">ID:</strong> {questionData.id}
            </p>
            <p className="mb-2">
              <strong className="text-blue-300">Subject:</strong>{" "}
              {questionData?.data?.subject}
            </p>
            <p className="mb-2">
              <strong className="text-blue-300">Total Marks:</strong>{" "}
              {questionData?.data?.totalMarks}
            </p>
            <p className="mb-4">
              <strong className="text-blue-300">Duration:</strong>{" "}
              {questionData?.data?.duration} minutes
            </p>

            {/* MCQ Section */}
            <h2 className="text-xl font-semibold mb-3 text-green-400">
              MCQ Set
            </h2>
            <div className="space-y-4">
              {mcqSet.map((mcq, index) => (
                <div
                  key={mcq.mcqId}
                  className="bg-gray-700 p-4 rounded-md shadow-md"
                >
                  <div className="flex justify-between">
                    <p className="text-lg font-medium mb-2 text-yellow-300">
                      Q{index + 1}: {mcq.question}
                    </p>
                    <button
                      className="bg-red-600 p-1 rounded-md"
                      onClick={() => handleDeleteClick(mcq.mcqId)}
                    >
                      <MdDelete className="fill-white w-6 h-6" />
                    </button>
                  </div>
                  <ul className="list-disc ml-6">
                    {mcq.options.map((option, optIndex) => (
                      <li
                        key={optIndex}
                        className={`${
                          optIndex === mcq.correctAns
                            ? "text-green-400"
                            : "text-gray-300"
                        }`}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No details available</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <p className="text-lg mb-4">
              Are you sure you want to delete this MCQ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-600 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded-md"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExaminerSingleQuestionNew;
