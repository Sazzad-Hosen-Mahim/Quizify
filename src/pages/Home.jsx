import CommonWrapper from "../components/CommonWrapper";
import Header from "../components/Header/Header";
import Service from "../components/Service/Service";

const Home = () => {
  return (
    <div className="">
      <Header />
      <CommonWrapper>
        <Service />
      </CommonWrapper>
    </div>
  );
};

export default Home;
