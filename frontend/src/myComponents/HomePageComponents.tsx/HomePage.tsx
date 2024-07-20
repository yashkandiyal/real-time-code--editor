import ExistingRoomPageModal from "./ExistingRoomPageModal";
import Navbar from "../Navbar/Navbar";
import NewRoomPageModal from "./NewRoomPageModal";
import { useUser } from "@clerk/clerk-react";
const AfterLoginPage = () => {
  const {user}=useUser()
  const isUserLoggedIn=user?true:false
  
  
  
  return (
    <>
      <Navbar />
      <div className="h-screen flex justify-center items-center dark:text-white dark:bg-gray-800 bg-white">
        <div className="flex gap-20 items-center">
          <NewRoomPageModal isUserLoggedIn={isUserLoggedIn} />
          <ExistingRoomPageModal isUserLoggedIn={isUserLoggedIn} />
        </div>
      </div>
    </>
  );
};

export default AfterLoginPage;
