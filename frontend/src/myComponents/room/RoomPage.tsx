import { useEffect, useRef, useState } from "react";
import EditorPage from "./EditorPage/MainEditorPage";
import Footer from "../Footer/Footer";
import Sidebar from "../room/Sidebar/Sidebar";
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

interface JoinRequest {
  username: string;
  email: string;
}

interface Participant {
  username: string;
  email: string;
}

export default function RoomPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, authorStatus, userEmailAddress } = location.state || {};

  const roomId = location.pathname.split("/")[2];
  const currentUsername = useRef<string>(username);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [isPending, setIsPending] = useState<boolean>(!authorStatus);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<JoinRequest[]>([]);
  const [sidebarType, setSidebarType] = useState<
    "participants" | "messages" | "none"
  >("none");

  const toggleSidebar = (type: "participants" | "messages" | "none") => {
    setSidebarType((prev) => (prev === type ? "none" : type));
  };

  useEffect(() => {
    if (!username || authorStatus == null) {
      navigate(`/not-logged-in/${roomId}`);
    }
  }, [username, authorStatus, navigate, roomId]);

  useEffect(() => {
    socketService.connect(username, authorStatus);
    socketService.joinRoom(roomId, username, authorStatus, userEmailAddress);

    socketService.once("currentParticipants", (participants: Participant[]) => {
      setParticipants(participants);
    });

    socketService.on("joinRequest", (joinRequest: JoinRequest) => {
      if (authorStatus) {
        setJoinRequests((prev) => [...prev, joinRequest]);
      }
    });

    socketService.once("joinRequestApproved", (approvedRoomId: string) => {
      if (approvedRoomId === roomId && !authorStatus) {
        setIsPending(false);
        toast.success("Your join request has been approved.");
      }
    });

    socketService.once("joinRequestRejected", (rejectedRoomId: string) => {
      if (rejectedRoomId === roomId && !authorStatus) {
        setIsPending(false);
        toast.error("Your join request has been rejected.");
        navigate("/");
      }
    });

    socketService.on("userJoined", (participant: Participant) => {
      setParticipants((prev) => {
        const participantExists = prev.some(
          (p) =>
            p.username === participant.username && p.email === participant.email
        );
        if (!participantExists) {
          return [...prev, participant];
        }
        return prev;
      });
      if (participant.username !== currentUsername.current) {
        toast.success(`${participant.username} has joined the room.`);
      }
    });

    socketService.on("userLeft", (participant: Participant) => {
      setParticipants((prev) =>
        prev.filter((p) => p.username !== participant.username)
      );
      toast.error(`${participant.username} has left the room.`);
      if (participant.username === currentUsername.current && !authorStatus) {
        navigate("/");
      }
    });

    socketService.once("roomClosed", () => {
      toast.error("The room has been closed.");
      navigate("/");
    });

    socketService.once("youWereRemoved", () => {
      toast.error("You have been removed from the room.");
      navigate("/");
    });

    socketService.on("userRemoved", (participant: Participant) => {
      setParticipants((prev) =>
        prev.filter((p) => p.username !== participant.username)
      );
      toast.error(`${participant.username} has been removed from the room.`);
    });

    socketService.on("newMessage", ({ sender, message, timestamp }) => {
      setMessages((prev) => [
        ...prev,
        { sender, content: message, timestamp: new Date(timestamp) },
      ]);
    });

    socketService.once("disconnect", () => {
      toast.error("Disconnected from server");
      navigate("/");
    });

    return () => {
      socketService.disconnect();
    };
  }, [roomId, username, navigate, authorStatus]);

  useEffect(() => {
    currentUsername.current = username;
  }, [username]);

  useEffect(() => {
    if (authorStatus && joinRequests.length > 0) {
      setNotifications((prevNotifications) => {
        const newNotifications = joinRequests.filter(
          (request) =>
            !prevNotifications.some(
              (n) =>
                n.username === request.username && n.email === request.email
            )
        );

        return [...prevNotifications, ...newNotifications];
      });
    }
  }, [authorStatus, joinRequests]);

  const handleApprove = (notification: JoinRequest) => {
    if (authorStatus) {
      socketService.emit("approveJoinRequest", { roomId, ...notification });
      setJoinRequests((prev) =>
        prev.filter(
          (user) =>
            user.username !== notification.username ||
            (user.email !== notification.email &&
              notification.email !== undefined)
        )
      );
    }
  };

  const handleReject = (notification: JoinRequest) => {
    if (authorStatus) {
      socketService.emit("rejectJoinRequest", { roomId, ...notification });
      setJoinRequests((prev) =>
        prev.filter(
          (user) =>
            user.username !== notification.username ||
            (user.email !== notification.email &&
              notification.email !== undefined)
        )
      );
    }
  };

  const handleRemove = (username: string) => {
    if (authorStatus) {
      socketService.emit("removeParticipant", { roomId, username });
    }
  };

  const leaveRoom = () => {
    socketService.emit("leaveRoom", { roomId, username });
    if (authorStatus) {
      navigate("/");
    }
  };

  const sendMessage = (message: string) => {
    socketService.emit("sendMessage", {
      roomId,
      message,
      sender: username,
      timestamp: new Date(),
    });
  };

  const handleInvite = () => {
    // Handle invite functionality
  };

  const handleNotificationApprove = (approvedUser: JoinRequest) => {
    handleApprove(approvedUser);

    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter(
        (notification) =>
          notification.username !== approvedUser.username ||
          (notification.email !== approvedUser.email &&
            approvedUser.email !== undefined)
      );

      return updatedNotifications;
    });
  };

  const handleNotificationReject = (rejectedUser: JoinRequest) => {
    handleReject(rejectedUser);

    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter(
        (notification) =>
          notification.username !== rejectedUser.username ||
          (notification.email !== rejectedUser.email &&
            rejectedUser.email !== undefined)
      );

      return updatedNotifications;
    });
  };

  const handleNotificationClose = (closedUser: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.username !== closedUser
      )
    );
  };

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Waiting for approval to join the room ⏳
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <main className="flex flex-1 overflow-scroll">
        <div className="flex flex-1">
          <EditorPage
            className="flex-1 w-full"
            onFullscreenToggle={() => {}}
            roomId={roomId}
            username={username}
            isAuthor={authorStatus}
          />
          <Sidebar
            participants={participants}
            isAuthor={authorStatus}
            handleRemove={handleRemove}
            handleInvite={handleInvite}
            messages={messages}
            sendMessage={sendMessage}
            currentUser={username}
            sidebarType={sidebarType}
            toggleSidebar={toggleSidebar}
          />
        </div>
      </main>
      <Footer
        leaveRoom={leaveRoom}
        roomId={roomId}
        username={username}
        toggleSidebar={toggleSidebar}
        sidebarType={sidebarType}
      />
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="fixed left-1/2 transform -translate-x-1/2 z-50 max-w-xs w-full"
          style={{ top: `${5 + index * 80}px` }}
        >
          <Notification
            username={notification.username}
            email={notification.email}
            onApprove={() => handleNotificationApprove(notification)}
            onReject={() => handleNotificationReject(notification)}
            onClose={() => handleNotificationClose(notification.username)}
            show={true}
          />
        </div>
      ))}
    </div>
  );
}
