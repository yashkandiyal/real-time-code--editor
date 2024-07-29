import { Server, Socket } from "socket.io";
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
export default UserManager;
