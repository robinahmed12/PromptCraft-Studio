import { Session, Message, SendMessageResponse, HealthResponse } from "../types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function fetchSessions(): Promise<Session[]> {
  const res = await fetch(`${API_BASE_URL}/sessions`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load sessions");
  return res.json();
}

export async function createSession(data?: Partial<Session>): Promise<Session> {
  const res = await fetch(`${API_BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data || {}),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}

export async function fetchSessionById(id: string): Promise<Session> {
  const res = await fetch(`${API_BASE_URL}/sessions/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load session details");
  return res.json();
}

export async function updateSessionConfig(id: string, config: Partial<Session>): Promise<Session> {
  const res = await fetch(`${API_BASE_URL}/sessions/${id}/config`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error("Failed to update session settings");
  return res.json();
}

export async function deleteSession(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/sessions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete session");
}

export async function postMessage(sessionId: string, content: string): Promise<SendMessageResponse> {
  const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to send message");
  }
  return res.json();
}
