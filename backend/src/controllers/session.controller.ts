import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { DEFAULT_MODEL } from "../services/llm.service.js";

// Helper to sanitize id parameter
function getIdParam(req: Request): string {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

// GET /api/sessions - List all sessions
export async function getSessions(req: Request, res: Response): Promise<void> {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });
    res.json(sessions);
  } catch (error: any) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions from Neon DB" });
  }
}

// POST /api/sessions - Create new session
export async function createSession(req: Request, res: Response): Promise<void> {
  try {
    const { title, systemPrompt, model, temperature, maxTokens, responseFormat } = req.body;

    const newSession = await prisma.session.create({
      data: {
        title: title || "New Conversation",
        systemPrompt: systemPrompt || "You are a helpful and knowledgeable AI assistant.",
        model: model || DEFAULT_MODEL,
        temperature: typeof temperature === "number" ? temperature : 0.7,
        maxTokens: typeof maxTokens === "number" ? maxTokens : 1500,
        responseFormat: responseFormat || "text",
      },
    });

    res.status(201).json(newSession);
  } catch (error: any) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Failed to create session in Neon DB" });
  }
}

// GET /api/sessions/:id - Get session details and messages
export async function getSessionById(req: Request, res: Response): Promise<void> {
  try {
    const id = getIdParam(req);

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.json(session);
  } catch (error: any) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
}

// PATCH /api/sessions/:id/config - Update session configuration
export async function updateSessionConfig(req: Request, res: Response): Promise<void> {
  try {
    const id = getIdParam(req);
    const { title, systemPrompt, model, temperature, maxTokens, responseFormat } = req.body;

    const updated = await prisma.session.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(systemPrompt !== undefined && { systemPrompt }),
        ...(model !== undefined && { model }),
        ...(temperature !== undefined && { temperature }),
        ...(maxTokens !== undefined && { maxTokens }),
        ...(responseFormat !== undefined && { responseFormat }),
      },
    });

    res.json(updated);
  } catch (error: any) {
    console.error("Error updating session config:", error);
    res.status(500).json({ error: "Failed to update session configuration" });
  }
}

// DELETE /api/sessions/:id - Delete session and its messages
export async function deleteSession(req: Request, res: Response): Promise<void> {
  try {
    const id = getIdParam(req);

    await prisma.session.delete({
      where: { id },
    });

    res.json({ success: true, message: "Session deleted" });
  } catch (error: any) {
    console.error("Error deleting session:", error);
    res.status(500).json({ error: "Failed to delete session" });
  }
}
