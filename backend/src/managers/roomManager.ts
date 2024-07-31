interface Participant {
  username: string;
  email: string;
}

class RoomManager {
  private rooms: Map<string, Set<Participant>> = new Map();
  private joinRequests: Map<string, Set<Participant>> = new Map();
  public roomAuthors: Map<string, Participant> = new Map();

  createRoom(roomId: string, author: Participant) {
    this.rooms.set(roomId, new Set([author]));
    this.joinRequests.set(roomId, new Set());
    this.roomAuthors.set(roomId, author);
  }

  addParticipant(roomId: string, participant: Participant) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.add(participant);
      this.removeJoinRequest(roomId, participant);
    }
  }

  removeParticipant(roomId: string, username: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      const participantToRemove = Array.from(room).find(
        (p) => p.username === username
      );
      if (participantToRemove) {
        room.delete(participantToRemove);
        if (
          room.size === 0 ||
          this.roomAuthors.get(roomId)?.username === username
        ) {
          this.deleteRoom(roomId);
          return true;
        }
      }
    }
    return false;
  }

  addJoinRequest(roomId: string, participant: Participant) {
    const requests = this.joinRequests.get(roomId);
    if (requests) {
      const alreadyRequested = Array.from(requests).some(
        (req) =>
          req.username === participant.username &&
          req.email === participant.email
      );

      if (!alreadyRequested) {
        requests.add(participant);
      } else {
        console.log(
          `Duplicate join request from ${participant.username} for room ${roomId}`
        );
      }
    }
  }

  removeJoinRequest(roomId: string, participant: Participant) {
    const requests = this.joinRequests.get(roomId);
    if (requests) {
      const participantToRemove = Array.from(requests).find(
        (p) => p.username === participant.username
      );
      if (participantToRemove) {
        requests.delete(participantToRemove);
      }
    }
  }

  deleteRoom(roomId: string) {
    this.rooms.delete(roomId);
    this.joinRequests.delete(roomId);
    this.roomAuthors.delete(roomId);
  }

  getParticipants(roomId: string): Participant[] {
    return Array.from(this.rooms.get(roomId) || []);
  }

  getAuthor(roomId: string): Participant | undefined {
    return this.roomAuthors.get(roomId);
  }

  roomExists(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  getJoinRequests(roomId: string): Participant[] {
    return Array.from(this.joinRequests.get(roomId) || []);
  }
}

export default RoomManager;
