/* eslint-disable react/prop-types */
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxios";
import Cookies from "js-cookie";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdOpenInNew } from "react-icons/md";

const CommonTable = ({ allUsers }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(Array.isArray(allUsers) ? allUsers : []);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const Axios = useAxiosSecure();

  useEffect(() => {
    if (Array.isArray(allUsers)) {
      setUsers(allUsers);
    }
  }, [allUsers]);

  // Get token from cookies
  const token = Cookies.get("user");
  let approvalToken = null;
  if (token) {
    try {
      const parsedToken = JSON.parse(token);
      approvalToken = parsedToken?.approvalToken || null;
    } catch (error) {
      console.error("Error parsing token from cookies:", error);
    }
  }

  // Handle delete confirmation modal
  const confirmDelete = (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await Axios.delete(`/user/deleteUser/${userToDelete}`, {
        headers: { Authorization: approvalToken },
      });

      // Remove user immediately from state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDetailsClick = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  return (
    <>
      <Table isStriped aria-label="Users Table">
        <TableHeader>
          <TableColumn className="bg-blue-500 text-black py-4">
            NAME
          </TableColumn>
          <TableColumn className="bg-blue-500 text-black py-4">ID</TableColumn>
          <TableColumn className="bg-blue-500 text-black py-4">
            EMAIL
          </TableColumn>
          <TableColumn className="bg-blue-500 text-black border-r-1 py-4">
            STATUS
          </TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user?._id}
              className="hover:bg-gray-800 hover:rounded-lg"
            >
              <TableCell className="py-4">
                {user?.firstName} {user?.lastName}
              </TableCell>
              <TableCell className="py-4">{user?.id}</TableCell>
              <TableCell className="py-4">{user?.email}</TableCell>
              <TableCell className="py-4">
                <div className="flex gap-4">
                  <button
                    className="bg-teal-500 py-2 px-4 rounded-lg text-black font-semibold hover:bg-cyan-600"
                    onClick={() => handleDetailsClick(user)}
                  >
                    <MdOpenInNew />
                  </button>
                  <button
                    className="bg-red-500 py-2 px-4 rounded-lg font-semibold hover:bg-red-700"
                    onClick={() => confirmDelete(user?.id)}
                  >
                    <RiDeleteBin6Fill className="text-xl" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Details Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        radius="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>User Details</ModalHeader>
              <ModalBody>
                {selectedUser && (
                  <div>
                    <p>
                      <strong>Name:</strong> {selectedUser.firstName}{" "}
                      {selectedUser.lastName}
                    </p>
                    <p>
                      <strong>ID:</strong> {selectedUser.id}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedUser.email}
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="foreground" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(false)}
        backdrop="opaque"
        radius="lg"
      >
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this user?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              className="bg-red-500 hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Yes, Delete
            </Button>
            <Button
              color="foreground"
              variant="light"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommonTable;
