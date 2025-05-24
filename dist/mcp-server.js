"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const vector_store_1 = require("./services/vector-store");
const openai_service_1 = require("./services/openai-service");
const vectorStore = new vector_store_1.VectorStore();
const openAIService = new openai_service_1.OpenAIService(process.env.OPENAI_API_KEY);
const server = new mcp_js_1.McpServer({
    name: "engineering-context",
    version: "1.0.0",
});
// Register the getEngineeringContext tool
server.tool("getEngineeringContext", {
    fileContent: { type: "string" },
    cursorPosition: {
        type: "object",
        properties: {
            line: { type: "number" },
            character: { type: "number" },
        },
    },
    filePath: { type: "string" },
}, async ({ fileContent }) => {
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
                                timestamp: result.metadata?.timestamp || new Date().toISOString(),
                                author: result.metadata?.author || "unknown",
                            },
                        })),
                    }),
                },
            ],
        };
    }
    catch (error) {
        console.error("Error getting engineering context:", error);
        throw error;
    }
});
// Start the server with stdio transport
const transport = new stdio_js_1.StdioServerTransport();
server.connect(transport).catch(console.error);
