import ExistingRoomPageModal from "./ExistingRoomPageModal";
import Navbar from "../Navbar/Navbar";
import NewRoomPageModal from "./NewRoomPageModal";
const AfterLoginPage = () => {
  return (
    <>
      <Navbar />
      <div className="h-screen flex justify-center items-center dark:text-white dark:bg-gray-800 bg-white">
        <div className="flex gap-20 items-center">
          <NewRoomPageModal />
          <ExistingRoomPageModal />
        </div>
      </div>
    </>
  );
};

export default AfterLoginPage;
