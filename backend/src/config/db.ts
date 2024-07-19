import mongoose from "mongoose";
import { MONGODB_URI } from "./env";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI!, {});
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export default connectDB;
