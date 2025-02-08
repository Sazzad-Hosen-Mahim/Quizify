import { useState } from "react";
import PropTypes from "prop-types";
import useAxiosSecure from "../../hooks/useAxios";
import { useToken } from "../../hooks/TokenContext";

const CreateQuestionPaperModal = ({ onClose, onQuestionAdded }) => {
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAns: "", // Change to empty string to allow number input directly
      mark: "", // Initially empty string
    },
  ]);
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(""); // Keep as string initially, convert later
  // console.log(typeof duration);

  const Axios = useAxiosSecure();
  const { approvalToken } = useToken();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAns: "", // Initially empty string
        mark: "",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "questionText") {
      updatedQuestions[index].questionText = value;
    } else if (field === "correctAns") {
      updatedQuestions[index].correctAns = value !== "" ? parseInt(value) : ""; // Correct answer value as number
    } else if (field === "mark") {
      updatedQuestions[index].mark = Number(value);
    } else {
      updatedQuestions[index].options[field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    if (
      !subject ||
      !duration ||
      questions.some((q) => (!q.correctAns && q.correctAns !== 0) || !q.mark)
    ) {
      alert(
        "Please fill all required fields, including correct answer and marks."
      );
      return;
    }

    const payload = {
      subject,
      duration: parseInt(duration) * 60000, // Convert to minutes
      MCQSet: questions.map((q) => ({
        question: q.questionText,
        options: q.options,
        correctAns: q.correctAns !== "" ? q.correctAns : undefined, // Ensure it’s either a valid number or undefined
        mark: parseInt(q.mark),
      })),
    };

    try {
      await Axios.post(
        "https://test-alchemy-backend.vercel.app/api/v1/questionPaper/createQuestionPaper",
        payload,
        {
          headers: { Authorization: approvalToken },
        }
      );
      onQuestionAdded();
      onClose();
    } catch (error) {
      console.error("Error creating question paper", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-cyan-500/40 text-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl mb-4">Create Question Paper</h2>
        <input
          type="text"
          placeholder="Enter Subject"
          className="w-full p-2 rounded-md mb-2 bg-black"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter Duration (in minutes)"
          className="w-full p-2 rounded-md mb-2 bg-black"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        {questions.map((q, i) => (
          <div key={i} className="mb-4">
            <input
              type="text"
              placeholder="Enter Question"
              className="w-full p-2 rounded-md mb-2 bg-black"
              value={q.questionText}
              onChange={(e) => handleChange(i, "questionText", e.target.value)}
            />

            {q.options.map((option, j) => (
              <input
                key={j}
                type="text"
                placeholder={`Option ${j + 1}`}
                className="w-full p-2 rounded-md mb-2 bg-black"
                value={option}
                onChange={(e) => handleChange(i, j, e.target.value)}
              />
            ))}

            {/* Correct Answer Dropdown */}
            <input
              type="number"
              placeholder="Enter Correct Answer Index (1-4)"
              className="w-full p-2 rounded-md mb-2 bg-black"
              value={q.correctAns}
              onChange={(e) => handleChange(i, "correctAns", e.target.value)}
            />

            {/* Marks Input */}
            <input
              type="number"
              placeholder="Enter Marks"
              className="w-full p-2 rounded-md mb-2 bg-black"
              value={q.mark}
              onChange={(e) => handleChange(i, "mark", e.target.value)}
            />
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="bg-white text-black p-2 w-full mb-2 hover:bg-gray-300 rounded-md"
        >
          Add Question
        </button>
        <div className="mt-3 flex justify-end gap-4 items-center">
          <button
            onClick={onClose}
            className="bg-slate-800 text-white p-2 rounded-md hover:bg-slate-900 shadow-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-sky-600 text-black py-2 px-4 rounded-md hover:bg-sky-700 hover:text-white shadow-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
CreateQuestionPaperModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onQuestionAdded: PropTypes.func.isRequired,
};

export default CreateQuestionPaperModal;
