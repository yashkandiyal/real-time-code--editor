import { useEffect, useRef } from "react";
import EditorPage from "./EditorPage";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import useSocket from "../../hooks/SocketHook";
import Navbar from "../Navbar/Navbar";

export default function RoomPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, isAuthorr } = location.state;
  const roomId = location.pathname.split("/")[2];
  const currentUsername = useRef<string>(username);

  const {
    participants,
    joinRequests,
    isPending,
    handleApprove,
    handleReject,
    handleRemove,
    leaveRoom,
  } = useSocket({ username, isAuthor: isAuthorr, roomId, navigate });

  const handleInvite = () => {
  };

  useEffect(() => {
    currentUsername.current = username;
  }, [username]);

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Waiting for approval to join the room...
      </div>
    );
  }

  return (
    
    <div className="flex h-screen w-full flex-col">
    <Navbar/>
      <Toaster position="top-center" reverseOrder={false} />
      <main className="flex flex-1 overflow-hidden">
        <EditorPage onFullscreenToggle={() => { /* Handle fullscreen toggle */ }} />
        <Sidebar
          participants={participants}
          isAuthor={isAuthorr}
          joinRequests={joinRequests}
          handleApprove={handleApprove}
          handleReject={handleReject}
          handleRemove={handleRemove}
          handleInvite={handleInvite} 
        />
      </main>
      <Footer leaveRoom={leaveRoom} />
    </div>
  );
}
