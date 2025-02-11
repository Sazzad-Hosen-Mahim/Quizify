const Service = () => {
  const quizzes = [
    {
      title: "General Knowledge",
      desc: "Test your overall knowledge.",
      icon: "📚",
      className: "col-span-2 row-span-2 bg-mainBlue/20",
    },
    {
      title: "Science & Tech",
      desc: "Explore the wonders of science.",
      icon: "🔬",
      className: "col-span-1 row-span-2 bg-mainBlue/20",
    },
    {
      title: "History",
      desc: "How well do you know the past?",
      icon: "🏛️",
      className: "col-span-1 row-span-1 bg-mainBlue/20",
    },
    {
      title: "Math & Logic",
      desc: "Challenge your problem-solving skills.",
      icon: "🧮",
      className: "col-span-2 row-span-1 bg-mainBlue/20",
    },
    {
      title: "Entertainment",
      desc: "Movies, music, and fun facts!",
      icon: "🎬",
      className: "col-span-1 row-span-1 bg-mainBlue/20",
    },
    {
      title: "Sports",
      desc: "Are you a true sports fan?",
      icon: "🏆",
      className: "col-span-1 row-span-2 bg-mainBlue/20",
    },
    {
      title: "Geography",
      desc: "Test your world knowledge.",
      icon: "🌍",
      className: "col-span-1 row-span-2 bg-mainBlue/20",
    },
    {
      title: "Literature",
      desc: "Classic books and authors.",
      icon: "📖",
      className: "col-span-1 row-span-1 bg-mainBlue/20",
    },
  ];

  return (
    <div className="py-20 px-6">
      <h2 className="text-4xl font-bold text-white text-center mb-10 font-poppins">
        Explore Our Quizzes
      </h2>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-3 grid-rows-3 gap-6 font-inter">
        {quizzes.map((quiz, index) => (
          <div
            key={index}
            className={`border border-white p-6 rounded-lg bg-transparent hover:bg-mainBlue/30  transition-all duration-300 shadow-lg flex flex-col justify-center items-center ${quiz.className}`}
          >
            <span className="text-5xl">{quiz.icon}</span>
            <h3 className="text-xl font-semibold text-white mt-3">
              {quiz.title}
            </h3>
            <p className="text-gray-400 mt-1 text-center">{quiz.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
