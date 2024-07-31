import { Server, Socket } from "socket.io";
import { DEV_FRONTEND_URL } from "./config/env";
import RoomManager from "./managers/roomManager";
import UserManager from "./managers/userManager";

interface Participant {
  username: string;
  email: string;
}

const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: { origin: DEV_FRONTEND_URL, methods: ["GET", "POST"] },
    transports: ["websocket"],
  });

  const roomManager = new RoomManager();
  const userManager = new UserManager();

  io.on("connection", (socket: Socket) => {
    console.log("A user connected");
    const username = socket.handshake.query.username as string;
    userManager.addUser(username, socket);

    // Join room
    socket.on("joinRoom", ({ roomId, username, email, isAuthor }) => {
      console.log(
        `User ${username} joining room ${roomId} as ${
          isAuthor ? "author" : "participant"
        } with email: ${email}`
      );

      const participant: Participant = { username, email };

      // Check if the user is blocked
      if (roomManager.isUserBlocked(roomId, email)) {
        console.log(
          `User ${username} is blocked from room ${roomId} with email: ${email}`
        );
        socket.emit("blockedStatus", { isBlocked: true });
        return;
      }

      if (!roomManager.roomExists(roomId)) {
        console.log(`Room ${roomId} does not exist, creating...`);

        if (isAuthor) {
          roomManager.createRoom(roomId, participant);
        } else {
          socket.emit("roomJoinError", { message: "Room does not exist" });
          return;
        }
      }

      const author = roomManager.getAuthor(roomId);
      if (isAuthor || (author && username === author.username)) {
        socket.join(roomId);
        roomManager.addParticipant(roomId, participant);
        socket.emit("currentParticipants", roomManager.getParticipants(roomId));
        socket.emit("joinRoomSuccess", { roomId });
      } else {
        // Check for existing join requests
        const existingRequests = roomManager.getJoinRequests(roomId);
        const alreadyRequested = existingRequests.some(
          (req) => req.username === username && req.email === email
        );

        if (!alreadyRequested) {
          roomManager.addJoinRequest(roomId, participant);
          const authorSocket = userManager.getSocket(author!.username);
          authorSocket?.emit("joinRequest", { username, email, roomId });
          socket.emit("joinRequestPending");
        } else {
          console.log(
            `Duplicate join request from ${username} for room ${roomId}`
          );
        }
      }
    });

    // For adding a user in the blocked list
    socket.on(
      "blockUser",
      ({ roomId, email }: { roomId: string; email: string }) => {
        console.log("Blocking user: ", email);
        const isAlreadyBlocked = roomManager.isUserBlocked(roomId, email);

        if (!isAlreadyBlocked) {
          roomManager.addUserToBlockedList(roomId, email);
          socket.emit("userBlocked", { email });
        } else {
          socket.emit("userAlreadyBlocked", { email });
        }
      }
    );

    // Checking status of the user if he is blocked or not
    socket.on(
      "checkBlockedStatus",
      ({ roomId, email }: { roomId: string; email: string }) => {
        const isBlocked = roomManager.isUserBlocked(roomId, email);

        if (isBlocked) {
          console.log(
            `User with email ${email} is blocked from room ${roomId}`
          );
          socket.emit("blockedStatus", { isBlocked: true });
        } else {
          socket.emit("blockedStatus", { isBlocked: false });
        }
      }
    );

    // For approving join request
    socket.on("approveJoinRequest", ({ roomId, username, email }) => {
      console.log(`Approving join request for ${username} in room ${roomId}`);
      const participant: Participant = { username, email };
      roomManager.addParticipant(roomId, participant);
      const approvedUserSocket = userManager.getSocket(username);
      if (approvedUserSocket) {
        approvedUserSocket.join(roomId);
        approvedUserSocket.emit("joinRequestApproved", roomId);
        approvedUserSocket.emit(
          "currentParticipants",
          roomManager.getParticipants(roomId)
        );
      }
      io.to(roomId).emit("userJoined", { username, email });
    });

    // For rejecting join request
    socket.on("rejectJoinRequest", ({ roomId, username, email }) => {
      console.log(`Rejecting join request for ${username} in room ${roomId}`);
      const participant: Participant = { username, email };
      roomManager.removeJoinRequest(roomId, participant);
      const rejectedUserSocket = userManager.getSocket(username);
      rejectedUserSocket?.emit("joinRequestRejected", roomId);
    });

    // For removing participant
    socket.on("removeParticipant", ({ roomId, username }) => {
      console.log(`Removing ${username} from room ${roomId}`);
      const roomDeleted = roomManager.removeParticipant(roomId, username);
      const removedUserSocket = userManager.getSocket(username);
      removedUserSocket?.leave(roomId);
      removedUserSocket?.emit("youWereRemoved", { roomId });

      if (roomDeleted) {
        io.to(roomId).emit("roomClosed", false);
      } else {
        io.to(roomId).emit("userRemoved", { username });
      }
    });

    // For leaving room
    socket.on("leaveRoom", ({ roomId, username }) => {
      console.log(`${username} leaving room ${roomId}`);
      console.log(
        `Participants in room ${roomId}:`,
        roomManager.getParticipants(roomId)
      );

      const author = roomManager.getAuthor(roomId);
      if (author && username === author.username) {
        roomManager.deleteRoom(roomId);
        console.log(`Room ${roomId} deleted`);
        io.to(roomId).emit("roomClosed", false);
      } else {
        roomManager.removeParticipant(roomId, username);
        io.to(roomId).emit("userLeft", { username });
      }
    });

    // For checking if room exists
    socket.on("RoomExists", ({ roomId }) => {
      console.log(`Checking if room ${roomId} exists`);
      const status = roomManager.roomExists(roomId);
      console.log("status of the room:", status);
      io.emit("roomStatus", { roomExists: status });
    });

    // For changes in code editor
    socket.on("codeChange", ({ content, roomId, username }) => {
      console.log(`Code change in room ${roomId} by ${username} : ${content}`);
      io.in(roomId).emit("codeUpdate", { content, sender: username });
    });

    socket.on("disconnect", () => {
      console.log(`User ${username} disconnected`);

      // Find all rooms where this user is the author
      for (const [roomId, author] of roomManager.roomAuthors.entries()) {
        if (author.username === username) {
          console.log(
            `Deleting room ${roomId} as author ${username} disconnected`
          );
          roomManager.deleteRoom(roomId);
          io.to(roomId).emit("roomClosed", false);
        }
      }

      userManager.removeUser(username);
      io.emit("userDisconnected", { username });
    });

    // Implement chat feature
    socket.on("sendMessage", ({ roomId, message, sender, timestamp }) => {
      console.log(
        `Message from ${sender} in room ${roomId}: ${message} at ${timestamp}`
      );
      io.to(roomId).emit("newMessage", { sender, message, timestamp });
    });
  });

  return io;
};

export { initializeSocket };
