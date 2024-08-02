import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private backeEndUrl = import.meta.env.VITE_BACKEND_URL;

  connect(username: string, isAuthor: boolean): Socket {
    if (!this.socket || this.socket.disconnected) {
      const options = {
        forceNew: true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ["websocket"],
        query: { username, isAuthor },
      };

      this.socket = io(this.backeEndUrl, options);

      this.socket.on("connect", () => {});

      this.socket.on("connect_error", (error) => {
        console.error("Connection failed, retrying...", error);
      });

      this.socket.on("disconnect", (reason) => {
        console.error("Disconnected from server", reason);
      });

      this.socket.on("reconnect_attempt", (attemptNumber) => {
        console.log(`Reconnection attempt #${attemptNumber}`);
      });

      this.socket.on("reconnect_failed", () => {
        console.error("Reconnection failed");
      });
    }

    return this.socket;
  }

  joinRoom(
    roomId: string,
    username: string,
    isAuthor: boolean,
    email: string
  ): void {
    if (this.socket) {
      this.socket.emit("joinRoom", { roomId, username, isAuthor, email });
    } else {
      console.error("Socket not connected. Call connect() first.");
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, (data) => {
        callback(data);
      });
    }
  }

  once(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.once(event, (data) => {
        callback(data);
      });
    }
  }

  off(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

const socketService = new SocketService();
export default socketService;
