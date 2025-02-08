/* eslint-disable no-unused-vars */
import {
  Navbar,
  NavbarContent,
  Button,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
} from "@heroui/react";

import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../hooks/AuthContextProvider";
import { motion } from "framer-motion";
import UserPopover from "@/components/UserPopover";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { MdLogin } from "react-icons/md";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { logout } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = Cookies.get("user");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    } else {
      console.warn("No user data found in cookies");
      setUser(null);
    }

    setLoading(false);
  }, []);

  // console.log(user);

  return (
    <Navbar
      isBordered={false}
      isBlurred={false}
      maxWidth="2xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-black text-white dark:bg-transparent backdrop-blur-[1.5px] fixed top-0 border-b-[1px] border-gray-500 z-50"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-[#428ee6]",
          "data-[active=true]:text-danger",
          "data-[active=false]:hover:text-danger",
        ],
      }}
    >
      <NavbarContent className="md:hidden" justify="center">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent justify="start" className="flex gap-12">
        <motion.div
          className="flex justify-center "
          initial="hidden"
          animate="visible"
          variants={logoVariant}
        >
          <NavLink
            to="/"
            arial-label="home-page"
            className={` ml-4 flex shrink-0 grow-0 justify-center`}
          >
            <h1 className="text-2xl font-bold dark:text-white">Quizify</h1>
          </NavLink>
        </motion.div>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <div className="hidden md:flex gap-8">
          <motion.div
            initial="hidden"
            className="flex gap-12"
            animate="visible"
            variants={menuVariant}
          >
            <motion.div variants={childVariant}>
              <NavLink to="/">
                {({ isActive }) => (
                  <NavbarItem
                    className="text-black dark:text-white hover:text-danger font-bold link-underline"
                    isActive={isActive}
                  >
                    {" "}
                    Home{" "}
                  </NavbarItem>
                )}
              </NavLink>
            </motion.div>
            <motion.div variants={childVariant}>
              <NavLink to="/about">
                {({ isActive }) => (
                  <NavbarItem
                    className="text-black dark:text-white hover:text-danger font-bold link-underline"
                    isActive={isActive}
                  >
                    {" "}
                    About{" "}
                  </NavbarItem>
                )}
              </NavLink>
            </motion.div>

            <motion.div variants={childVariant}>
              <NavLink to="/contact" aria-current="page">
                {({ isActive }) => (
                  <NavbarItem
                    className="hover:text-danger font-bold dark:text-white link-underline"
                    isActive={isActive}
                  >
                    Contact
                  </NavbarItem>
                )}
              </NavLink>
            </motion.div>
          </motion.div>
        </div>
        {user && user.userStatus !== "banned" ? (
          <Button
            as={Link}
            to={
              user.role === "admin"
                ? "/admin/dashboard"
                : user.role === "examinee"
                ? "/examinee/dashboard"
                : user.role === "candidate"
                ? "/candidate/dashboard"
                : "/"
            }
            color="primary"
            size="lg"
            variant="bordered"
            className="hidden text-white md:flex border-none font-medium md:me-24"
          >
            {user && user.role === "admin" ? "Dashboard" : "Profile"}
          </Button>
        ) : (
          <Button
            onPress={() =>
              toast.error(
                "You are Banned, You Cant Access Dashboard Right Now!"
              )
            }
            color="primary"
            size="lg"
            variant="bordered"
            className="hidden text-white md:flex border-none font-medium"
          >
            {user && user.role === "admin" ? "Dashboard" : "Profile"}
          </Button>
        )}

        <div className=" hidden md:block">{/* <ModeToggle /> */}</div>
      </NavbarContent>
      <NavbarMenu>
        <NavLink to="/">
          {({ isActive }) => (
            <NavbarItem
              className="hover:text-danger h-fit mb-4 mt-3"
              isActive={isActive}
            >
              Home
            </NavbarItem>
          )}
        </NavLink>

        <NavLink to="/tests" aria-current="page">
          {({ isActive }) => (
            <NavbarItem
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-danger h-fit mb-4"
              isActive={isActive}
            >
              Tests
            </NavbarItem>
          )}
        </NavLink>

        <NavLink to="/contact" aria-current="page">
          {({ isActive }) => (
            <NavbarItem
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-danger h-fit mb-4"
              isActive={isActive}
            >
              Contact
            </NavbarItem>
          )}
        </NavLink>
      </NavbarMenu>

      <NavbarContent justify="end" className="flex gap-12">
        {user ? (
          <UserPopover user={user} logout={logout} />
        ) : (
          <div>
            <Button
              as={Link}
              to={"/login"}
              size="md"
              className="text-white text-md font-bold bg-mainBlue px-16 rounded-sm"
            >
              <MdLogin />
              Login
            </Button>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  );
}

const logoVariant = {
  hidden: {
    y: -100,
  },
  visible: {
    y: 0,
    transition: {
      duration: 1,
      type: "spring",
      stiffness: 80,
    },
  },
};
const menuVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const childVariant = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,

    transition: {
      duration: 1,
    },
  },
};
