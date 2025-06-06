"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const vector_store_1 = require("./services/vector-store");
const openai_service_1 = require("./services/openai-service");
const vectorStore = new vector_store_1.VectorStore();
const openAIService = new openai_service_1.OpenAIService("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");
// 1. Create server instance
const server = new index_js_1.Server({
    name: "engineering-context",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// 2. Define the list of tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "getEngineeringContext",
                description: "Get relevant engineering context for the current code",
                inputSchema: {
                    type: "object",
                    properties: {
                        fileContent: {
                            type: "string",
                            description: "Content of the current file",
                        },
                        cursorPosition: {
                            type: "object",
                            properties: {
                                line: { type: "number" },
                                character: { type: "number" },
                            },
                            description: "Current cursor position",
                        },
                        filePath: {
                            type: "string",
                            description: "Path to the current file",
                        },
                    },
                    required: ["fileContent"],
                },
            },
        ],
    };
});
// 3. Implement the tool call logic
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    console.log("Request received:", request.params);
    if (name !== "getEngineeringContext") {
        throw new Error(`Unknown tool: ${name}`);
    }
    if (!args?.fileContent || typeof args.fileContent !== "string") {
        throw new Error("fileContent is required and must be a string");
    }
    try {
        // Get embedding for the current context
        const embedding = await openAIService.generateEmbedding(args.fileContent);
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
// 4. Start the server with stdio transport
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    console.log(server);
    console.log(transport);
    await server.connect(transport);
    console.error("Engineering Context MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
