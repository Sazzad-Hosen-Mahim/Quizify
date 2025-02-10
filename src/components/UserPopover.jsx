/* eslint-disable react/prop-types */

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Separator } from "./ui/separator";

import { ModeToggle } from "./ui/ModeToggle";
import { Button } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../hooks/AuthContextProvider";

const UserPopover = ({ user, logout, setUser }) => {
  const { newUser, setNewUser } = useContext(AuthContext);

  const [avatar, setAvatar] = useState(null);
  // console.log(avatar);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (newUser) {
      setAvatar(newUser?.id.slice(0, 2)); // Set avatar when user is available
    } else {
      setAvatar(""); // Reset avatar when user is not available
    }
  }, [newUser]); // This runs only when `user` changes

  const handleLogout = async () => {
    try {
      await logout();
      console.log("User logged out");
      setIsOpen(false); // Close popover after logout
      navigate("/login"); // Navigate after closing
      setAvatar(null);
      setUser(null);
      setNewUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(newUser);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Avatar>
          <AvatarImage src={user?.id} />
          <AvatarFallback className="bg-mainBlue font-bold text-black">
            {avatar}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={6}
        alignOffset={0}
        className=" z-[1000] bg-[#26262ada]  backdrop-blur-2xl pt-3 text-white rounded-lg backdrop-contrast-125 backdrop-saturate-200 border-[#262626]"
      >
        <div className="flex flex-col items-center ">
          <p className="text-lg ">{user?.email}</p>
          <Separator className="my-4" />
          <ModeToggle />
          {newUser?.role === "admin" ? (
            <Link
              to="/admin/dashboard"
              fullWidth
              variant="light"
              className=" bg-mainBlue hover:bg-blue-600 text-black hover:text-white rounded-xl py-2 px-4 w-full text-center  font-medium mt-3"
            >
              Admin Panel
            </Link>
          ) : newUser?.role === "examinee" ? (
            <Link
              to="/examinee/dashboard"
              fullWidth
              variant="light"
              className=" bg-mainBlue rounded-xl py-2 px-4 w-full text-center text-black font-medium mt-3"
              onClick={() => navigate("/examinee")}
            >
              Dashboard
            </Link>
          ) : newUser?.role === "candidate" ? (
            <Link
              to="/candidate/dashboard"
              fullWidth
              variant="light"
              className=" bg-mainBlue rounded-xl py-2 px-4 w-full text-center text-black font-medium mt-3"
              onClick={() => navigate("/candidate")}
            >
              Dashboard
            </Link>
          ) : null}
          <Button
            fullWidth
            variant="light"
            className=" bg-red-500 rounded-xl py-1 px-4 text-white mt-3"
            onPress={() => handleLogout()}
          >
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default UserPopover;
