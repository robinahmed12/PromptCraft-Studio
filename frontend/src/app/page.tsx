"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";
import { SettingsModal } from "../components/SettingsModal";
import { InspectorPanel } from "../components/InspectorPanel";
import { Sheet } from "../components/ui/sheet";
import {
  fetchHealth,
  fetchSessions,
  createSession,
  fetchSessionById,
  deleteSession,
  updateSessionConfig,
  postMessage,
} from "../services/api";
import { Session, HealthResponse } from "../types/chat";

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);
  const [lastMetrics, setLastMetrics] = useState<{
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    latencyMs: number;
    isMock: boolean;
  } | null>(null);

  // Load initial health & sessions
  useEffect(() => {
    async function init() {
      try {
        const [h, sList] = await Promise.all([
          fetchHealth().catch(() => null),
          fetchSessions().catch(() => []),
        ]);
        if (h) setHealth(h);
        setSessions(sList);

        if (sList.length > 0) {
          const firstId = sList[0].id;
          setActiveSessionId(firstId);
          loadSession(firstId);
        } else {
          handleNewSession();
        }
      } catch (err) {
        console.error("Initialization error:", err);
      }
    }
    init();
  }, []);

  const loadSession = async (id: string) => {
    try {
      const fullSession = await fetchSessionById(id);
      setActiveSession(fullSession);
      setActiveSessionId(id);

      const assistantMsgs = fullSession.messages?.filter((m) => m.role === "assistant") || [];
      if (assistantMsgs.length > 0) {
        const last = assistantMsgs[assistantMsgs.length - 1];
        setLastMetrics({
          promptTokens: last.promptTokens,
          completionTokens: last.completionTokens,
          totalTokens: last.totalTokens,
          latencyMs: last.latencyMs,
          isMock: false,
        });
      }
    } catch (err) {
      console.error("Failed to load session:", err);
    }
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    loadSession(id);
    setMobileSidebarOpen(false);
  };

  const handleNewSession = async () => {
    try {
      const newSession = await createSession({
        title: "New Conversation",
        systemPrompt: "You are a helpful and knowledgeable AI assistant.",
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        temperature: 0.7,
        responseFormat: "text",
      });
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setActiveSession({ ...newSession, messages: [] });
      setLastMetrics(null);
      setMobileSidebarOpen(false);
    } catch (err) {
      console.error("Error creating session:", err);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSession(id);
      const remaining = sessions.filter((s) => s.id !== id);
      setSessions(remaining);

      if (activeSessionId === id) {
        if (remaining.length > 0) {
          setActiveSessionId(remaining[0].id);
          loadSession(remaining[0].id);
        } else {
          setActiveSessionId(null);
          setActiveSession(null);
          setLastMetrics(null);
        }
      }
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeSessionId) return;
    setIsLoading(true);

    try {
      const res = await postMessage(activeSessionId, content);

      setActiveSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...(prev.messages || []), res.userMessage, res.assistantMessage],
        };
      });

      setLastMetrics(res.metrics);

      const updatedList = await fetchSessions();
      setSessions(updatedList);
    } catch (err: any) {
      console.error("Error sending message:", err);
      alert(`Message error: ${err.message || "Failed to communicate with LLM"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async (updatedConfig: Partial<Session>) => {
    if (!activeSessionId) return;
    try {
      const updated = await updateSessionConfig(activeSessionId, updatedConfig);
      setActiveSession((prev) => (prev ? { ...prev, ...updated } : null));

      const updatedList = await fetchSessions();
      setSessions(updatedList);
    } catch (err) {
      console.error("Failed to update session settings:", err);
    }
  };

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] font-sans">
      {/* Desktop Sidebar (hidden on mobile/tablet) */}
      <div className="hidden lg:flex shrink-0 h-full">
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          health={health}
        />
      </div>

      {/* Mobile Sidebar Drawer (Sheet) */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen} side="left">
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          health={health}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </Sheet>

      {/* Main Chat Interface (Takes 100% width on mobile, fills middle on desktop) */}
      <ChatWindow
        session={activeSession}
        onSendMessage={handleSendMessage}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isLoading={isLoading}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        onOpenMobileInspector={() => setMobileInspectorOpen(true)}
      />

      {/* Desktop Inspector Panel (hidden on mobile, visible on xl screens) */}
      <div className="hidden xl:flex shrink-0 h-full">
        <InspectorPanel session={activeSession} lastMetrics={lastMetrics} />
      </div>

      {/* Mobile/Tablet Inspector Drawer (Sheet) */}
      <Sheet open={mobileInspectorOpen} onOpenChange={setMobileInspectorOpen} side="right">
        <InspectorPanel
          session={activeSession}
          lastMetrics={lastMetrics}
          onCloseMobile={() => setMobileInspectorOpen(false)}
        />
      </Sheet>

      {/* Settings & Hyperparameter Modal */}
      <SettingsModal
        session={activeSession}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveConfig}
      />
    </div>
  );
}
