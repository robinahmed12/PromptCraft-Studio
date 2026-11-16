import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "PromptCraft Studio",
  },
});

async function run() {
  const model = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free";
  console.log(`Connecting to OpenRouter model: ${model}...`);
  const t0 = Date.now();
  const res = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "You are a concise assistant." },
      { role: "user", content: "Explain tokenization in 1 sentence." },
    ],
  });
  console.log(`Success in ${Date.now() - t0}ms!`);
  console.log("Response:", res.choices[0]?.message?.content);
  console.log("Usage:", res.usage);
}

run().catch((err) => {
  console.error("OpenRouter Test Error:", err?.message || err);
  process.exit(1);
});
