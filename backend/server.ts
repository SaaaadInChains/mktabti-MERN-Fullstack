import dotenv from "dotenv";
dotenv.config();

import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import cors from "cors";

import { connectDB } from "./src/config/mongoConfig.js";
import { globalLimiter } from "./src/security/rateLimiter.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js";
import authorRoutes from "./src/routes/authorRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import workerRoutes from "./src/routes/workerRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import chatbotRoutes from "./src/routes/chatbotRoutes.js";
import playlistRoutes from "./src/routes/playlistRoutes.js";

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "5000", 10);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
    },
  }),
);
app.use(globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/worker", workerRoutes);
app.use("/api", reviewRoutes);
app.use("/api", commentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/playlists", playlistRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: Function) => {
  console.error("Error: ", err);
  res.status(500).json({ message: "Server error" });
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
    server.on("error", (err) => {
      console.error("Server startup error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("Server error:", error);
    process.exit(1);
  }
};

startServer();
