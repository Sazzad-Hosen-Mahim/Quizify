import { useToken } from "../hooks/TokenContext";
import Sidebar from "../components/Examiner/Sidebar";

const Examinee = () => {
  const { user } = useToken();
  console.log(user);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="w-3/4 p-6">
        <h1>Welcome to Examinee Home</h1>
      </div>
    </div>
  );
};

export default Examinee;
