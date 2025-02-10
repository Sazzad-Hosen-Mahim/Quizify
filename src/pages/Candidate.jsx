/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";
import { useToken } from "../hooks/TokenContext";
import useAxiosSecure from "../hooks/useAxios";
import useDebounce from "../hooks/useDebounseDefault";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { CirclePlay } from "lucide-react";
import { Laugh } from "lucide-react";
import { MdTimer } from "react-icons/md";
import { PiExamFill } from "react-icons/pi";

const Candidate = () => {
  const [activeTab, setActiveTab] = useState("exams");
  const { user, approvalToken } = useToken();
  const candidateId = user.id;

  const [questionPapers, setQuestionPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(0);
  const [limit] = useState(10);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const Axios = useAxiosSecure();

  // const [question, setQuestion] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 6;

  // const totalPages = Math.ceil(question.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentQuestions = question.slice(indexOfFirstItem, indexOfLastItem);

  const fetchAllQuestionPapers = async () => {
    try {
      const response = await Axios.get(
        "questionPaper/getAllQuestionPapersForCandidate",
        {
          headers: { Authorization: approvalToken },
        }
      );
      setQuestionPapers(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching question papers:", error);
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isDialogOpen]);

  useEffect(() => {
    fetchAllQuestionPapers();
  }, [approvalToken]);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      fetchAllQuestionPapers();
      return;
    }

    const fetchSearchedQuestionPapers = async () => {
      try {
        const response = await Axios.get("search/searchForCandidate", {
          params: { searchTerm: debouncedSearchTerm, limit, page },
          headers: { Authorization: approvalToken },
        });
        setQuestionPapers(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    fetchSearchedQuestionPapers();
  }, [debouncedSearchTerm, page]);

  const startExam = async (exam) => {
    try {
      const currentStartTime = Date.now().toString();
      setStartTime(currentStartTime);
      console.log("Exam Start Time:", startTime);

      const response = await Axios.post(
        "exam/start",
        {
          startTime: currentStartTime,
          questionPaperId: exam.id,
          candidId: candidateId,
        },
        { headers: { Authorization: approvalToken } }
      );

      if (response.data?.body?.mcq) {
        setMcqs(response.data.body.mcq);
        setSelectedExam(exam);
        setIsDialogOpen(true);
        setAnswers({});
      }
    } catch (error) {
      console.error("Error starting the exam:", error);
    }
  };

  const handleAnswerSelect = (mcqId, answer) => {
    setAnswers((prev) => ({ ...prev, [mcqId]: answer }));
  };
  console.log("answer before submission", answers);

  const submitExam = async () => {
    if (!startTime) {
      console.log("exam not started");
      return;
    }

    // const currentTime = Date.now();
    // console.log("current time", currentTime);
    // console.log("exam start time", startTime);

    // const examDuration = 3600000;

    // if (currentTime - startTime > examDuration) {
    //   console.error("Time exceeded! Cannot submit.");
    //   return;
    // }

    try {
      console.log("Selected Exam Data:", selectedExam); // Debugging log

      if (!selectedExam || !selectedExam.id) {
        console.error("Error: Exam ID (questionPaperId) is missing!");
        return;
      }

      if (!selectedExam.examineeId) {
        console.error("Error: Examinee ID is missing!");
        return;
      }

      const endTime = Date.now().toString();
      const answerSheet = Object.entries(answers).map(([mcqId, answer]) => ({
        mcqId,
        answer,
      }));

      const payload = {
        id: selectedExam.examineeId, // ✅ Examinee ID
        questionPaperId: selectedExam.id, // ✅ Exam ID (questionPaperId)
        isSubmitted: true,
        endTime,
        answerSheet,
      };
      console.log("end time: ", endTime);

      console.log("Sending payload:", payload); // Debugging log before submission

      const response = await Axios.post("exam/submit", payload, {
        headers: { Authorization: approvalToken },
      });

      console.log("Exam submitted successfully:", response.data);
      setResult(response.data.body);
      setIsResultModalOpen(true);
    } catch (error) {
      console.error("Error submitting the exam:", error);
    }
  };

  return (
    <div className="flex  bg-cyan-800/50 text-white">
      <div className="w-1/4 dark:bg-black p-5 flex flex-col gap-4 border-r border-gray-700">
        <h2 className="text-xl font-bold text-center"> Dashboard</h2>
        <button
          className={`flex items-center py-3 ps-5 gap-2 rounded-lg hover:bg-gray-700    ${
            activeTab === "exams" ? "bg-mainBlue" : ""
          }`}
          onClick={() => setActiveTab("exams")}
        >
          <FileText size={20} className="" /> Question Paper
        </button>
      </div>
      <div className="w-3/4 p-6">
        <h1 className="items-center gap-5 text-2xl font-bold mb-4 flex">
          GOOD LUCK !{" "}
          <span className="text-mainBlue ">
            <Laugh />
          </span>
        </h1>
        <div className="mb-4 flex items-center gap-3 dark:bg-black p-3 rounded-lg">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search question papers..."
            className="bg-transparent text-white outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.isArray(questionPapers) && questionPapers.length > 0 ? (
            questionPapers.map((data) => (
              <div
                key={data.id}
                className="dark:bg-black p-4 rounded-lg shadow-lg"
              >
                <h2 className="text-lg font-semibold text-center">
                  {data.subject}
                </h2>
                <p className="text-gray-400 flex items-center">
                  <span className="pt-1 pr-1 text-red-500">
                    <MdTimer className="w-6 h-6" />
                  </span>
                  Duration: {data.duration / 60000} mins
                </p>
                <p className="text-gray-400 flex items-center">
                  <span className="pt-1 pr-1 text-green-500">
                    <PiExamFill className="w-6 h-6" />
                  </span>
                  Total Marks: {data.totalMarks}
                </p>
                <button
                  className="mt-3 w-full bg-[#65F6C4] hover:bg-mainBlue hover:text-white text-black p-2 rounded-lg"
                  onClick={() => startExam(data)}
                >
                  <span className="flex gap-3 font-semibold justify-center">
                    <CirclePlay /> Start Exam
                  </span>
                </button>
              </div>
            ))
          ) : (
            <p className="text-red-500">No question papers available.</p>
          )}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 text-white max-h-[70vh] h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <DialogHeader>
            <DialogTitle>{selectedExam?.subject} - MCQs</DialogTitle>
            {/* <button onClick={setIsDialogOpen(false)}/> */}
          </DialogHeader>
          <div className="space-y-4 h-[55vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {mcqs.map((mcq) => (
              <div key={mcq.id} className="p-3 bg-black rounded">
                <p className="font-semibold">{mcq.question}</p>
                {mcq.options.map((option, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={mcq.id}
                      value={index + 1}
                      onChange={() => handleAnswerSelect(mcq.id, index + 1)}
                      className="w-4 h-4"
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}
          </div>
          <DialogFooter>
            <button
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg w-full"
              onClick={submitExam}
            >
              Submit
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
        <DialogContent className="bg-gray-800 text-white max-h-[60vh] h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <DialogHeader>
            <DialogTitle>Exam Result</DialogTitle>
          </DialogHeader>

          {result && (
            <div className="p-4 ">
              <p className="text-xl font-semibold text-black pb-2 ">
                Acquired Marks:{" "}
                <span className="text-red-600 font-semibold">
                  {result.acquiredMark}
                </span>{" "}
                /{" "}
                <span className="text-green-600 font-semibold">
                  {result.totalMarks}
                </span>
              </p>
              <div className="space-y-3">
                {result.reportSheet?.map((report, index) => (
                  <div key={index} className="p-3 bg-black rounded-md">
                    <p className="font-semibold ">
                      Question ID: {report.questionId}
                    </p>
                    <p className="pb-2 pt-2">
                      ✅ Correct Answer: {report.correctAnswer}
                    </p>
                    <p>📝 Your Answer: {report.studentAnswer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              className="bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-lg w-full"
              onClick={() => setIsResultModalOpen(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-6 flex justify-center"></div>
    </div>
  );
};

export default Candidate;
