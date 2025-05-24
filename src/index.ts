import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { createSlackWebhookRouter } from "./routes/slack-webhook";
import { cursorContextRouter } from "./routes/cursor-context";
import { OpenAIService } from "./services/openai-service";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server with CORS enabled
const io = new SocketServer(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize services
const openAIService = new OpenAIService(process.env.OPENAI_API_KEY!);

// Routes
app.use("/webhook/slack", createSlackWebhookRouter(io));
app.use("/api/cursor-context", cursorContextRouter);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
