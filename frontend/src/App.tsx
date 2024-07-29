import { Route, Routes } from "react-router-dom";
import HomePage from "./myComponents/HomePageComponents.tsx/HomePage";
import LoginPage from "./myComponents/LoginPage/LoginPage";
import RoomPage from "./myComponents/room/RoomPage";
import Pricing from "./myComponents/HomePageComponents.tsx/Pricing";
import Changelog from "./myComponents/HomePageComponents.tsx/Changelog";
import Docs from "./myComponents/HomePageComponents.tsx/Docs";
import NotLoggedIn from "./myComponents/NotLoggedIn/NotLoggedIn";

const App = () => {
  return (
    <div className="bg-white text-black dark:bg-gray-800 dark:text-white h-full">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/not-logged-in/:roomId" element={<NotLoggedIn />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </div>
  );
};

export default App;