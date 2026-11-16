import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

export interface ChatMessagePayload {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json_object";
  systemPrompt?: string;
  history?: ChatMessagePayload[];
}

export interface LLMResponseResult {
  content: string;
  structuredData?: any;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  isMock: boolean;
}

const openrouterApiKey = process.env.OPENROUTER_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
export const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free";
const forceMock = process.env.USE_MOCK_LLM === "true";

let client: any = null;

if (!forceMock) {
  if (openrouterApiKey && openrouterApiKey.trim() !== "") {
    client = new OpenAI({
      apiKey: openrouterApiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "PromptCraft Studio",
      },
    });
    console.log(`🔌 [OpenRouter] Initialized live client with default model: ${DEFAULT_MODEL}`);
  } else if (openaiApiKey && openaiApiKey.trim() !== "") {
    client = new OpenAI({ apiKey: openaiApiKey });
    console.log("🔌 [OpenAI] Initialized live OpenAI client.");
  } else {
    console.warn("⚠️ No live LLM API key found in backend/.env. System will require OPENROUTER_API_KEY.");
  }
}

export async function generateCompletion(
  userMessage: string,
  options: LLMRequestOptions = {}
): Promise<LLMResponseResult> {
  const startTime = Date.now();
  const model = options.model || DEFAULT_MODEL;
  const temperature = options.temperature ?? 0.7;
  const maxTokens = options.maxTokens ?? 1500;
  const isJson = options.responseFormat === "json_object";

  if (!client || forceMock) {
    throw new Error(
      "Live LLM is not initialized or USE_MOCK_LLM is set to true. Please verify OPENROUTER_API_KEY in backend/.env"
    );
  }

  // Build messages array
  const messages: any[] = [];

  const baseSystemPrompt = options.systemPrompt && options.systemPrompt.trim()
    ? options.systemPrompt
    : "You are a helpful and knowledgeable AI assistant. Always provide clear, direct, and well-structured responses in natural plain text, just like ChatGPT.";

  const finalSystemPrompt = isJson
    ? `${baseSystemPrompt}\n\nIMPORTANT: You MUST respond ONLY with a valid, well-formed JSON object. Do not include markdown formatting or commentary outside the JSON.`
    : `${baseSystemPrompt}\n\nIMPORTANT: Respond in natural, clean plain text like ChatGPT. Do not return JSON or code formatting unless explicitly requested.`;

  messages.push({
    role: "system",
    content: finalSystemPrompt,
  });

  if (options.history && options.history.length > 0) {
    for (const msg of options.history) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  messages.push({
    role: "user",
    content: userMessage,
  });

  const completionParams: any = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    ...(isJson ? { response_format: { type: "json_object" } } : {}),
  };

  try {
    const response = await client.chat.completions.create(completionParams);
    const latencyMs = Date.now() - startTime;

    const rawChoice = response.choices?.[0];
    const rawContent = rawChoice?.message?.content || "";

    const usage = response.usage || {};
    const promptTokens = usage.prompt_tokens || 0;
    const completionTokens = usage.completion_tokens || 0;
    const totalTokens = usage.total_tokens || promptTokens + completionTokens;

    let structuredData: any = undefined;
    if (isJson) {
      try {
        structuredData = JSON.parse(rawContent);
      } catch (e) {
        console.warn("Model response was not valid JSON:", rawContent);
        structuredData = { raw: rawContent, parseError: true };
      }
    }

    return {
      content: rawContent,
      structuredData,
      promptTokens,
      completionTokens,
      totalTokens,
      latencyMs,
      isMock: false,
    };
  } catch (err: any) {
    console.error("OpenRouter LLM completion error:", err);
    throw new Error(`LLM Error: ${err.message || "Failed to generate completion from OpenRouter"}`);
  }
}
