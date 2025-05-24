"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorStore = void 0;
// src/services/vector-store.ts
const js_client_rest_1 = require("@qdrant/js-client-rest");
const uuid_1 = require("uuid");
class VectorStore {
    client;
    COLLECTION_NAME = "engineering_context";
    constructor() {
        this.client = new js_client_rest_1.QdrantClient({
            url: "http://localhost:6333",
            port: 6333,
        });
        this.initializeCollection();
    }
    async initializeCollection() {
        try {
            // Check if collection exists
            const collections = await this.client.getCollections();
            const exists = collections.collections.some((c) => c.name === this.COLLECTION_NAME);
            if (!exists) {
                // Create collection with proper configuration
                await this.client.createCollection(this.COLLECTION_NAME, {
                    vectors: {
                        size: 1536, // OpenAI embedding size
                        distance: "Cosine",
                    },
                });
            }
        }
        catch (error) {
            console.error("Failed to initialize collection:", error);
            throw error;
        }
    }
    async storeContext(embedding, context) {
        try {
            await this.client.upsert(this.COLLECTION_NAME, {
                wait: true,
                points: [
                    {
                        id: (0, uuid_1.v4)(),
                        vector: embedding,
                        payload: {
                            type: context.type,
                            content: context.context,
                            source: context.metadata?.source,
                            timestamp: context.metadata?.timestamp,
                            author: context.metadata?.author,
                        },
                    },
                ],
            });
        }
        catch (error) {
            console.error("Failed to store context:", error);
            throw error;
        }
    }
    async searchContext(queryEmbedding, limit = 5) {
        try {
            const results = await this.client.search(this.COLLECTION_NAME, {
                vector: queryEmbedding,
                limit,
                with_payload: true,
                with_vector: false,
            });
            return results.map((result) => ({
                score: result.score,
                metadata: result.payload,
            }));
        }
        catch (error) {
            console.error("Failed to search context:", error);
            throw error;
        }
    }
}
exports.VectorStore = VectorStore;
