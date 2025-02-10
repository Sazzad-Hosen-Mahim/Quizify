import { useEffect, useState } from "react";
import CommonWrapper from "../components/CommonWrapper";
import useAxiosSecure from "../hooks/useAxios";
import CommonTable from "../components/CommonTable";
import { useToken } from "../hooks/TokenContext";
import usePostMutate from "../hooks/shared/usePostMutate";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { Spinner } from "@heroui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Admin = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // Axios hook
  const Axios = useAxiosSecure();

  // Retrieving token from context
  const { approvalToken } = useToken();

  // Get all users
  useEffect(() => {
    const getAllUsers = async () => {
      if (!approvalToken) return;

      try {
        const response = await Axios.get("/user/getAllUser", {
          headers: {
            Authorization: approvalToken,
          },
        });

        const fetchedUsers = response?.data?.body || [];
        setAllUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getAllUsers();
  }, [approvalToken, Axios]);

  console.log(allUsers);

  const applyFiltersAndSearch = (users) => {
    let filtered = [...users];

    // Apply filter
    if (filterType === "examiner") {
      filtered = filtered.filter((user) => user.userType === "examinee");
    } else if (filterType === "candidate") {
      filtered = filtered.filter((user) => user.userType === "candidate");
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter((user) =>
        Object.values(user).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(0); // Reset pagination to the first page
  };

  useEffect(() => {
    applyFiltersAndSearch(allUsers);
  }, [filterType]);

  useEffect(() => {
    applyFiltersAndSearch(allUsers);
  }, [searchTerm]);

  // Form handling with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSuccess = (res) => {
    console.log("User Created:", res);
    setAllUsers((prevUsers) => [...prevUsers, res.data]);
    setIsModalOpen(false);
    reset();
  };
  const onError = (err) => {
    console.log(err);
  };

  const { mutate } = usePostMutate("/user/createExaminee", onSuccess, onError);

  const onSubmit = (data) => {
    mutate(data);
  };

  const totalPages = Math.ceil(filteredUsers.length / limit);
  const currentData = filteredUsers.slice(
    currentPage * limit,
    (currentPage + 1) * limit
  );

  if (!approvalToken) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  console.log(JSON.stringify(filteredUsers), "filteredUsers");

  return (
    <>
      <CommonWrapper>
        <div className="flex justify-between items-center my-4">
          {/* Filter Select */}
          <div className="w-60">
            <Select onValueChange={setFilterType} value={filterType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="examiner">Examiner</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex items-center">
            {/* Search Icon */}
            <FaSearch className="absolute left-3 text-gray-400" />
            {/* Input Field */}
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="relative inline-flex items-center justify-center px-10 py-3 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-700 rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-cyan-500"></span>
            <span className="relative">Create Examiner</span>
          </button>
        </div>
        <div>
          <CommonTable allUsers={currentData} />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
      </CommonWrapper>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Create Examiner</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register("firstName", {
                  required: "First Name is required",
                })}
                type="text"
                placeholder="First Name"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              {errors.firstName && (
                <p className="text-red-500">{errors.firstName.message}</p>
              )}

              <input
                {...register("lastName", { required: "Last Name is required" })}
                type="text"
                placeholder="Last Name"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              {errors.lastName && (
                <p className="text-red-500">{errors.lastName.message}</p>
              )}

              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Email"
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}

              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="Password"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
