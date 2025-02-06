const Contact = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-900 p-6">
      {/* Left Side - Image */}
      <div className="md:w-3/5 flex justify-center">
        <img 
          src="/src/assets/banner-contact/5.png" 
          alt="Contact" 
          className="w-full max-w-lg rounded-lg shadow-lg"
        />
      </div>

      {/* Right Side - Contact Form */}
      <div className="md:w-2/5 bg-transparent p-8 rounded-lg shadow-lg mt-6 md:mt-0 md:ml-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">For Any <span className="text-yellow-500">Queries</span></h2>

        <form className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 bg-transparent text-white border-b-2 border-gray-500 outline-none transition-all duration-300 focus:border-yellow-500 focus:scale-105"
            />
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-transparent text-white border-b-2 border-gray-500 outline-none transition-all duration-300 focus:border-yellow-500 focus:scale-105"
            />
          </div>

          <div className="relative">
            <textarea
              rows={4}
              placeholder="Enter your message"
              className="w-full p-3 bg-transparent text-white border-b-2 border-gray-500 outline-none transition-all duration-300 focus:border-yellow-500 focus:scale-105"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1CCDF6] text-gray-900 font-semibold p-3 rounded-full hover:bg-yellow-400 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
