import { useEffect, useState } from "react";
import CommonWrapper from "../components/CommonWrapper";
import useAxiosSecure from "../hooks/useAxios";
import Cookies from "js-cookie";
import CommonTable from "../components/CommonTable";

const Admin = () => {
  const [allUsers, setAllUsers] = useState("");

  //Axios hook
  const Axios = useAxiosSecure();

  // retreiving token
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

  //get all users
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await Axios.get("/user/getAllUser", {
          headers: {
            Authorization: approvalToken,
          },
        });
        setAllUsers(response?.data?.body);
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getAllUsers();
  }, []);

  // console.log(approvalToken);
  console.log(allUsers);
  return (
    <>
      <CommonWrapper>
        <div>Admin</div>
        <div>
          <CommonTable allUsers={allUsers} />
        </div>
      </CommonWrapper>
    </>
  );
};

export default Admin;
