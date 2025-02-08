import { motion } from "framer-motion";
import backgroundImage from "../../assets/banner-contact/about.jpg";

const About = () => {
  return (
    <motion.div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-white px-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-5xl font-bold mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        About <span className="text-yellow-400">Us</span>
      </motion.h1>
      <motion.p
        className="text-lg max-w-2xl text-center"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        We are a team of passionate developers and designers committed to
        building cutting-edge solutions. Our goal is to create seamless digital
        experiences with innovation and creativity at the core of our work.
      </motion.p>
      <motion.button
        className="mt-6 px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Learn More
      </motion.button>
    </motion.div>
  );
};

export default About;
