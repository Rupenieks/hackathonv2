import { Request, Response } from "express";
import { OpenAIService } from "../services/openai-service";
import { VectorStore } from "../services/vector-store";
import { Server as SocketServer } from "socket.io";

export class SlackWebhookController {
  private openAIService: OpenAIService;
  private vectorStore: VectorStore;
  private io: SocketServer;

  private readonly COLLECTION_NAME = "engineering_context";

  constructor(io: SocketServer) {
    this.openAIService = new OpenAIService(process.env.OPENAI_API_KEY!);
    this.vectorStore = new VectorStore();
    this.io = io;
  }

  handleWebhook = async (req: Request, res: Response) => {
    try {
      const { text } = req.body;

      res.json({ status: "success", text });

      // 1. Check if message is relevant using OpenAI
      const isRelevant = await this.openAIService.processContext(text, {
        author: "slack",
      });

      if (!isRelevant) {
        return res.json({ status: "skipped", reason: "not relevant" });
      }

      // 2. Generate embedding for the context
      const embedding = await this.openAIService.generateEmbedding(text);

      // 3. Store the context in the vector store
      await this.vectorStore.storeContext(embedding, isRelevant.rule);

      // 4. Emit the new rule via WebSocket
      this.io.emit("newRule", {
        text: isRelevant.rule?.context,
        rule: isRelevant.rule,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error handling webhook:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
