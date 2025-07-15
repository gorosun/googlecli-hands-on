import { VertexAI } from "@google-cloud/vertexai";
import * as dotenv from "dotenv";

// 環境変数の読み込み（デバッグ有効）
dotenv.config({ debug: true });

// 環境変数の確認
console.log("Environment variables loaded:");
console.log("GOOGLE_CLOUD_PROJECT:", process.env.GOOGLE_CLOUD_PROJECT);
console.log(
  "GOOGLE_APPLICATION_CREDENTIALS:",
  process.env.GOOGLE_APPLICATION_CREDENTIALS
);
console.log("GOOGLE_CLOUD_LOCATION:", process.env.GOOGLE_CLOUD_LOCATION);

interface VertexAIConfig {
  project: string;
  location: string;
}

class GeminiVertexAIClient {
  private config: VertexAIConfig;
  private vertexAI: VertexAI;

  constructor() {
    this.config = {
      project: process.env.GOOGLE_CLOUD_PROJECT || "",
      location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
    };

    // Vertex AIの初期化（安定版パッケージ）
    this.vertexAI = new VertexAI({
      project: this.config.project,
      location: this.config.location,
    });
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      // Gemini 2.5 Proモデルの取得
      const model = this.vertexAI.getGenerativeModel({
        model: "gemini-2.5-pro",
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const response = result.response;
      return (
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response generated"
      );
    } catch (error) {
      console.error("Content generation error:", error);
      throw error;
    }
  }

  async streamGenerateContent(prompt: string): Promise<void> {
    try {
      // Gemini 2.5 Proモデルの取得
      const model = this.vertexAI.getGenerativeModel({
        model: "gemini-2.5-pro",
      });

      const result = await model.generateContentStream({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      for await (const chunk of result.stream) {
        const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          process.stdout.write(text);
        }
      }
    } catch (error) {
      console.error("Stream generation error:", error);
      throw error;
    }
  }
}

// 使用例
async function main(): Promise<void> {
  try {
    const client = new GeminiVertexAIClient();

    // テキスト生成
    const prompt = "企業でのAI活用について、簡潔に説明してください。";
    console.log("\n=== 通常のテキスト生成 ===");
    const response = await client.generateContent(prompt);
    console.log("Response:", response);

    // ストリーミング生成
    console.log("\n=== ストリーミング生成 ===");
    await client.streamGenerateContent(prompt);
    console.log("\n=== 完了 ===");
  } catch (error) {
    console.error("Main execution error:", error);
  }
}

// 実行
main();
