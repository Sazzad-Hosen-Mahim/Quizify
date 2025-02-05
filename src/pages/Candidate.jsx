import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";
import { useToken } from "../hooks/TokenContext";
import useAxiosSecure from "../hooks/useAxios";
import useDebounce from "../hooks/useDebounseDefault";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Pagination } from "@heroui/react";


const Candidate = () => {
  const [activeTab, setActiveTab] = useState("exams");
  const { user, approvalToken } = useToken();
  const candidateId = user.id;
  
  const [questionPapers, setQuestionPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
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
      const response = await Axios.get("questionPaper/getAllQuestionPapersForCandidate", {
        headers: { Authorization: approvalToken },
      });
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
      const startTime = Date.now().toString();
      console.log(startTime);
      
      const response = await Axios.post(
        "exam/start",
        { startTime, questionPaperId: exam.id, candidId: candidateId },
        { headers: { Authorization: approvalToken } }
      );
       
      
      if (response.data?.body?.mcq) {
        setMcqs(response.data.body.mcq);
        setSelectedExam(exam);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error starting the exam:", error);
    }
  };
  
  
  

  const handleAnswerSelect = (mcqId, answer) => {
    setAnswers((prev) => ({ ...prev, [mcqId]: answer }));
  };

  const submitExam = async () => {
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
      const answerSheet = Object.entries(answers).map(([mcqId, answer]) => ({ mcqId, answer }));
  
      const payload = {
        id: selectedExam.examineeId, // ✅ Examinee ID
        questionPaperId: selectedExam.id, // ✅ Exam ID (questionPaperId)
        isSubmitted: true,
        endTime,
        answerSheet,
      };
  
      console.log("Sending payload:", payload); // Debugging log before submission
  
      const response = await Axios.post("exam/submit", payload, {
        headers: { Authorization: approvalToken },
      });
  
      console.log("Exam submitted successfully:", response.data);
      setResult(response.data.body);
      setIsResultModalOpen(true)
    } catch (error) {
      console.error("Error submitting the exam:", error);
    }
  };
  
  
  

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-1/4 bg-gray-800 p-5 flex flex-col gap-4 border-r border-gray-700">
        <h2 className="text-xl font-bold text-center">Candidate Dashboard</h2>
        <button className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 ps-12 ${activeTab === "exams" ? "bg-gray-700" : ""}`} onClick={() => setActiveTab("exams")}>
          <FileText size={20} /> Question Paper
        </button>
      </div>
      <div className="w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to Candidate Dashboard</h1>
        <div className="mb-4 flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search question papers..."
            className="bg-transparent text-white outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab === "exams" && (
          <div className="grid grid-cols-3 gap-4">
            {questionPapers.length > 0 ? (
              questionPapers.map((data) => (
                <div key={data.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold">{data.subject}</h2>
                  <p className="text-gray-400">Duration: {data.duration} mins</p>
                  <p className="text-gray-400">Total Marks: {data.totalMarks}</p>
                  <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg" onClick={() => startExam(data)}>
                    Start Exam
                  </button>
                </div>
              ))
            ) : (
              <p className="text-red-500">No question papers available.</p>
            )}
          </div>
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 text-white max-h-[70vh] h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <DialogHeader>
            <DialogTitle>{selectedExam?.subject} - MCQs</DialogTitle>
            {/* <button onClick={setIsDialogOpen(false)}/> */}
          </DialogHeader>
          <div className="space-y-4 h-[55vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {mcqs.map((mcq) => (
              <div key={mcq.id} className="p-3 bg-gray-700 rounded">
                <p className="font-semibold">{mcq.question}</p>
                {mcq.options.map((option, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input type="radio" name={mcq.id} value={index + 1} onChange={() => handleAnswerSelect(mcq.id, index + 1)} className="w-4 h-4" />
                    {option}
                  </label>
                ))}
              </div>
            ))}
          </div>
          <DialogFooter>
            <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg w-full" onClick={submitExam}>Submit</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
        <DialogContent className = "bg-gray-800 text-white max-h-[60vh] h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <DialogHeader>
            <DialogTitle>Exam Result</DialogTitle>
          </DialogHeader>

          {result && (
            <div className="p-4">
              <p className="text-lg font-semibold text-black">Acquired Marks: {result.acquiredMark} / {result.totalMarks}</p>
              <div className="space-y-3">
          {result.reportSheet?.map((report, index) => (
            <div key={index} className="p-3 bg-gray-700 rounded">
              <p className="font-semibold">Question ID: {report.questionId}</p>
              <p>✅ Correct Answer: {report.correctAnswer}</p>
              <p>📝 Your Answer: {report.studentAnswer}</p>
            </div>
          ))}
        </div>

            </div>
          )}
            <DialogFooter>
      <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg w-full" onClick={() => setIsResultModalOpen(false)}>Close</button>
    </DialogFooter>
        </DialogContent>

      </Dialog>

    <div className="mt-6 flex justify-center">
     

    </div>
    </div>
  );
};

export default Candidate;
