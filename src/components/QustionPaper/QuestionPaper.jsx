import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxios";
import { useToken } from "../../hooks/TokenContext";

const QuestionCard = ({ id, subject, duration, totalMarks, QPid }) => {
  const [mcqSet, setMcqSet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const Axios = useAxiosSecure();
  const { approvalToken } = useToken();

  useEffect(() => {
    let isCancelled = false;

    const fetchMCQSet = async () => {
      if (!QPid || !approvalToken) return;

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching MCQs with Token:", approvalToken);
        const response = await Axios.get(`questionPaper/getSingleQuestionPaper/${QPid}`, {
          headers: { Authorization: approvalToken },
        });

        console.log("Full API Response:", response.data);

        if (!isCancelled) {
          const mcqs = Array.isArray(response.data?.data?.MCQSet) ? response?.data?.data.MCQSet : [];
          setMcqSet([...mcqs]);
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
        if (!isCancelled) setError("Failed to load MCQs. Please try again.");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    if (isModalOpen) {
      fetchMCQSet();
    }

    return () => {
      isCancelled = true;
    };
  }, [isModalOpen, QPid, approvalToken]);

  return (
    <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg w-full mb-4">
      <h2 className="text-xl font-bold">{subject}</h2>
      <p className="text-gray-400">Duration: {duration} minutes</p>
      <p className="text-gray-400">Total Marks: {totalMarks}</p>

      {/* Show Details Button */}
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        Show Details
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-gray-300 hover:text-white text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </button>

            <h3 className="text-2xl font-semibold text-white mb-4">MCQ Details</h3>

            {loading && <p className="text-yellow-400">Loading MCQs...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {mcqSet.length > 0 ? (
              <div className="space-y-4">
                {mcqSet.map((mcq, index) => (
                  <div key={mcq.mcqId || index} className="p-4 bg-gray-800 rounded-md">
                    <p className="font-bold">{mcq?.question || "No Question Found"}</p>
                    <ul className="mt-2">
                      {mcq?.options && mcq.options.length > 0 ? (
                        mcq.options.map((option, i) => (
                          <li key={i} className="text-gray-300">
                            {i + 1}. {option}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">No options available</li>
                      )}
                    </ul>
                    <p className="text-green-400">
                      Correct Answer: {mcq?.options?.[mcq?.correctAns - 1] || "Not Available"}
                    </p>
                    <p className="text-yellow-300">Marks: {mcq?.mark || "N/A"}</p>
                  </div>
                ))}
              </div>
            ) : (
              !loading && <p className="text-gray-400">No MCQs available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
