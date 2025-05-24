import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { VectorStore } from "./services/vector-store";
import { OpenAIService } from "./services/openai-service";

const vectorStore = new VectorStore();
const openAIService = new OpenAIService(process.env.OPENAI_API_KEY!);

const server = new McpServer({
  name: "engineering-context",
  version: "1.0.0",
});

// Register the getEngineeringContext tool
server.tool(
  "getEngineeringContext",
  {
    fileContent: { type: "string" },
    cursorPosition: {
      type: "object",
      properties: {
        line: { type: "number" },
        character: { type: "number" },
      },
    },
    filePath: { type: "string" },
  },
  async ({ fileContent }) => {
    try {
      // Get embedding for the current context
      const embedding = await openAIService.generateEmbedding(fileContent);

      // Search vector store for relevant context
      const results = await vectorStore.searchContext(embedding);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              contexts: results.map((result) => ({
                content: result.metadata?.content || "",
                relevance: result.score,
                source: result.metadata?.source || "unknown",
                type: result.metadata?.type || "unknown",
                metadata: {
                  timestamp:
                    result.metadata?.timestamp || new Date().toISOString(),
                  author: result.metadata?.author || "unknown",
                },
              })),
            }),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting engineering context:", error);
      throw error;
    }
  }
);

// Start the server with stdio transport
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
