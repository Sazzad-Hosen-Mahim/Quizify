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
    correctAns: 1,
    mark: "",
  });

  const Axios = useAxiosSecure();
  const { approvalToken } = useToken();

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

  const handleCreate = () => setShowCreateModal(true);

  const handleCreateSubmit = async () => {
    try {
      const payload = {
        ...newMcq,
        correctAns: Number(newMcq.correctAns), // Ensure correctAns is a number
        mark: Number(newMcq.mark) || 0,
      };

      await Axios.patch(
        `questionPaper/addNewMCQ?qid=${questionData?.data?.id}`,
        payload,
        { headers: { Authorization: approvalToken } }
      );

      setShowCreateModal(false);
      setNewMcq({
        question: "",
        options: ["", "", "", ""],
        correctAns: 1,
        mark: "",
      });
      fetchQuestionPaper();
    } catch (error) {
      console.error("Failed to create MCQ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("option")) {
      const index = parseInt(name.replace("option", ""), 10) - 1;
      setNewMcq((prev) => {
        const updatedOptions = [...prev.options];
        updatedOptions[index] = value;
        return { ...prev, options: updatedOptions };
      });
    } else {
      setNewMcq((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    fetchQuestionPaper();
  }, []);

  return (
    <div className="flex bg-cyan-800/50 h-screen text-white font-poppins">
      <Sidebar />
      <div className="w-3/4 p-6 overflow-scroll overflow-x-clip">
        <div className="flex justify-between mb-2">
          <h1 className="text-2xl font-bold mb-4 text-white">Question Paper</h1>
          <button
            onClick={handleCreate}
            className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white hover:bg-white group rounded-lg"
          >
            <span className="w-48 h-48 rounded rotate-[-40deg] bg-teal-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
            <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
              Add MCQ
            </span>
          </button>
        </div>

        {questionData ? (
          <div className="bg-black p-6 rounded-lg shadow-lg">
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
              <strong>Duration:</strong> {questionData?.data?.duration / 60000}{" "}
              minutes
            </p>

            <h2 className="text-xl font-semibold mb-3 text-green-400">
              MCQ Set
            </h2>
            {mcqSet.length > 0 ? (
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
                    {mcq.options.map((option, idx) => (
                      <li
                        key={idx}
                        className={`ml-4 ${
                          idx + 1 === mcq.correctAns
                            ? "text-green-400 font-bold"
                            : ""
                        }`}
                      >
                        {idx + 1}. {option}
                      </li>
                    ))}
                  </ul>
                  <p className="text-yellow-400 mt-2">
                    <strong>Correct Answer:</strong> {mcq.correctAns}
                  </p>
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

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-poppins">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">Are you sure you want to delete this MCQ?</p>
            <button
              onClick={confirmDelete}
              className="bg-red-600 px-4 py-2 rounded-md text-white mr-2"
            >
              Delete
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 px-4 py-2 rounded-md text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Create MCQ Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-green-400">
              Add MCQ
            </h2>
            <div>
              <input
                type="text"
                name="question"
                value={newMcq.question}
                onChange={handleChange}
                placeholder="Enter question"
                className="w-full mb-2 p-2 rounded-md bg-gray-600 text-white"
              />
            </div>
            <div>
              {newMcq.options.map((option, idx) => (
                <input
                  key={idx}
                  type="text"
                  name={`option${idx + 1}`}
                  value={option}
                  onChange={handleChange}
                  placeholder={`Option ${idx + 1}`}
                  className="w-full mb-2 p-2 rounded-md bg-gray-600 text-white"
                />
              ))}
            </div>
            <div>
              <input
                type="number"
                name="correctAns"
                value={newMcq.correctAns}
                onChange={handleChange}
                placeholder="Correct Answer (1-4)"
                className="w-full mb-2 p-2 rounded-md bg-gray-600 text-white"
              />
            </div>
            <div>
              <input
                type="number"
                name="mark"
                value={newMcq.mark}
                onChange={handleChange}
                placeholder="Mark"
                className="w-full mb-4 p-2 rounded-md bg-gray-600 text-white"
              />
            </div>
            <button
              onClick={handleCreateSubmit}
              className="bg-teal-600 px-4 py-2 rounded-md text-white mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="bg-gray-500 px-4 py-2 rounded-md text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExaminerSingleQuestionNew;
