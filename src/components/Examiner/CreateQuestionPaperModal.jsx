import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxios";
import { useToken } from "../../hooks/TokenContext";

const CreateQuestionPaperModal = ({ onClose, onQuestionAdded }) => {
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAns: null, // Initially null
      mark: "", // Initially empty string
    },
  ]);
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(""); // Keep as string initially, convert later

  const Axios = useAxiosSecure();
  const { approvalToken } = useToken();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAns: null,
        mark: "",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "questionText") {
      updatedQuestions[index].questionText = value;
    } else if (field === "correctAns") {
      updatedQuestions[index].correctAns = Number(value);
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
      duration: Number(duration),
      MCQSet: questions.map((q) => ({
        question: q.questionText,
        options: q.options,
        correctAns: q.correctAns,
        mark: Number(q.mark),
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
      <div className="bg-white text-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl mb-4">Create Question Paper</h2>
        <input
          type="text"
          placeholder="Enter Subject"
          className="w-full p-2 border mb-2"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter Duration (in minutes)"
          className="w-full p-2 border mb-4"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        {questions.map((q, i) => (
          <div key={i} className="mb-4">
            <input
              type="text"
              placeholder="Enter Question"
              className="w-full p-2 border border-red-500 mb-2"
              value={q.questionText}
              onChange={(e) => handleChange(i, "questionText", e.target.value)}
            />

            {q.options.map((option, j) => (
              <input
                key={j}
                type="text"
                placeholder={`Option ${j + 1}`}
                className="w-full p-2 border mb-1"
                value={option}
                onChange={(e) => handleChange(i, j, e.target.value)}
              />
            ))}

            {/* Correct Answer Dropdown */}
            <select
              className="w-full p-2 border mb-2"
              value={q.correctAns ?? ""}
              onChange={(e) => handleChange(i, "correctAns", e.target.value)}
            >
              <option value="" disabled>
                Select Correct Answer
              </option>
              {q.options.map((option, index) => (
                <option key={index} value={index}>
                  {option}
                </option>
              ))}
            </select>

            {/* Marks Input */}
            <input
              type="number"
              placeholder="Enter Marks"
              className="w-full p-2 border mb-4"
              value={q.mark}
              onChange={(e) => handleChange(i, "mark", e.target.value)}
            />
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="bg-green-500 text-white p-2 w-full mb-2"
        >
          +
        </button>
        <div className="flex justify-between">
          <button onClick={onClose} className="bg-gray-500 text-white p-2">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white p-2">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestionPaperModal;
