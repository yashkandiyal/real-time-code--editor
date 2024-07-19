import express from "express";
import connectDB from "./config/db";
import { DEV_FRONTEND_URL, PORT, PROD_FRONTEND_URL } from "./config/env";
import cors from "cors";
import { createServer } from "http";
import { initializeSocket } from "./socket";
const app = express();
const isProduction = process.env.NODE_ENV === "production";
const frontendUrl = isProduction ? PROD_FRONTEND_URL : DEV_FRONTEND_URL;

// Middleware
app.use(cors({ origin: frontendUrl }));
app.use(express.json());
connectDB();
const server = createServer(app);
initializeSocket(server);
server.listen(PORT, () => {
  console.log(`server running at port http://localhost:${PORT}`);
});
export default app;
