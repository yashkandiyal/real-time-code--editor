import express from "express";
import connectDB from "./config/db";
import { DEV_FRONTEND_URL, PORT, PROD_FRONTEND_URL } from "./config/env";
import cors from "cors";
import { createServer } from "http";
import { initializeSocket } from "./socket";
import path from "path";

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const frontendUrl = isProduction ? PROD_FRONTEND_URL : DEV_FRONTEND_URL;

// Middleware
app.use(cors({ origin: frontendUrl }));
app.use(express.json());
connectDB();

// Serve static files in production
if (isProduction) {
  const __dirname1 = path.resolve();
  app.use(express.static(path.join(__dirname1, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "../frontend/dist/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

const server = createServer(app);
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
