import { Server,ServerOptions } from "socket.io";
import { DEV_FRONTEND_URL } from "./config/env";
let io: Server;

const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: DEV_FRONTEND_URL, // Add the client URL here
      methods: ["GET", "POST"],
    },

    transports: ["websocket"],
    
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", ({ roomId, username }) => {
      console.log("User joined", username,"in room with id:", roomId);
      
      socket.join(roomId);
      socket.to(roomId).emit("userJoined", { username });

      socket.on("disconnect", () => {
        console.log("User left", username,"in room with id:", roomId);
        socket.to(roomId).emit("userLeft", { username });
      });
    });
  });
};

export { initializeSocket, io };
