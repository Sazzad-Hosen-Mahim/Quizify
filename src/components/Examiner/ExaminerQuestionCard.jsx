import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxios";
import { useToken } from "../../hooks/TokenContext";
import { motion } from "framer-motion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

/* eslint-disable react/prop-types */
const ExaminerQuestionCard = ({ question }) => {
  const { duration, examineeId, subject, totalMarks, id } = question;

  // Manage local state to track deletion
  const [isDeleted, setIsDeleted] = useState(false);

  // Retrieve token
  const { approvalToken } = useToken();

  const navigate = useNavigate();
  const Axios = useAxiosSecure(); // Hook for secure Axios requests

  //modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = () => {
    onOpen();
  };

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

  const handleDelete = async () => {
    try {
      const response = await Axios.delete(
        `questionPaper/deleteQuestionPaper?qid=${id}&examineeId=${examineeId}`,
        {
          headers: {
            Authorization: approvalToken,
          },
        }
      );

      if (response?.data) {
        console.log("Deleted Successfully:", response.data);
        onClose();
        // Immediately update state to remove from UI
        setIsDeleted(true);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  if (isDeleted) return null; // Hide the component after deletion

  return (
    <>
      <div className="dark:bg-black p-3 w-full rounded-lg shadow-medium mt-3">
        <h1 className="text-xl font-bold mb-5">Subject: {subject}</h1>
        <p>Duration: {duration / 60000}</p>
        <p>Examinee Id: {examineeId}</p>
        <p>Total Marks: {totalMarks}</p>
        <motion.button
          className="mt-4 bg-[rgba(93,197,183,0.8)] text-white px-6 py-2 rounded-lg shadow-lg"
          whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(78, 234, 213, 1)",
            boxShadow: "0px 0px 10px rgba(78, 234, 213, 0.8)",
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShowDetails}
        >
          Show Details
        </motion.button>
        <button
          onClick={handleOpen}
          className="mt-5 ms-3 bg-red-500 px-5 py-2 text-white hover:bg-red-700 hover:text-black rounded-lg shadow-lg"
        >
          Delete Question Paper
        </button>
      </div>
      {/* modal  */}

      <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-red-600">
                Confirm Delete
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this question paper?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="text-teal-600 font-semibold"
                  variant="light"
                  onPress={onClose}
                >
                  No, Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 font-semibold"
                  onPress={handleDelete}
                >
                  Yes, Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExaminerQuestionCard;
