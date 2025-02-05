/* eslint-disable no-unused-vars */
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxios";
import { useToken } from "../../hooks/TokenContext";

const ExaminerSingleQuestionNew = () => {
  const location = useLocation();
  const questionData = location.state || { data: { MCQSet: [] } };

  const [mcqSet, setMcqSet] = useState(() => {
    return Array.isArray(questionData?.data?.MCQSet)
      ? questionData.data.MCQSet
      : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedMcqId, setSelectedMcqId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMcq, setNewMcq] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAns: 0,
    mark: "",
  });

  const Axios = useAxiosSecure();
  const { approvalToken } = useToken();

  // Fetch updated MCQSet
  const fetchQuestionPaper = async () => {
    try {
      const updatedData = await Axios.get(
        `questionPaper/getSingleQuestionPaper/${questionData?.data?.id}`,
        { headers: { Authorization: approvalToken } }
      );
      setMcqSet(
        Array.isArray(updatedData.data?.data?.MCQSet)
          ? updatedData.data.data.MCQSet
          : []
      );
    } catch (error) {
      console.error("Failed to fetch question paper", error);
    }
  };

  const handleDeleteClick = (mcqId) => {
    setSelectedMcqId(mcqId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await Axios.delete(
        `questionPaper/removeMCQ?qid=${questionData?.data?.id}&mcqId=${selectedMcqId}`,
        { headers: { Authorization: approvalToken } }
      );
      setShowModal(false);
      fetchQuestionPaper();
    } catch (error) {
      console.error("Failed to delete MCQ", error);
    }
  };

  useEffect(() => {
    fetchQuestionPaper();
  }, [showModal]);

  const handleCreate = () => setShowCreateModal(true);

  const handleCreateSubmit = async () => {
    try {
      await Axios.patch(
        `questionPaper/addNewMCQ?qid=${questionData?.data?.id}`,
        newMcq,
        { headers: { Authorization: approvalToken } }
      );
      setShowCreateModal(false);
      setNewMcq({
        question: "",
        options: ["", "", "", ""],
        correctAns: 0,
        mark: "",
      });
      fetchQuestionPaper();
    } catch (error) {
      console.error("Failed to create MCQ", error);
    }
  };

  useEffect(() => {
    fetchQuestionPaper();
  }, [showCreateModal]);

  console.log("mcqSet:", mcqSet);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="w-3/4 p-6 overflow-scroll overflow-x-clip">
        <div className="flex justify-between mb-2">
          <h1 className="text-2xl font-bold mb-4 text-blue-400">
            Examinee Unique Single Paper
          </h1>
          <button
            onClick={handleCreate}
            className="bg-teal-600 px-4 py-2 rounded-lg text-white"
          >
            Add MCQ
          </button>
        </div>

        {questionData ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <p>
              <strong>ID:</strong> {questionData?.data?.id}
            </p>
            <p>
              <strong>Subject:</strong> {questionData?.data?.subject}
            </p>
            <p>
              <strong>Total Marks:</strong> {questionData?.data?.totalMarks}
            </p>
            <p>
              <strong>Duration:</strong> {questionData?.data?.duration} minutes
            </p>

            <h2 className="text-xl font-semibold mb-3 text-green-400">
              MCQ Set
            </h2>
            {Array.isArray(mcqSet) && mcqSet.length > 0 ? (
              mcqSet.map((mcq, index) => (
                <div
                  key={mcq.mcqId}
                  className="bg-gray-700 p-4 rounded-md shadow-md mb-4"
                >
                  <div className="flex justify-between">
                    <p className="font-bold">
                      Q{index + 1}: {mcq.question}
                    </p>
                    <button
                      onClick={() => handleDeleteClick(mcq.mcqId)}
                      className="bg-red-600 p-1 rounded-md mt-2"
                    >
                      <MdDelete className="fill-white w-6 h-6" />
                    </button>
                  </div>
                  <ul className="mt-2">
                    {Array.isArray(mcq.options) ? (
                      mcq.options.map((option, idx) => (
                        <li
                          key={idx}
                          className={`ml-4 ${
                            idx + 1 === mcq.correctAns ? "text-green-500" : ""
                          }`}
                        >
                          {idx + 1}. {option}
                        </li>
                      ))
                    ) : (
                      <li className="text-red-500">No options available</li>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No MCQs available.</p>
            )}
          </div>
        ) : (
          <p>No details available</p>
        )}
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <p className="text-lg mb-4">
              Are you sure you want to delete this MCQ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 rounded-md"
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

      {/* Create MCQ Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-lg font-bold mb-4">Create New MCQ</h2>
            <input
              type="text"
              placeholder="Question"
              value={newMcq.question}
              onChange={(e) =>
                setNewMcq({ ...newMcq, question: e.target.value })
              }
              className="w-full p-2 mb-2 rounded bg-gray-700"
            />
            {newMcq.options.map((option, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Option ${idx + 1}`}
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...newMcq.options];
                  updatedOptions[idx] = e.target.value;
                  setNewMcq({ ...newMcq, options: updatedOptions });
                }}
                className="w-full p-2 mb-2 rounded bg-gray-700"
              />
            ))}
            <input
              type="number"
              placeholder="Correct Answer Index (0-3)"
              value={newMcq.correctAns}
              onChange={(e) =>
                setNewMcq({ ...newMcq, correctAns: parseInt(e.target.value) })
              }
              className="w-full p-2 mb-2 rounded bg-gray-700"
            />
            <input
              type="number"
              placeholder="Marks"
              value={newMcq.mark}
              onChange={(e) => setNewMcq({ ...newMcq, mark: e.target.value })}
              className="w-full p-2 mb-4 rounded bg-gray-700"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 rounded-md"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-teal-600 rounded-md"
                onClick={handleCreateSubmit}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExaminerSingleQuestionNew;
