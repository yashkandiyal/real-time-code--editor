"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoomManager {
    constructor() {
        this.rooms = new Map();
        this.joinRequests = new Map();
        this.roomAuthors = new Map();
        this.blockedUsers = new Map();
    }
    createRoom(roomId, author) {
        this.rooms.set(roomId, new Set([author]));
        this.joinRequests.set(roomId, new Set());
        this.roomAuthors.set(roomId, author);
        this.blockedUsers.set(roomId, new Set()); // Initialize the blocked users list for the room
    }
    addParticipant(roomId, participant) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.add(participant);
            this.removeJoinRequest(roomId, participant);
        }
    }
    removeParticipant(roomId, username) {
        const room = this.rooms.get(roomId);
        if (room) {
            const participantToRemove = Array.from(room).find((p) => p.username === username);
            if (participantToRemove) {
                room.delete(participantToRemove);
                if (room.size === 0 ||
                    this.roomAuthors.get(roomId)?.username === username) {
                    this.deleteRoom(roomId);
                    return true;
                }
            }
        }
        return false;
    }
    addJoinRequest(roomId, participant) {
        const requests = this.joinRequests.get(roomId);
        if (requests) {
            const alreadyRequested = Array.from(requests).some((req) => req.username === participant.username &&
                req.email === participant.email);
            if (!alreadyRequested) {
                requests.add(participant);
            }
            else {
                console.log(`Duplicate join request from ${participant.username} for room ${roomId}`);
            }
        }
    }
    removeJoinRequest(roomId, participant) {
        const requests = this.joinRequests.get(roomId);
        if (requests) {
            const participantToRemove = Array.from(requests).find((p) => p.username === participant.username);
            if (participantToRemove) {
                requests.delete(participantToRemove);
            }
        }
    }
    deleteRoom(roomId) {
        this.rooms.delete(roomId);
        this.joinRequests.delete(roomId);
        this.roomAuthors.delete(roomId);
        this.blockedUsers.delete(roomId);
    }
    getParticipants(roomId) {
        return Array.from(this.rooms.get(roomId) || []);
    }
    getUserByEmail(roomId, email) {
        if (!roomId || !email) {
            return;
        }
        const isRoomPresent = this.rooms.has(roomId);
        if (isRoomPresent) {
            const participants = this.getParticipants(roomId);
            const user = participants.find((p) => p.email === email);
            return user;
        }
    }
    isUserInAnyRoom(email) {
        for (const roomId of this.rooms.keys()) {
            const user = this.getUserByEmail(roomId, email);
            if (user) {
                return roomId;
            }
        }
        return null;
    }
    getAuthor(roomId) {
        return this.roomAuthors.get(roomId);
    }
    roomExists(roomId) {
        return this.rooms.has(roomId);
    }
    getJoinRequests(roomId) {
        return Array.from(this.joinRequests.get(roomId) || []);
    }
    addUserToBlockedList(roomId, email) {
        const blockedList = this.blockedUsers.get(roomId);
        if (blockedList) {
            blockedList.add(email);
        }
        else {
            this.blockedUsers.set(roomId, new Set([email]));
        }
    }
    isUserBlocked(roomId, email) {
        const blockedList = this.blockedUsers.get(roomId);
        return blockedList ? blockedList.has(email) : false;
    }
    getBlockedUsers(roomId) {
        const blockedList = this.blockedUsers.get(roomId);
        console.log("getBlockedUsers: ", blockedList);
        return blockedList ? Array.from(blockedList) : [];
    }
}
exports.default = RoomManager;
//# sourceMappingURL=roomManager.js.map