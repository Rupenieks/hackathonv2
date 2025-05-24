"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackWebhookController = void 0;
const openai_service_1 = require("../services/openai-service");
const git_service_1 = require("../services/git-service");
const cursor_service_1 = require("../services/cursor-service");
const vector_store_1 = require("../services/vector-store");
class SlackWebhookController {
    openAIService;
    gitService;
    cursorService;
    vectorStore;
    COLLECTION_NAME = "engineering_context";
    constructor() {
        this.openAIService = new openai_service_1.OpenAIService(process.env.OPENAI_API_KEY);
        this.gitService = new git_service_1.GitService(process.env.GITHUB_TOKEN);
        this.cursorService = new cursor_service_1.CursorService();
        this.vectorStore = new vector_store_1.VectorStore();
    }
    handleWebhook = async (req, res) => {
        try {
            const { text } = req.body;
            res.json({ status: "success", text });
            // 1. Check if message is relevant using OpenAI
            const isRelevant = await this.openAIService.processContext(text, {
                author: "slack",
            });
            console.log("isRelevant", isRelevant);
            if (!isRelevant) {
                return res.json({ status: "skipped", reason: "not relevant" });
            }
            // 2. Generate embedding for the context
            const embedding = await this.openAIService.generateEmbedding(text);
            console.log("embedding", embedding);
            // 3. Store the context in the vector store
            await this.vectorStore.storeContext(embedding, isRelevant.rule);
        }
        catch (error) {
            console.error("Error handling webhook:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };
}
exports.SlackWebhookController = SlackWebhookController;
