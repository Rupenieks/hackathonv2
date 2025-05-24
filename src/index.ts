import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { createSlackWebhookRouter } from "./routes/slack-webhook";
import { cursorContextRouter } from "./routes/cursor-context";
import { OpenAIService } from "./services/openai-service";
import { GitService } from "./services/git-service";
import { CursorService } from "./services/cursor-service";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server with CORS enabled
const io = new SocketServer(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite's default port
    methods: ["GET", "POST"],
  },
});

// // Initialize services
// const openAIService = new OpenAIService(process.env.OPENAI_API_KEY!);
// const gitService = new GitService(process.env.GITHUB_TOKEN!);
// const cursorService = new CursorService();

// Routes
app.use("/webhook/slack", createSlackWebhookRouter(io));
app.use("/api/cursor-context", cursorContextRouter);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
