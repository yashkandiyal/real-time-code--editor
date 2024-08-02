"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserManager {
    constructor() {
        this.userSockets = new Map();
    }
    addUser(username, socket) {
        this.userSockets.set(username, socket);
    }
    removeUser(username) {
        this.userSockets.delete(username);
    }
    getSocket(username) {
        return this.userSockets.get(username);
    }
}
exports.default = UserManager;
//# sourceMappingURL=userManager.js.map