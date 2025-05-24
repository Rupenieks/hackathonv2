import OpenAI from "openai";

interface CursorRule {
  type: "Always";
  context: string;
  metadata?: {
    source: string;
    timestamp: string;
    author?: string;
  };
}

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey:
        "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",
    });
  }

  async processContext(
    text: string,
    metadata: { author?: string }
  ): Promise<{ isRelevant: boolean; rule?: CursorRule }> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an AI that analyzes engineering discussions and determines if they contain important context that should be saved as a rule.
            Important context includes:
            - Technical decisions
            - Architecture choices
            - Implementation patterns
            - Best practices
            - Project conventions
            
            If the content is relevant, format it concisely and clearly for future reference.
            Return JSON with format: { "isRelevant": boolean, "formattedContext": string if relevant }
            Only return valid JSON.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");

      if (!result.isRelevant) {
        return { isRelevant: false };
      }

      // Create properly formatted rule
      const rule: CursorRule = {
        type: "Always",
        context: result.formattedContext,
        metadata: {
          source: "slack",
          timestamp: new Date().toISOString(),
          author: metadata?.author || "unknown",
        },
      };

      return {
        isRelevant: true,
        rule,
      };
    } catch (error) {
      console.error("Error processing context with OpenAI:", error);
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data[0].embedding;
  }
}
