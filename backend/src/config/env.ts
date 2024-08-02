import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;

export {
  PORT,
  MONGODB_URI,
  WEBHOOK_SECRET,
  CLERK_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY,
  FRONTEND_URL,
};
