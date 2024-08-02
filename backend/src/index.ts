import express from "express";
import connectDB from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { initializeSocket } from "./socket";
import { FRONTEND_URL, PORT } from "./config/env";
import { webhookHandler } from "./utils/webhookHandler";

const app = express();

const frontendUrl = FRONTEND_URL;

// Middleware
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
  res.send("API running!");
});
app.post("/api/webhooks", webhookHandler);

const server = createServer(app);
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`server running at port http://localhost:${PORT}`);
});

export default app;
