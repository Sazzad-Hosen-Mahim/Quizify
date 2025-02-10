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
import {
  AnswerContent,
  AnswerFooter,
  AnswerHeader,
  Answers,
  AnswerTitle,
} from "../components/AnswerSheet";
import { Button, Radio, RadioGroup } from "@heroui/react";
import { CircleX } from "lucide-react";

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
  const [currentQuestioonIndex, setCurrentQuestioonIndex] = useState(0);

  const Axios = useAxiosSecure();

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
      setMcqs([]); // Reset MCQs
      setAnswers({}); // Reset previous answers
      setSelectedExam(null); // Reset selected exam state
      setStartTime(null); // Reset start time
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

  const handleAnswerSelect = (mcqId, selectOption) => {
    setAnswers((prev) => ({
      ...prev,
      [mcqId]: selectOption,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestioonIndex < mcqs.length - 1) {
      setCurrentQuestioonIndex((prev) => prev + 1);
    }
  };
  const prevQuestion = () => {
    if (currentQuestioonIndex > 0) {
      setCurrentQuestioonIndex((prev) => prev - 1);
    }
  };
  console.log("answer before submission", answers);

  const submitExam = async () => {
    if (!startTime) {
      console.log("exam not started");
      return;
    }

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
    <div className="flex  bg-cyan-800/50 text-white font-poppins">
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
        <DialogContent className="bg-gray-800 text-white lg:h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 font-poppins">
          <DialogHeader>
            <div className="flex">
              <div>
                <DialogTitle>{selectedExam?.subject} - MCQs</DialogTitle>
              </div>

              <div>
                <Button
                  className=" bg-transparent hover:text-red-400 justify-end !min-w-0 text-white p-2 rounded-lg ml-[120px] "
                  onClick={() => {
                    submitExam();
                    setIsDialogOpen(false);
                  }}
                >
                  <CircleX />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="h-[30vh] flex flex-col justify-between">
            {Array.isArray(mcqs) && mcqs.length > 0 && (
              <div key={mcqs[currentQuestioonIndex].id} className="p-3 rounded">
                <p className="font-semibold">
                  {mcqs[currentQuestioonIndex].question}
                </p>
                <RadioGroup className="flex flex-col mt-4 mb-5 text-gray-200">
                  {mcqs[currentQuestioonIndex].options.map((option, index) => (
                    <div key={index} className="flex items-center gap-7">
                      <Radio
                        name={mcqs[currentQuestioonIndex].id}
                        value={index + 1}
                        checked={
                          answers[mcqs[currentQuestioonIndex].id] === index + 1
                        }
                        onChange={() =>
                          handleAnswerSelect(
                            mcqs[currentQuestioonIndex].id,
                            index + 1
                          )
                        }
                        className="w-4 h-4"
                      />
                      <span>{option}</span>{" "}
                      {/* Ensures text appears next to radio button */}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
            {/* Navigation Buttons */}
            <div className="flex justify-between mb-4 ">
              <Button
                variant="faded"
                onClick={prevQuestion}
                disabled={currentQuestioonIndex === 0}
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg w-1/3 disabled:opacity-50"
              >
                Previous
              </Button>

              {currentQuestioonIndex === mcqs.length - 1 ? (
                <Button
                  onClick={() => {
                    submitExam();
                    setIsDialogOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg "
                >
                  Submit
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="flat"
                  onClick={nextQuestion}
                  className="bg-[#39ACE1] hover:bg-blue-700 text-white  p-2 rounded-lg w-1/3"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <div>
              <Button
                variant="shadow"
                className="bg-green-600 hover:bg-green-700 mt-10 text-white font-semibold p-2 rounded-lg w-full "
                onClick={() => {
                  submitExam();
                  setIsDialogOpen(false);
                }}
              >
                Submit
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Answers open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
        <AnswerContent className="bg-gray-800 text-white max-h-[60vh] h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <AnswerHeader>
            <AnswerTitle>Exam Result</AnswerTitle>
          </AnswerHeader>

          {result && (
            <div className="space-y-4 h-[55vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
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
          <AnswerFooter>
            <button
              className="bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-lg w-full"
              onClick={() => setIsResultModalOpen(false)}
            >
              Close
            </button>
          </AnswerFooter>
        </AnswerContent>
      </Answers>

      <div className="mt-6 flex justify-center"></div>
    </div>
  );
};

export default Candidate;
