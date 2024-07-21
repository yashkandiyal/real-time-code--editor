import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import socketService from "../services/SocketService";

interface SocketOptions {
  username: string;
  isAuthor: boolean;
  roomId: string;
  navigate: (path: string) => void;
}

export default function useSocket({
  username,
  isAuthor,
  roomId,
  navigate,
}: SocketOptions) {
  const [participants, setParticipants] = useState<string[]>([]);
  const [joinRequests, setJoinRequests] = useState<string[]>([]);
  const [isPending, setIsPending] = useState<boolean>(!isAuthor);
  const currentUsername = useRef<string>(username);

  useEffect(() => {
    socketService.connect(username, isAuthor, roomId);

    socketService.on("currentParticipants", (participants: string[]) => {
      setParticipants(participants);
    });

    socketService.on("joinRequest", ({ username }) => {
      if (isAuthor) {
        setJoinRequests((prev) => [...prev, username]);
      }
    });

    socketService.on("joinRequestApproved", (approvedRoomId) => {
      if (approvedRoomId === roomId && !isAuthor) {
        setIsPending(false);
        toast.success("Your join request has been approved.");
      }
    });

    socketService.on("joinRequestRejected", (rejectedRoomId) => {
      if (rejectedRoomId === roomId && !isAuthor) {
        setIsPending(false);
        toast.error("Your join request has been rejected.");
        navigate("/");
      }
    });

    socketService.on("userJoined", ({ username }) => {
      setParticipants((prev) => [...prev, username]);
      if (username !== currentUsername.current) {
        toast.success(`${username} has joined the room.`);
        return;
      }
    });

    socketService.on("userLeft", ({ username }) => {
      setParticipants((prev) => prev.filter((p) => p !== username));
      if (username === currentUsername.current) {
        toast.error("You left the room.");
        navigate("/");
      } else {
        toast.error(`${username} has left the room.`);
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

    socketService.on("disconnect", () => {
      toast.error("Disconnected from server");
      if (isAuthor) {
        socketService.emit("closeRoom", { roomId });
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, [roomId, username, navigate, isAuthor]);

  useEffect(() => {
    currentUsername.current = username;
  }, [username]);

  const handleApprove = (username: string) => {
    if (isAuthor) {
      socketService.emit("approveJoinRequest", { roomId, username });
      setJoinRequests((prev) => prev.filter((user) => user !== username));
    }
  };

  const handleReject = (username: string) => {
    if (isAuthor) {
      socketService.emit("rejectJoinRequest", { roomId, username });
      setJoinRequests((prev) => prev.filter((user) => user !== username));
    }
  };

  const handleRemove = (username: string) => {
    if (isAuthor) {
      socketService.emit("removeParticipant", { roomId, username });
    }
  };

  const leaveRoom = () => {
    socketService.emit("leaveRoom", { roomId, username });
  };

  const doesRoomExist = () => {
    return new Promise<boolean>((resolve) => {
      socketService.emit("doesRoomExist", { roomId });
      socketService.on("roomExists", ({ status }) => {
        if (status === "NOT_EXISTS") {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  };

  return {
    participants,
    joinRequests,
    isPending,
    handleApprove,
    handleReject,
    handleRemove,
    leaveRoom,
  };
}
