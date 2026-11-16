import OpenAI from "openai";
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

let client: OpenAI | null = null;

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
  }
}

/**
 * Approximate token count estimation (1 token ~= 4 chars of English text)
 */
function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Execute LLM completion via OpenRouter / OpenAI SDK
 */
export async function generateCompletion(
  userMessage: string,
  options: LLMRequestOptions = {}
): Promise<LLMResponseResult> {
  const startTime = Date.now();
  // Prefer OpenRouter model if configured
  const model = (options.model && options.model !== "gpt-4o-mini") 
    ? options.model 
    : (openrouterApiKey ? DEFAULT_MODEL : options.model || "gpt-4o-mini");
  const temperature = options.temperature ?? 0.7;
  const maxTokens = options.maxTokens ?? 1500;
  const isJson = options.responseFormat === "json_object";

  if (!client || forceMock) {
    throw new Error(
      "Live LLM is not initialized or USE_MOCK_LLM is set to true. Please verify OPENROUTER_API_KEY in backend/.env"
    );
  }

  // Build messages array
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  const baseSystemPrompt = options.systemPrompt && options.systemPrompt.trim()
    ? options.systemPrompt
    : "You are a helpful and knowledgeable AI assistant.";

  const finalSystemPrompt = isJson
    ? `${baseSystemPrompt}\n\nIMPORTANT: You MUST respond ONLY with a valid, well-formed JSON object. Do not include markdown formatting or commentary outside the JSON.`
    : baseSystemPrompt;

  messages.push({
    role: "system",
    content: finalSystemPrompt,
  });

  if (options.history && options.history.length > 0) {
    for (const msg of options.history) {
      messages.push({
        role: msg.role as any,
        content: msg.content,
      });
    }
  }

  messages.push({
    role: "user",
    content: userMessage,
  });

  const completionParams: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    ...(isJson ? { response_format: { type: "json_object" } } : {}),
  };

  try {
    const response = await client.chat.completions.create(completionParams);
    const latencyMs = Date.now() - startTime;

    const choice = response.choices[0];
    const rawContent = choice?.message?.content || "";
    let structuredData: any = null;

    if (isJson && rawContent) {
      try {
        // Strip code fence if model wrapped in ```json ... ```
        const cleaned = rawContent.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```$/, "").trim();
        structuredData = JSON.parse(cleaned);
      } catch (err) {
        console.warn("Could not parse JSON response from LLM:", err);
      }
    }

    const usage = response.usage;
    const promptTokens = usage?.prompt_tokens ?? estimateTokens(JSON.stringify(messages));
    const completionTokens = usage?.completion_tokens ?? estimateTokens(rawContent);

    return {
      content: rawContent,
      structuredData,
      promptTokens,
      completionTokens,
      totalTokens: usage?.total_tokens ?? (promptTokens + completionTokens),
      latencyMs,
      isMock: false,
    };
  } catch (error: any) {
    console.error("OpenRouter API error:", error?.message || error);
    throw new Error(`OpenRouter API call failed: ${error?.message || error}`);
  }
}
