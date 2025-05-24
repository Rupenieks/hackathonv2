import express from "express";
import dotenv from "dotenv";
import { slackWebhookRouter } from "./routes/slack-webhook";
import { OpenAIService } from "./services/openai-service";
import { GitService } from "./services/git-service";
import { CursorService } from "./services/cursor-service";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize services
const openAIService = new OpenAIService(process.env.OPENAI_API_KEY!);
const gitService = new GitService(process.env.GITHUB_TOKEN!);
const cursorService = new CursorService();

// Routes
app.use("/webhook/slack", slackWebhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
