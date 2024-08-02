"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND_URL = exports.CLERK_PUBLISHABLE_KEY = exports.CLERK_SECRET_KEY = exports.WEBHOOK_SECRET = exports.MONGODB_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
exports.PORT = PORT;
const MONGODB_URI = process.env.MONGODB_URI;
exports.MONGODB_URI = MONGODB_URI;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
exports.WEBHOOK_SECRET = WEBHOOK_SECRET;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
exports.CLERK_SECRET_KEY = CLERK_SECRET_KEY;
const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;
exports.CLERK_PUBLISHABLE_KEY = CLERK_PUBLISHABLE_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
exports.FRONTEND_URL = FRONTEND_URL;
//# sourceMappingURL=env.js.map