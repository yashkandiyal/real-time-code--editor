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

  const [notifications, setNotifications] = useState<string[]>([]);

  const handleInvite = () => {
    // Handle invite functionality
  };

  useEffect(() => {
    currentUsername.current = username;
  }, [username]);

  useEffect(() => {
    if (isAuthorr && joinRequests.length > 0) {
      console.log("Join requests received:", joinRequests);
      setNotifications(prevNotifications => {
        const newNotifications = joinRequests.filter(
          request => !prevNotifications.includes(request)
        );
        console.log("New notifications:", newNotifications);
        return [...prevNotifications, ...newNotifications];
      });
    }
  }, [isAuthorr, joinRequests]);

  const handleNotificationApprove = (approvedUser: string) => {
    console.log("Approving user:", approvedUser);
    handleApprove(approvedUser);
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification !== approvedUser)
    );
  };

  const handleNotificationReject = (rejectedUser: string) => {
    console.log("Rejecting user:", rejectedUser);
    handleReject(rejectedUser);
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification !== rejectedUser)
    );
  };

  const handleNotificationClose = (closedUser: string) => {
    console.log("Closing notification for user:", closedUser);
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification !== closedUser)
    );
  };

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Waiting for approval to join the room...
      </div>
    );
  }

  console.log("Current notifications:", notifications);

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
      {notifications.map((notification, index) => (
        <div 
          key={index} 
          className="fixed left-1/2 transform -translate-x-1/2 z-50 max-w-xs w-full" 
          style={{top: `${5 + index * 80}px`}}
        >
          <Notification
            username={notification}
            onApprove={() => handleNotificationApprove(notification)}
            onReject={() => handleNotificationReject(notification)}
            onClose={() => handleNotificationClose(notification)}
            show={true}
          />
        </div>
      ))}
    </div>
  );
}