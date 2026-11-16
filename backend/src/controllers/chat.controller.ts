import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { generateCompletion, ChatMessagePayload } from "../services/llm.service.js";

// Helper to sanitize id parameter
function getIdParam(req: Request): string {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

// POST /api/sessions/:id/messages - Send a user message and get LLM response
export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
    const sessionId = getIdParam(req);
    const { content } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      res.status(400).json({ error: "Message content cannot be empty" });
      return;
    }

    // 1. Verify session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session) {
      res.status(404).json({ error: "Conversation session not found" });
      return;
    }

    // 2. Persist user message to Neon DB
    const userMessage = await prisma.message.create({
      data: {
        sessionId,
        role: "user",
        content: content.trim(),
      },
    });

    // 3. Assemble message history for context window
    const history: ChatMessagePayload[] = (session as any).messages?.map((m: any) => ({
      role: m.role as "system" | "user" | "assistant",
      content: m.content,
    })) || [];

    // 4. Call LLM Service (OpenAI or Mock Engine)
    const llmResult = await generateCompletion(content.trim(), {
      model: session.model,
      temperature: session.temperature,
      maxTokens: session.maxTokens,
      responseFormat: session.responseFormat as "text" | "json_object",
      systemPrompt: session.systemPrompt,
      history,
    });

    // 5. Persist Assistant message with token & latency metrics
    const assistantMessage = await prisma.message.create({
      data: {
        sessionId,
        role: "assistant",
        content: llmResult.content,
        structuredData: llmResult.structuredData ?? undefined,
        promptTokens: llmResult.promptTokens,
        completionTokens: llmResult.completionTokens,
        totalTokens: llmResult.totalTokens,
        latencyMs: llmResult.latencyMs,
      },
    });

    // 6. Update session title if it is the first exchange
    const messageCount = (session as any).messages?.length ?? 0;
    if (messageCount === 0 && session.title === "New Conversation") {
      const generatedTitle = content.trim().slice(0, 32) + (content.length > 32 ? "..." : "");
      await prisma.session.update({
        where: { id: sessionId },
        data: { title: generatedTitle, updatedAt: new Date() },
      });
    } else {
      await prisma.session.update({
        where: { id: sessionId },
        data: { updatedAt: new Date() },
      });
    }

    // 7. Return assistant message and performance metrics to client
    res.json({
      userMessage,
      assistantMessage,
      metrics: {
        promptTokens: llmResult.promptTokens,
        completionTokens: llmResult.completionTokens,
        totalTokens: llmResult.totalTokens,
        latencyMs: llmResult.latencyMs,
        isMock: llmResult.isMock,
      },
    });
  } catch (error: any) {
    console.error("Error processing chat message:", error);
    res.status(500).json({ error: "Failed to process chat message", details: error?.message });
  }
}
