import { useEffect, useRef } from "react";
import EditorPage from "./EditorPage";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";

export default function Component() {
  const location = useLocation();
  const { username } = location.state;
  const roomId = location.pathname.split("/")[2];
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const initSocket = async () => {
      const options = {
        forceNew: true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ["websocket"],
      };

      const socket = io("http://localhost:3000", options);
      socketRef.current = socket;

      // Emit joinRoom event
      socket.emit("joinRoom", { roomId, username });

      // Set up event listeners
      socket.on("userJoined", ({ username }) => {
        console.log("User joined", username);
        toast.success(`${username} has joined the room.`);
      });

      socket.on("userLeft", ({ username }) => {
        console.log("User left", username);
        toast.error(`${username} has left the room.`);
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        toast.error("Connection failed, retrying...");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
        toast.error("Disconnected from server");
      });

      // Cleanup function
      return () => {
        if (socketRef.current) {
          socketRef.current.off("userJoined"); // Remove specific listener
          socketRef.current.off("userLeft"); // Remove specific listener
          socketRef.current.disconnect();
        }
      };
    };

    // Initialize socket and set up listeners
    initSocket();

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("userJoined"); // Remove specific listener
        socketRef.current.off("userLeft"); // Remove specific listener
        socketRef.current.disconnect();
      }
    };
  }, [roomId, username]);

  return (
    <div className="flex h-screen w-full flex-col">
      <Toaster position="top-center" reverseOrder={false} />
      <main className="flex flex-1 overflow-hidden">
        {/* Code editor */}
        <EditorPage />
        {/* Sidebar */}
        <Sidebar />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
