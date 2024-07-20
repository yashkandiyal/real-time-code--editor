import { Route, Routes } from "react-router-dom";
import HomePage from "./myComponents/HomePageComponents.tsx/HomePage";
import LoginPage from "./myComponents/LoginPage/LoginPage";
import RoomPage from "./myComponents/room/RoomPage";

const App = () => {
  return (
    <div className="bg-white text-black dark:bg-gray-800 dark:text-white h-full">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
};

export default App;
