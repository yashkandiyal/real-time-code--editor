class RoomManager {
  private rooms: Map<string, Set<string>> = new Map();
  private joinRequests: Map<string, Set<string>> = new Map();
  public roomAuthors: Map<string, string> = new Map();

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
      if (room.size === 0 || this.roomAuthors.get(roomId) === username) {
        this.deleteRoom(roomId);
        return true; // Indicate that the room was deleted
      }
    }
    return false; // Indicate that the room was not deleted
  }

  addJoinRequest(roomId: string, username: string) {
    this.joinRequests.get(roomId)?.add(username);
  }

  removeJoinRequest(roomId: string, username: string) {
    this.joinRequests.get(roomId)?.delete(username);
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

export default RoomManager;
