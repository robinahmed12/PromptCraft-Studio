import { Router, Request, Response } from "express";
import { checkDatabaseConnection } from "../config/db.js";
import { DEFAULT_MODEL } from "../services/llm.service.js";
import {
  getSessions,
  createSession,
  getSessionById,
  updateSessionConfig,
  deleteSession,
} from "../controllers/session.controller.js";
import { sendMessage } from "../controllers/chat.controller.js";

export const apiRouter = Router();

// GET /api/health - Healthcheck for Neon DB and LLM Engine
apiRouter.get("/health", async (req: Request, res: Response) => {
  const dbStatus = await checkDatabaseConnection();
  const openrouterKey = Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim() !== "");
  const openaiKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "");
  const forceMock = process.env.USE_MOCK_LLM === "true";

  let providerName = "Simulated Mock LLM";
  if (!forceMock) {
    if (openrouterKey) providerName = `OpenRouter (${DEFAULT_MODEL})`;
    else if (openaiKey) providerName = "OpenAI API";
  }

  res.json({
    status: dbStatus.ok ? "healthy" : "degraded",
    database: {
      provider: "Neon DB (Serverless PostgreSQL)",
      connected: dbStatus.ok,
      message: dbStatus.message,
    },
    llm: {
      provider: providerName,
      model: DEFAULT_MODEL,
      mode: !forceMock && (openrouterKey || openaiKey) ? "live" : "mock_simulation",
    },
    timestamp: new Date().toISOString(),
  });
});

// Session routes
apiRouter.get("/sessions", getSessions);
apiRouter.post("/sessions", createSession);
apiRouter.get("/sessions/:id", getSessionById);
apiRouter.patch("/sessions/:id/config", updateSessionConfig);
apiRouter.delete("/sessions/:id", deleteSession);

// Chat messages route
apiRouter.post("/sessions/:id/messages", sendMessage);
