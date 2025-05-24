"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursorContextRouter = void 0;
const express_1 = __importDefault(require("express"));
const vector_store_1 = require("../services/vector-store");
const openai_service_1 = require("../services/openai-service");
exports.cursorContextRouter = express_1.default.Router();
const vectorStore = new vector_store_1.VectorStore();
const openAIService = new openai_service_1.OpenAIService(process.env.OPENAI_API_KEY);
exports.cursorContextRouter.post("/", async (req, res) => {
    try {
        const { fileContent, cursorPosition, filePath } = req.body;
        // Get embedding for the current context
        const embedding = await openAIService.generateEmbedding(fileContent);
        // Search vector store for relevant context
        const results = await vectorStore.searchContext(embedding);
        res.json({
            contexts: results.map((result) => ({
                content: result.metadata?.content || "",
                relevance: result.score,
                source: result.metadata?.source || "unknown",
                type: result.metadata?.type || "unknown",
                metadata: {
                    timestamp: result.metadata?.timestamp || new Date().toISOString(),
                    author: result.metadata?.author || "unknown",
                },
            })),
        });
    }
    catch (error) {
        console.error("Error in cursor context route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
