import express from "express";
import { VectorStore } from "../services/vector-store";
import { OpenAIService } from "../services/openai-service";

export const cursorContextRouter = express.Router();

const vectorStore = new VectorStore();
const openAIService = new OpenAIService(process.env.OPENAI_API_KEY!);

cursorContextRouter.post("/", async (req, res) => {
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
  } catch (error) {
    console.error("Error in cursor context route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
