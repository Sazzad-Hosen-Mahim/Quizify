import About from "../components/About/About";
import CommonWrapper from "../components/CommonWrapper";
import Header from "../components/Header/Header";
import Service from "../components/Service/Service";
import Contact from "./Contact";

const Home = () => {
  return (
    <div className="">
      <Header />
      <CommonWrapper>
        <Service />
      </CommonWrapper>
      <About />
      <CommonWrapper>
        <h1 className="text-4xl font-bold text-center my-12">Contact Us</h1>
        <Contact />
      </CommonWrapper>
    </div>
  );
};

export default Home;
