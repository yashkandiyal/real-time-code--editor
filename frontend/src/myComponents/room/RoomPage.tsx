import { useEffect, useRef, useState } from "react";
import EditorPage from "./EditorPage";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import useSocket from "../../hooks/SocketHook";
import Navbar from "../Navbar/Navbar";
import Notification from "./Notification";

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
    handleRemove,
    leaveRoom,
    handleApprove,
    handleReject,
  } = useSocket({ username, isAuthor: isAuthorr, roomId, navigate });

  const [notification, setNotification] = useState<string | null>(null);

  const handleInvite = () => {
    // Handle invite functionality
  };

  useEffect(() => {
    currentUsername.current = username;
  }, [username]);

  useEffect(() => {
    if (isAuthorr && joinRequests.length > 0) {
      setNotification(joinRequests[joinRequests.length - 1]);
    }
  }, [isAuthorr, joinRequests]);

  const handleNotificationApprove = () => {
    if (notification) {
      handleApprove(notification);
      setNotification(null);
    }
  };

  const handleNotificationReject = () => {
    if (notification) {
      handleReject(notification);
      setNotification(null);
    }
  };

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Waiting for approval to join the room...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex-1">
          <EditorPage className="flex-1 w-full" onFullscreenToggle={() => {}} />
          <Sidebar
            participants={participants}
            isAuthor={isAuthorr}
            handleRemove={handleRemove}
            handleInvite={handleInvite}
          />
        </div>
      </main>
      <Footer leaveRoom={leaveRoom} roomId={roomId} username={username} />
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 max-w-xs w-full">
          <Notification
            username={notification}
            onApprove={handleNotificationApprove}
            onReject={handleNotificationReject}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
}
