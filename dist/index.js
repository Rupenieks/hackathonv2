"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const slack_webhook_1 = require("./routes/slack-webhook");
const cursor_context_1 = require("./routes/cursor-context");
const openai_service_1 = require("./services/openai-service");
const git_service_1 = require("./services/git-service");
const cursor_service_1 = require("./services/cursor-service");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Initialize services
const openAIService = new openai_service_1.OpenAIService(process.env.OPENAI_API_KEY);
const gitService = new git_service_1.GitService(process.env.GITHUB_TOKEN);
const cursorService = new cursor_service_1.CursorService();
// Routes
app.use("/webhook/slack", slack_webhook_1.slackWebhookRouter);
app.use("/api/cursor-context", cursor_context_1.cursorContextRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
