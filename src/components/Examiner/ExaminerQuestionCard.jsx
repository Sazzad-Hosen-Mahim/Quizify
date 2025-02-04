import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxios";
import { useToken } from "../../hooks/TokenContext";

/* eslint-disable react/prop-types */
const ExaminerQuestionCard = ({ question }) => {
  const { duration, examineeId, subject, totalMarks, id } = question;

  //retrieve token
  const { approvalToken } = useToken();

  const navigate = useNavigate();
  const Axios = useAxiosSecure(); // Hook for secure Axios requests

  const handleShowDetails = async () => {
    try {
      const response = await Axios.get(
        `questionPaper/getSingleQuestionPaper/${id}`,
        {
          headers: {
            Authorization: approvalToken,
          },
        }
      );

      if (response?.data) {
        console.log("Fetched Data:", response.data);
        // Navigate to the details page, passing data via state
        navigate(`/examinee/dashboard/singleQuestion/${id}`, {
          state: response?.data,
        });
      }
    } catch (error) {
      console.error("Error fetching question details:", error);
    }
  };

  console.log(question);
  return (
    <div className="bg-[#124E66] p-3 w-full rounded-lg shadow-medium mt-3">
      <h1>Duration: {duration}</h1>
      <p>Examinee Id: {examineeId}</p>
      <p>Subject: {subject}</p>
      <p>Total Marks: {totalMarks}</p>
      <button
        onClick={handleShowDetails}
        className="mt-5  bg-[#748D92]  px-5 py-2 text-black hover:bg-[#212A31] hover:text-white  rounded-lg shadow-lg"
      >
        Show Details
      </button>
    </div>
  );
};

export default ExaminerQuestionCard;
