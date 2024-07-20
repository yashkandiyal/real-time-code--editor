import { useEffect, useRef, useState } from "react";
import EditorPage from "./EditorPage";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

export default function Component() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, isAuthorr } = location.state;
  const roomId = location.pathname.split("/")[2];
  const socketRef = useRef<Socket | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [joinRequests, setJoinRequests] = useState<string[]>([]);
  const [isAuthor, setIsAuthor] = useState<boolean>(isAuthorr);
  const [isPending, setIsPending] = useState<boolean>(!isAuthorr);
  const currentUsername = useRef<string>(username);
  useEffect(() => {
    const initSocket = async () => {
      const options = {
        forceNew: true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ["websocket"],
        query: { username, isAuthor: isAuthorr },
      };

      const socket = io("http://localhost:3000", options);
      socketRef.current = socket;

      socket.emit("joinRoom", { roomId, username, isAuthor: isAuthorr });

      socket.on("currentParticipants", (participants: string[]) => {
        setParticipants(participants);
      });

      socket.on("joinRequest", ({ username }) => {
        if (isAuthor) {
          setJoinRequests((prev) => [...prev, username]);
        }
      });

      socket.on("joinRequestPending", () => {
        if (!isAuthor) {
          setIsPending(true);
          toast.success(
            "Your join request is pending approval from the author."
          );
        }
      });

      socket.on("joinRequestApproved", (approvedRoomId) => {
        if (approvedRoomId === roomId && !isAuthor) {
          setIsPending(false);
          toast.success("Your join request has been approved.");
        }
      });

      socket.on("joinRequestRejected", (rejectedRoomId) => {
        if (rejectedRoomId === roomId && !isAuthor) {
          setIsPending(false);
          toast.error("Your join request has been rejected.");
          navigate("/");
        }
      });

      socket.on("userJoined", ({ username }) => {
        setParticipants((prev) => [...prev, username]);
        toast.success(`${username} has joined the room.`);
      });

      socket.on("userLeft", ({ username }) => {
        setParticipants((prev) => prev.filter((p) => p !== username));
        toast.error(`${username} has left the room.`);
      });

      socket.on("roomClosed", () => {
        toast.error("The room has been closed.");
        navigate("/");
      });

      socket.on("connect_error", () => {
        toast.error("Connection failed, retrying...");
      });
      socket.on("youWereRemoved", ({ roomId }) => {
        toast.error("You have been removed from the room.");
        navigate("/");
      });

      socket.on("userRemoved", ({ username }) => {
        setParticipants((prev) => prev.filter((p) => p !== username));
        toast.error(`${username} has been removed from the room.`);
      });
      socket.on("userLeftWillingly", ({ username }) => {
        setParticipants((prev) => prev.filter((p) => p !== username));
        if (username === currentUsername.current) {
          toast.error("You left the room.");
        } else {
          toast.error(`${username} left the room.`);
        }
      });

      socket.on("disconnect", () => {
        toast.error("Disconnected from server");
        if (isAuthor) {
          socket.emit("closeRoom", { roomId });
        }
      });

      return () => {
        if (isAuthor) {
          socket.emit("closeRoom", { roomId });
        }
        socket.disconnect();
      };
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        if (isAuthor) {
          socketRef.current.emit("closeRoom", { roomId });
        }
        socketRef.current.disconnect();
      }
    };
  }, [roomId, username, navigate, isAuthorr]);
  useEffect(() => {
    currentUsername.current = username;
  }, [username]);
  const handleApprove = (username: string) => {
    if (socketRef.current && isAuthor) {
      socketRef.current.emit("approveJoinRequest", { roomId, username });
      setJoinRequests((prev) => prev.filter((user) => user !== username));
    }
  };

  const handleReject = (username: string) => {
    if (socketRef.current && isAuthor) {
      socketRef.current.emit("rejectJoinRequest", { roomId, username });
      setJoinRequests((prev) => prev.filter((user) => user !== username));
    }
  };

  const handleRemove = (username: string) => {
    if (socketRef.current && isAuthor) {
      socketRef.current.emit("removeParticipant", { roomId, username });
    }
  };
  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("leaveRoom", { roomId, username });
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
    <div className="flex h-screen w-full flex-col">
      <Toaster position="top-center" reverseOrder={false} />
      <main className="flex flex-1 overflow-hidden">
        <EditorPage />
        <Sidebar
          participants={participants}
          isAuthor={isAuthor}
          joinRequests={joinRequests}
          handleApprove={handleApprove}
          handleReject={handleReject}
          handleRemove={handleRemove}
        />
      </main>
      <Footer leaveRoom={leaveRoom} />
    </div>
  );
}
