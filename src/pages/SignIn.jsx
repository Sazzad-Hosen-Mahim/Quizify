/* eslint-disable no-unused-vars */
import { Button, Divider, Input } from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { EyeSlashFilledIcon } from "@/assets/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/assets/icons/EyeFilledIcon";

import usePostMutate from "@/hooks/shared/usePostMutate";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

import img1 from "../assets/client/1.jpg";
import img2 from "../assets/client/2.jpg";
import img3 from "../assets/client/3.jpg";
import img4 from "../assets/client/4.jpg";
import img5 from "../assets/client/5.jpg";
import { AuthContext } from "../hooks/AuthContextProvider";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const { logout, newUser, setNewUser } = useContext(AuthContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  // cookies part

  const userData = Cookies.get("user");
  let sortedData = null;
  if (userData) {
    try {
      sortedData = JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user cookie:", error);
    }
  }

  useEffect(() => {
    setUser(sortedData);
  }, []);

  const {
    control,
    handleSubmit,

    formState: { errors },
  } = useForm();
  const location = useLocation();

  const { path } = location.state || {};

  const [isVisible, setIsVisible] = useState(false);
  const onSuccess = (res) => {
    console.log(res, "res");

    toast.success("Successfully Logged In");
    setNewUser(res?.data);

    Cookies.set("user", JSON.stringify(res?.data), { expires: 30 });
    setUser(res?.data);
    setIsLoading(false);
    const role = res?.data?.role; // Get role directly from response
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "examinee") {
      navigate("/examinee/dashboard");
    } else if (role === "candidate") {
      navigate("/candidate/dashboard");
    } else {
      navigate("/"); // Default route if role is not found
    }
  };
  const onError = (err) => {
    console.log(err);
    //     console.log(err?.response?.data?.message);
    toast.error(err?.response?.data?.message || "Something went wrong");
    setIsLoading(false);
  };
  const { mutate } = usePostMutate("/auth/login", onSuccess, onError);

  const onSubmit = async (userData) => {
    setIsLoading(true);
    // setNewUser(userData);

    console.log(userData, "userData");
    mutate(userData);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="  relative  min-h-screen"
    >
      <Helmet>
        <title>Sign In | Quizzy</title>
        <link rel="canonical" href="https://jobify-bd6c2.web.app/" />
      </Helmet>

      <div className=" w-full min-h-screen  mx-auto md:grid grid-cols-3  h-full font-poppins items-center justify-center">
        <div className="banner-Container flex-1 hidden md:flex  col-span-2   justify-center items-center  h-full w-full dark:bg-darkish    bg-no-repeat  mx-auto  ">
          <div className="w-1/2 h-1/2 flex flex-col justify-center items-center bg-[#141E30] bg-gradient-to-r from-[#243B55] to-[#141E30] text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Quizify</h1>
            <p className="text-lg text-start mb-6 max-w-md">
              Explore exam management system. <br />
              Millions of students and teachers come here to manage their
              academic activity and test their quality.
            </p>
            <div className="flex -space-x-4 mb-4">
              <img
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
                src={img1}
                alt="avatar"
              />
              <img
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
                src={img2}
                alt="avatar"
              />
              <img
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
                src={img3}
                alt="avatar"
              />
              <img
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
                src={img4}
                alt="avatar"
              />
              <img
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
                src={img5}
                alt="avatar"
              />
            </div>
            <p className="text-sm font-medium">
              Over <span className="font-bold">15.7k</span> Happy Customers
            </p>
          </div>
        </div>
        <div className="flex-1 w-full  min-h-screen  flex justify-center items-center mx-auto">
          <Card className="bg-transparent border-none w-full p-4 md:p-10  ">
            <CardHeader className="flex flex-col gap-4">
              <p className="text-2xl font-medium font-libre">Sign in</p>
              <p className="text-md ">
                New user?{" "}
                <Link to={"/signup"} className="text-danger hover:underline">
                  Create a candidate account
                </Link>
              </p>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="text-center flex flex-col gap-5 mt-8 "
              >
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{ required: " Email is required" }}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        type="email"
                        isInvalid={errors.email ? true : false}
                        classNames={{
                          errorMessage: "text-left",
                        }}
                        errorMessage={errors.email && errors.email.message}
                        label="Email"
                        variant={"bordered"}
                      />
                    </div>
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        type={isVisible ? "text" : "password"}
                        variant={"bordered"}
                        isInvalid={errors.password ? true : false}
                        errorMessage={
                          errors.password && errors.password.message
                        }
                        classNames={{
                          errorMessage: "text-left",
                        }}
                        label="Password"
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                          >
                            {isVisible ? (
                              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                      />
                    </div>
                  )}
                />

                <div className="text-white  cursor-pointer underline text-tiny text-right ">
                  Forgot password?
                </div>
                <Button
                  disabled={isLoading}
                  isLoading={isLoading}
                  color="primary"
                  className="w-full  rounded-lg  font-bold   "
                  type="submit"
                >
                  Login
                </Button>
              </form>
            </CardContent>
            <CardFooter></CardFooter>
            <div className="max-w-sm w-full  rounded-lg  shadow-md"></div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SignIn;

const containerVariants = {
  hidden: {
    opacity: 0,
    x: "-100vh",
  },
  exit: {
    x: "100vh",
    transition: {
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,

      type: "spring",
    },
  },
};
