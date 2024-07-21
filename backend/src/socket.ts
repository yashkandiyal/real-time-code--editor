import { Server, Socket } from "socket.io";
import { DEV_FRONTEND_URL } from "./config/env";

let io: Server;
const rooms: { [key: string]: Set<string> } = {}; // Store participants for each room
const joinRequests: { [key: string]: Set<string> } = {}; // Store join requests for each room
const roomAuthors: { [key: string]: string } = {}; // Store the author of each room

const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: DEV_FRONTEND_URL,
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
  });

  io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    socket.on("joinRoom", ({ roomId, username, isAuthor }) => {
      console.log("User joined", username, "in room with id:", roomId);

      // Initialize room participants and join requests if not already
      if (!rooms[roomId]) {
        rooms[roomId] = new Set();
        joinRequests[roomId] = new Set();
        roomAuthors[roomId] = username; // Set the first user as the author
      }

      // If the user is the author, join immediately
      if (isAuthor) {
        socket.join(roomId);
        rooms[roomId].add(username);
        roomAuthors[roomId] = username; // Ensure the author is set
        socket.emit("currentParticipants", Array.from(rooms[roomId]));
        return;
      }

      // For non-authors, create a join request
      joinRequests[roomId].add(username);

      // Notify author about the new join request
      const authorSocket = [...io.sockets.sockets.values()].find(
        (s) => s.handshake.query.username === roomAuthors[roomId]
      );

      if (authorSocket) {
        authorSocket.emit("joinRequest", { username, roomId });
      }

      // Notify the user that their join request is pending
      socket.emit("joinRequestPending");
    });
    
    socket.on("approveJoinRequest", ({ roomId, username }) => {
      console.log(
        "Join request approved for",
        username,
        "in room with id:",
        roomId
      );

      // Remove user from join requests and add them to the room
      joinRequests[roomId].delete(username);
      rooms[roomId].add(username);

      // Find the socket of the approved user
      const approvedUserSocket = [...io.sockets.sockets.values()].find(
        (s) => s.handshake.query.username === username
      );

      if (approvedUserSocket) {
        approvedUserSocket.join(roomId);
        approvedUserSocket.emit("joinRequestApproved", roomId);
        approvedUserSocket.emit(
          "currentParticipants",
          Array.from(rooms[roomId])
        );
      }

      // Notify everyone in the room about the new user
      io.to(roomId).emit("userJoined", { username });
    });

    socket.on("rejectJoinRequest", ({ roomId, username }) => {
      console.log(
        "Join request rejected for",
        username,
        "in room with id:",
        roomId
      );

      // Remove user from join requests
      joinRequests[roomId].delete(username);

      // Notify the rejected user
      const rejectedUserSocket = [...io.sockets.sockets.values()].find(
        (s) => s.handshake.query.username === username
      );

      if (rejectedUserSocket) {
        rejectedUserSocket.emit("joinRequestRejected", roomId);
      }
    });

    socket.on("removeParticipant", ({ roomId, username }) => {
      if (rooms[roomId] && rooms[roomId].has(username)) {
        // Remove the user from the room's participant list
        rooms[roomId].delete(username);

        // Find the socket of the user being removed
        const socketToRemove = [...io.sockets.sockets.values()].find(
          (s) => s.handshake.query.username === username
        );

        if (socketToRemove) {
          // Remove the user from the Socket.IO room
          socketToRemove.leave(roomId);

          // Notify the removed user
          socketToRemove.emit("youWereRemoved", { roomId });
        }

        // Notify everyone in the room about the removal
        io.to(roomId).emit("userRemoved", { username });

        // If the removed user was the author, assign a new author
        if (username === roomAuthors[roomId]) {
          const remainingParticipants = Array.from(rooms[roomId]);
          if (remainingParticipants.length > 0) {
            roomAuthors[roomId] = remainingParticipants[0];
            io.to(roomId).emit("newAuthor", {
              username: roomAuthors[roomId],
            });
          } else {
            // If no participants left, close the room
            delete rooms[roomId];
            delete joinRequests[roomId];
            delete roomAuthors[roomId];
            io.to(roomId).emit("roomClosed");
          }
        }
      }
    });

    socket.on("leaveRoom", ({ roomId, username }) => {
      if (rooms[roomId] && rooms[roomId].has(username)) {
        if (username === roomAuthors[roomId]) {
          delete rooms[roomId];
          io.to(roomId).emit("roomClosed");
          return;
        }
        rooms[roomId].delete(username);
        io.to(roomId).emit("userLeftWillingly", { username });
      }
    });
    console.log("these rooms are available", rooms);
    

    socket.on("disconnect", () => {
      console.log("User disconnected");

      const username = socket.handshake.query.username as string;

      // Handle user disconnection
      Object.keys(rooms).forEach((roomId) => {
        if (rooms[roomId].has(username)) {
          rooms[roomId].delete(username);

          // Notify everyone in the room that a user has left
          io.to(roomId).emit("userLeft", { username });

          // Handle removal from join requests if they are pending
          joinRequests[roomId].delete(username);

          // If the author leaves, remove the author from the authorRoom and then delete the corresponding room
          if (username === roomAuthors[roomId]) {
            delete rooms[roomId];
            delete joinRequests[roomId];
            delete roomAuthors[roomId];
            io.to(roomId).emit("roomClosed");
          } else {
            io.to(roomId).emit("userLeftWillingly", { username });
          }
        }
      });
    });
  });
};

export { initializeSocket, io };
