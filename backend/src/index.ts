import express from "express";
import connectDB from "./config/db";
import cors from "cors";
import { createServer } from "http";
import { initializeSocket } from "./socket";
import { FRONTEND_URL, PORT } from "./config/env";
const app = express();

const frontendUrl = FRONTEND_URL;

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
