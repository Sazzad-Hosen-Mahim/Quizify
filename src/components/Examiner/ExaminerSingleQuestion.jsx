import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const ExaminerSingleQuestionNew = () => {
  const location = useLocation();
  const questionData = location.state || {};

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-400">
          Examinee Unique Single Paper
        </h1>

        {questionData ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
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
              {questionData.data?.MCQSet?.map((mcq, index) => (
                <div
                  key={mcq.mcqId}
                  className="bg-gray-700 p-4 rounded-md shadow-md"
                >
                  <p className="text-lg font-medium mb-2 text-yellow-300">
                    Q{index + 1}: {mcq.question}
                  </p>
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
                  {/* <p className="mt-2 text-sm text-green-400">
                    Correct Answer: {mcq.options[mcq.correctAns]}
                  </p> */}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No details available</p>
        )}
      </div>
    </div>
  );
};

export default ExaminerSingleQuestionNew;
