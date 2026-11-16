"use client";

import React from "react";
import { MessageSquare, Plus, Trash2, Database, Wand2 } from "lucide-react";
import { Session, HealthResponse } from "../types/chat";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./ThemeToggle";

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
    <aside className="w-full lg:w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col h-full select-none text-[var(--text-main)]">
      {/* Brand Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-sidebar)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#6366F1] text-white shadow-md shadow-indigo-950/60">
            <Wand2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-[var(--text-main)]">PromptCraft</h1>
            <p className="text-[11px] text-[var(--text-muted)]">AI Studio & Assistant</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={handleNew}
          className="w-full flex items-center justify-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold h-10 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          Conversations ({sessions.length})
        </div>

        {sessions.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-[var(--text-muted)]">
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
                    ? "bg-[var(--bg-chat)] text-[var(--text-main)] font-semibold border border-[#6366F1]/50 shadow-sm"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-chat)]/60 hover:text-[var(--text-main)]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare
                    className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#6366F1]" : "text-[var(--text-muted)]"}`}
                  />
                  <span className="truncate">{session.title || "Untitled Chat"}</span>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="p-1 rounded hover:bg-rose-950/60 text-[var(--text-muted)] hover:text-rose-400 transition-colors"
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

      {/* Footer: Theme Toggle & Neon DB */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-main)] space-y-2.5 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
            Theme
          </span>
          <ThemeToggle />
        </div>

        {/* <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]/40">
          <div className="flex items-center gap-1.5 text-[var(--text-main)] font-medium">
            <Database className="w-3 h-3 text-[#6366F1]" />
            <span>Neon DB</span>
          </div>
          <Badge
            variant={health?.database?.connected ? "success" : "warning"}
            className="text-[9px] gap-1 px-1.5 py-0.5"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                health?.database?.connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            {health?.database?.connected ? "Live" : "Connecting"}
          </Badge>
        </div> */}
      </div>
    </aside>
  );
}
