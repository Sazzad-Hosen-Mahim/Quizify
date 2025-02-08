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
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdOpenInNew } from "react-icons/md";
import { useToken } from "../hooks/TokenContext";

const CommonTable = ({ allUsers }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(Array.isArray(allUsers) ? allUsers : []);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // retrieve token from context
  const { approvalToken } = useToken();

  const Axios = useAxiosSecure();

  useEffect(() => {
    if (Array.isArray(allUsers)) {
      setUsers(allUsers);
    }
  }, [allUsers]);

  // Handle delete confirmation modal
  const confirmDelete = (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete || !approvalToken) return;

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

  console.log(users);

  return (
    <>
      <Table isStriped aria-label="Users Table">
        <TableHeader>
          <TableColumn className="bg-mainBlue text-black py-4">
            NAME
          </TableColumn>
          <TableColumn className="bg-mainBlue text-black py-4">ID</TableColumn>
          <TableColumn className="bg-mainBlue text-black py-4">
            EMAIL
          </TableColumn>
          <TableColumn className="bg-mainBlue text-black border-r-1 py-4">
            STATUS
          </TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user?._id || user?.email}
              className="hover:bg-gray-800 hover:rounded-lg hover:text-white"
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
