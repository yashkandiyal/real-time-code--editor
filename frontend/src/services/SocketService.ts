// import { io, Socket } from "socket.io-client";

// class SocketService {
//   private socket: Socket | null = null;

//   connect(username: string, isAuthor: boolean, roomId: string): Socket {
//     if (!this.socket) {
//       const options = {
//         forceNew: true,
//         reconnectionAttempts: Infinity,
//         timeout: 10000,
//         transports: ["websocket"],
//         query: { username, isAuthor },
//       };

//       this.socket = io("http://localhost:3000", options);

//       this.socket.on("connect_error", () => {
//         console.error("Connection failed, retrying...");
//       });

//       this.socket.on("disconnect", () => {
//         console.error("Disconnected from server");
//       });
//     }

//     this.socket.emit("joinRoom", { roomId, username, isAuthor });
//     return this.socket;
//   }

//   disconnect(): void {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//     }
//   }

//   emit(event: string, data: any): void {
//     if (this.socket) {
//       this.socket.emit(event, data);
//     }
//   }

//   on(event: string, callback: (data: any) => void): void {
//     if (this.socket) {
//       this.socket.on(event, callback);
//     }
//   }

//   off(event: string, callback?: (data: any) => void): void {
//     if (this.socket) {
//       this.socket.off(event, callback);
//     }
//   }
// }

// const socketService = new SocketService();
// export default socketService;
