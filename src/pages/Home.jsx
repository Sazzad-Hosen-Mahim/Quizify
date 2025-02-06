import quizImage from "/src/assets/banner-image/2bg.png"; // Replace with your actual image path
import { FaArrowRightLong } from "react-icons/fa6";

const Home = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/src/assets/bg/bg1.jpg')] bg-cover bg-center bg-fixed opacity-25"></div>

      {/* Content */}
      <div className="relative z-10 lg:flex lg:gap-36 items-center justify-center h-full text-white px-6">
        {/* Left Section */}
        <div className="flex flex-col gap-10 max-w-2xl w-full bg-opacity-50 p-8 rounded-lg shadow-lg">
          <h1 className="text-5xl font-extrabold leading-tight">
            Test Your Knowledge with <span className="text-mainBlue">Quizify</span>
          </h1>
          <p className="text-xl text-gray-200">
            Challenge yourself with engaging quizzes and expand your knowledge
            in a fun and interactive way. Compete with friends and track your
            progress!
          </p>
          <button className="bg-[#1CCDF6] text-black px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-yellow-500 transition flex gap-4 items-center justify-center">
            <h1>Let&apos;s Get Start</h1>
           <button>
           <FaArrowRightLong />
           </button>
          </button>
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

export default Home;
