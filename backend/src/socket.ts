import { Server, Socket } from "socket.io";
import { DEV_FRONTEND_URL } from "./config/env";

class RoomManager {
  private rooms: Map<string, Set<string>> = new Map();
  private joinRequests: Map<string, Set<string>> = new Map();
  private roomAuthors: Map<string, string> = new Map();

  createRoom(roomId: string, author: string) {
    this.rooms.set(roomId, new Set([author]));
    this.joinRequests.set(roomId, new Set());
    this.roomAuthors.set(roomId, author);
  }

  addParticipant(roomId: string, username: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.add(username);
      this.joinRequests.get(roomId)?.delete(username);
    }
  }

  removeParticipant(roomId: string, username: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(username);
      if (room.size === 0) {
        this.deleteRoom(roomId);
      } else if (this.roomAuthors.get(roomId) === username) {
        this.setNewAuthor(roomId);
      }
    }
  }

  addJoinRequest(roomId: string, username: string) {
    this.joinRequests.get(roomId)?.add(username);
  }

  removeJoinRequest(roomId: string, username: string) {
    this.joinRequests.get(roomId)?.delete(username);
  }

  setNewAuthor(roomId: string) {
    const room = this.rooms.get(roomId);
    if (room && room.size > 0) {
      const newAuthor = room.values().next().value;
      this.roomAuthors.set(roomId, newAuthor);
      return newAuthor;
    }
    return null;
  }

  deleteRoom(roomId: string) {
    this.rooms.delete(roomId);
    this.joinRequests.delete(roomId);
    this.roomAuthors.delete(roomId);
  }

  getParticipants(roomId: string): string[] {
    return Array.from(this.rooms.get(roomId) || []);
  }

  getAuthor(roomId: string): string | undefined {
    return this.roomAuthors.get(roomId);
  }

  roomExists(roomId: string): boolean {
    return this.rooms.has(roomId);
  }
}

class UserManager {
  private userSockets: Map<string, Socket> = new Map();

  addUser(username: string, socket: Socket) {
    this.userSockets.set(username, socket);
  }

  removeUser(username: string) {
    this.userSockets.delete(username);
  }

  getSocket(username: string): Socket | undefined {
    return this.userSockets.get(username);
  }
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

    socket.on("joinRoom", ({ roomId, username, isAuthor }) => {
      console.log(`User ${username} joining room ${roomId}`);

      if (!roomManager.roomExists(roomId)) {
        roomManager.createRoom(roomId, username);
      }

      if (isAuthor || username === roomManager.getAuthor(roomId)) {
        socket.join(roomId);
        roomManager.addParticipant(roomId, username);
        socket.emit("currentParticipants", roomManager.getParticipants(roomId));
      } else {
        roomManager.addJoinRequest(roomId, username);
        const authorSocket = userManager.getSocket(
          roomManager.getAuthor(roomId)!
        );
        authorSocket?.emit("joinRequest", { username, roomId });
        socket.emit("joinRequestPending");
      }
    });

    socket.on("approveJoinRequest", ({ roomId, username }) => {
      console.log(`Approving join request for ${username} in room ${roomId}`);
      roomManager.addParticipant(roomId, username);
      const approvedUserSocket = userManager.getSocket(username);
      if (approvedUserSocket) {
        approvedUserSocket.join(roomId);
        approvedUserSocket.emit("joinRequestApproved", roomId);
        approvedUserSocket.emit(
          "currentParticipants",
          roomManager.getParticipants(roomId)
        );
      }
      io.to(roomId).emit("userJoined", { username });
    });

    socket.on("rejectJoinRequest", ({ roomId, username }) => {
      console.log(`Rejecting join request for ${username} in room ${roomId}`);
      roomManager.removeJoinRequest(roomId, username);
      const rejectedUserSocket = userManager.getSocket(username);
      rejectedUserSocket?.emit("joinRequestRejected", roomId);
    });

    socket.on("removeParticipant", ({ roomId, username }) => {
      console.log(`Removing ${username} from room ${roomId}`);
      roomManager.removeParticipant(roomId, username);
      const removedUserSocket = userManager.getSocket(username);
      removedUserSocket?.leave(roomId);
      removedUserSocket?.emit("youWereRemoved", { roomId });
      io.to(roomId).emit("userRemoved", { username });

      const newAuthor = roomManager.setNewAuthor(roomId);
      if (newAuthor) {
        io.to(roomId).emit("newAuthor", { username: newAuthor });
      } else {
        io.to(roomId).emit("roomClosed");
      }
    });

    socket.on("leaveRoom", ({ roomId, username }) => {
      console.log(`${username} leaving room ${roomId}`);
      roomManager.removeParticipant(roomId, username);
      io.to(roomId).emit("userLeftWillingly", { username });
      if (username === roomManager.getAuthor(roomId)) {
        roomManager.deleteRoom(roomId);
        io.to(roomId).emit("roomClosed");
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${username} disconnected`);
      userManager.removeUser(username);
      io.emit("userDisconnected", { username });
    });

    // Implement chat feature
    socket.on("sendMessage", ({ roomId, message, sender }) => {
      console.log(`Message from ${sender} in room ${roomId}: ${message}`);
      io.to(roomId).emit("newMessage", { sender, message });
    });
  });

  return io;
};

export { initializeSocket };
