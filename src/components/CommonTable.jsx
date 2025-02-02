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
import { useState } from "react";

const CommonTable = ({ allUsers }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDetailsClick = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  return (
    <>
      <Table isStriped aria-label="Example static collection table">
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
          {(Array.isArray(allUsers) ? allUsers : []).map((user) => (
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
                    Details
                  </button>
                  <button className="bg-red-500 py-2 px-4 rounded-lg font-semibold hover:bg-red-700">
                    Delete
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
        classNames={{
          body: "py-6",
          backdrop: "bg-[#589492]/15 backdrop-opacity-20",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        radius="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                User Details
              </ModalHeader>
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
    </>
  );
};

export default CommonTable;
