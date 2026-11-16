"use client";

import React from "react";
import { MessageSquare, Plus, Trash2, Database, Sparkles, Server } from "lucide-react";
import { Session, HealthResponse } from "../types/chat";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  health: HealthResponse | null;
  onCloseMobile?: () => void;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  health,
  onCloseMobile,
}: SidebarProps) {
  const handleSelect = (id: string) => {
    onSelectSession(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleNew = () => {
    onNewSession();
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-full lg:w-72 bg-[#111827] border-r border-[#334155] flex flex-col h-full select-none text-[#F8FAFC]">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#334155] flex items-center justify-between bg-[#111827]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#6366F1] text-[#F8FAFC] shadow-md shadow-indigo-950/60">
            <Sparkles className="w-4 h-4 text-[#F8FAFC]" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-[#F8FAFC]">PromptCraft</h1>
            <p className="text-[11px] text-[#94A3B8]">AI Studio & Assistant</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={handleNew}
          className="w-full flex items-center justify-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] text-[#F8FAFC] font-semibold h-10 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
          Conversations ({sessions.length})
        </div>

        {sessions.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-[#94A3B8]">
            No conversations yet. Start a new chat!
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => handleSelect(session.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                  isActive
                    ? "bg-[#1E293B] text-[#F8FAFC] font-semibold border border-[#6366F1]/50 shadow-sm"
                    : "text-[#94A3B8] hover:bg-[#1E293B]/60 hover:text-[#F8FAFC]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare
                    className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#6366F1]" : "text-[#94A3B8]"}`}
                  />
                  <span className="truncate">{session.title || "Untitled Chat"}</span>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="p-1 rounded hover:bg-rose-950/60 text-[#94A3B8] hover:text-rose-400 transition-colors"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Neon DB & Backend Status Footer */}
      <div className="p-3.5 border-t border-[#334155] bg-[#0B1120] space-y-2 text-[11px]">
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#F8FAFC] font-medium">
            <Database className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>Neon DB</span>
          </div>
          <Badge
            variant={health?.database?.connected ? "success" : "warning"}
            className="text-[10px] gap-1 px-2 py-0.5"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                health?.database?.connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            {health?.database?.connected ? "Connected" : "Connecting..."}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-[#94A3B8] text-[10px]">
          <span className="flex items-center gap-1.5">
            <Server className="w-3 h-3 text-[#6366F1]" />
            <span>Model:</span>
          </span>
          <span
            className="text-[#F8FAFC] font-mono truncate max-w-[140px]"
            title={health?.llm?.model || ""}
          >
            {health?.llm?.model ? "nemotron-3-550b" : "OpenRouter"}
          </span>
        </div> */}
      </div>
    </aside>
  );
}
