import { useEffect, useRef, useState } from "react";
import EditorPage from "./EditorPage";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Notification from "./Notification";
import toast from "react-hot-toast";
import socketService from "../../services/SocketService";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

export default function RoomPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, isAuthorr } = location.state;
  const roomId = location.pathname.split("/")[2];
  const currentUsername = useRef<string>(username);

  const [participants, setParticipants] = useState<string[]>([]);
  const [joinRequests, setJoinRequests] = useState<string[]>([]);
  const [isPending, setIsPending] = useState<boolean>(!isAuthorr);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    socketService.connect(username, isAuthorr, roomId);

    socketService.on("currentParticipants", (participants: string[]) => {
      setParticipants(participants);
    });

    socketService.on("joinRequest", ({ username }) => {
      if (isAuthorr) {
        setJoinRequests((prev) => [...prev, username]);
      }
    });

    socketService.on("joinRequestApproved", (approvedRoomId) => {
      if (approvedRoomId === roomId && !isAuthorr) {
        setIsPending(false);
        toast.success("Your join request has been approved.");
      }
    });

    socketService.on("joinRequestRejected", (rejectedRoomId) => {
      if (rejectedRoomId === roomId && !isAuthorr) {
        setIsPending(false);
        toast.error("Your join request has been rejected.");
        navigate("/");
      }
    });

    socketService.on("userJoined", ({ username }) => {
      setParticipants((prev) => [...prev, username]);
      if (username !== currentUsername.current) {
        toast.success(`${username} has joined the room.`);
      }
    });

    socketService.on("userLeft", ({ username }) => {
      setParticipants((prev) => prev.filter((p) => p !== username));
      if (username === currentUsername.current) {
        toast.error("You left the room.");
        navigate("/");
      }
    });

    socketService.on("roomClosed", () => {
      toast.error("The room has been closed.");
      navigate("/");
    });

    socketService.on("youWereRemoved", () => {
      toast.error("You have been removed from the room.");
      navigate("/");
    });

    socketService.on("userRemoved", ({ username }) => {
      setParticipants((prev) => prev.filter((p) => p !== username));
      toast.error(`${username} has been removed from the room.`);
    });

    socketService.on("userLeftWillingly", ({ username }) => {
      setParticipants((prev) => prev.filter((p) => p !== username));
      if (username === currentUsername.current) {
        navigate("/");
        return;
      }
      toast.error(`${username} has left the room.`);
    });

    socketService.on("newMessage", ({ sender, message, timestamp }) => {
      setMessages((prev) => [
        ...prev,
        { sender, content: message, timestamp: new Date(timestamp) },
      ]);
    });

    socketService.on("disconnect", () => {
      toast.error("Disconnected from server");
      if (isAuthorr) {
        socketService.emit("closeRoom", { roomId });
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, [roomId, username, navigate, isAuthorr]);

  useEffect(() => {
    currentUsername.current = username;
  }, [username]);

  useEffect(() => {
    if (isAuthorr && joinRequests.length > 0) {
      console.log("Join requests received:", joinRequests);
      setNotifications((prevNotifications) => {
        const newNotifications = joinRequests.filter(
          (request) => !prevNotifications.includes(request)
        );
        console.log("New notifications:", newNotifications);
        return [...prevNotifications, ...newNotifications];
      });
    }
  }, [isAuthorr, joinRequests]);

  const handleApprove = (username: string) => {
    if (isAuthorr) {
      socketService.emit("approveJoinRequest", { roomId, username });
      setJoinRequests((prev) => prev.filter((user) => user !== username));
    }
  };

  const handleReject = (username: string) => {
    if (isAuthorr) {
      socketService.emit("rejectJoinRequest", { roomId, username });
      setJoinRequests((prev) => prev.filter((user) => user !== username));
    }
  };

  const handleRemove = (username: string) => {
    if (isAuthorr) {
      socketService.emit("removeParticipant", { roomId, username });
    }
  };

  const leaveRoom = () => {
    socketService.emit("leaveRoom", { roomId, username });
  };

  const sendMessage = (message: string) => {
    socketService.emit("sendMessage", { roomId, message, sender: username });
  };

  const handleInvite = () => {
    // Handle invite functionality
  };

  const handleNotificationApprove = (approvedUser: string) => {
    console.log("Approving user:", approvedUser);
    handleApprove(approvedUser);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification !== approvedUser)
    );
  };

  const handleNotificationReject = (rejectedUser: string) => {
    console.log("Rejecting user:", rejectedUser);
    handleReject(rejectedUser);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification !== rejectedUser)
    );
  };

  const handleNotificationClose = (closedUser: string) => {
    console.log("Closing notification for user:", closedUser);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification !== closedUser)
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
            messages={messages}
            sendMessage={sendMessage}
            currentUser={username}
          />
        </div>
      </main>
      <Footer leaveRoom={leaveRoom} roomId={roomId} username={username} />
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="fixed left-1/2 transform -translate-x-1/2 z-50 max-w-xs w-full"
          style={{ top: `${5 + index * 80}px` }}
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
