import { Link } from "react-router-dom";
import quizImage from "/src/assets/banner-image/2bg.png"; // Replace with your actual image path
import { FaArrowRightLong } from "react-icons/fa6";
import { useContext } from "react";
import { AuthContext } from "../../hooks/AuthContextProvider";

const Header = () => {
  const { newUser } = useContext(AuthContext);

  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0 bg-[url('/src/assets/bg/bg1.jpg')] bg-cover bg-center bg-fixed opacity-25"></div>

      {/* Content */}
      <div className="relative z-10 lg:flex lg:gap-36 items-center justify-center h-full text-white px-6">
        {/* Left Section */}
        <div className="flex flex-col gap-10 max-w-2xl w-full bg-opacity-50 p-8 rounded-lg shadow-lg">
          <h1 className="text-5xl font-extrabold leading-tight font-poppins">
            Test Your Knowledge with{" "}
            <span className="text-mainBlue font-inter">Quizify</span>
          </h1>
          <p className="text-xl font-medium text-gray-200 font-inter">
            Challenge yourself with engaging quizzes and expand your knowledge
            in a fun and interactive way. Compete with friends and track your
            progress!
          </p>
          <Link
            to={`${!newUser ? "/login" : `/${newUser?.role}/dashboard`}`}
            className="bg-[#1CCDF6]/80 text-black px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-yellow-500 transition flex gap-4 items-center justify-center"
          >
            <h1>Let&apos;s Get Start</h1>
            <button>
              <FaArrowRightLong />
            </button>
          </Link>
        </div>

        {/* Right Section - Image */}
        <div className="flex justify-center items-center">
          <img
            src={quizImage}
            alt="Quizify"
            className="w-[550px] h-auto drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
