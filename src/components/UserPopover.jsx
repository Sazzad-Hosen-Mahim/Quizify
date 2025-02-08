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
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const UserPopover = ({ user, logout }) => {
  const [avatar, setAvatar] = useState(null);
  // console.log(avatar);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setAvatar(user?.id.slice(0, 2)); // Set avatar when user is available
    } else {
      setAvatar(""); // Reset avatar when user is not available
    }
  }, [user]); // This runs only when `user` changes

  const handleLogout = async () => {
    try {
      await logout();
      console.log("User logged out");
      setIsOpen(false); // Close popover after logout
      navigate("/login"); // Navigate after closing
      setAvatar(null);
    } catch (err) {
      console.error(err);
    }
  };

  // console.log(user);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Avatar>
          <AvatarImage src={user?.id} />
          <AvatarFallback>{avatar}</AvatarFallback>
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
          <Button
            fullWidth
            variant="light"
            className=" bg-[#27272A] rounded-xl py-1 px-4 text-white mt-3"
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default UserPopover;
