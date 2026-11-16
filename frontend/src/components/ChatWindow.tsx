"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sliders, Bot, User, Wand2, Clock, Zap, Menu, Activity } from "lucide-react";
import { Session } from "../types/chat";
import { StructuredJsonViewer } from "./StructuredJsonViewer";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

interface ChatWindowProps {
  session: Session | null;
  onSendMessage: (content: string) => Promise<void>;
  onOpenSettings: () => void;
  isLoading: boolean;
  onOpenMobileSidebar?: () => void;
  onOpenMobileInspector?: () => void;
}

export function ChatWindow({
  session,
  onSendMessage,
  onOpenSettings,
  isLoading,
  onOpenMobileSidebar,
  onOpenMobileInspector,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || !session) return;
    const msg = input.trim();
    setInput("");
    await onSendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[var(--text-muted)] bg-[var(--bg-chat)]">
        <div className="lg:hidden absolute top-4 left-4">
          <Button variant="ghost" size="icon" onClick={onOpenMobileSidebar}>
            <Menu className="w-5 h-5 text-[var(--text-main)]" />
          </Button>
        </div>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Wand2 className="w-12 h-12 text-[#6366F1] mb-4" />
        <h2 className="text-xl font-bold text-[var(--text-main)] mb-2">Welcome to PromptCraft Studio</h2>
        <p className="text-sm max-w-md text-[var(--text-muted)]">
          Select an existing conversation from the sidebar or tap "New Conversation" to begin.
        </p>
      </div>
    );
  }

  const messages = session.messages || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-chat)] overflow-hidden text-[var(--text-main)] relative">
      {/* Top Header */}
      <div className="px-4 lg:px-6 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-header)] flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Sidebar Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileSidebar}
            className="lg:hidden h-8 w-8 text-[var(--text-muted)] hover:text-[var(--text-main)]"
            title="Open Conversations"
          >
            <Menu className="w-4 h-4" />
          </Button>

          <div className="p-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[#6366F1] shrink-0">
            <Bot className="w-4 h-4 text-[#6366F1]" />
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-xs sm:text-sm text-[var(--text-main)] truncate max-w-[140px] sm:max-w-xs md:max-w-md">
              {session.title}
            </h2>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-[var(--text-muted)] truncate">
              <span className="font-mono text-[#6366F1]">{session.model}</span>
              <span>•</span>
              <span>Temp: <strong className="text-[var(--text-main)]">{session.temperature}</strong></span>
              <span>•</span>
              <span className="font-mono">{session.responseFormat}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Dark / Light Mode Toggle */}
          {/* <ThemeToggle /> */}

          {/* Config & Persona Button */}
          <Button
            onClick={onOpenSettings}
            variant="secondary"
            size="sm"
            className="gap-1.5 bg-[var(--bg-card)] hover:bg-[var(--bg-main)] border-[var(--border-subtle)] text-[var(--text-main)]"
          >
            <Sliders className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="hidden sm:inline">Config & Persona</span>
          </Button>

          {/* Mobile Inspector Toggle */}
          <Button
            onClick={onOpenMobileInspector}
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 text-[var(--text-muted)] hover:text-[var(--text-main)]"
            title="Open Inspector"
          >
            <Activity className="w-4 h-4 text-[#6366F1]" />
          </Button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 bg-[var(--bg-chat)]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8 sm:py-12">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[#6366F1] shadow-sm">
              <Wand2 className="w-8 h-8 text-[#6366F1]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-main)]">How can I help you today?</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-md px-2 mt-1">
                Ask questions, brainstorm ideas, draft content, summarize information, or write code.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg w-full pt-2">
              <button
                onClick={() => setInput("Brainstorm 5 creative project ideas for a web application.")}
                className="p-3.5 text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[#6366F1]/50 text-xs text-[var(--text-main)] transition-all shadow-sm group"
              >
                <div className="font-medium text-[var(--text-main)] group-hover:text-[#6366F1] transition-colors">💡 Brainstorm Ideas</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Creative concepts for a web app</div>
              </button>
              <button
                onClick={() => setInput("Write a polite, professional follow-up email after a job interview.")}
                className="p-3.5 text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[#6366F1]/50 text-xs text-[var(--text-main)] transition-all shadow-sm group"
              >
                <div className="font-medium text-[var(--text-main)] group-hover:text-[#6366F1] transition-colors">✍️ Help Me Write</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Professional email or cover letter</div>
              </button>
              <button
                onClick={() => setInput("Explain quantum computing in simple terms using an everyday analogy.")}
                className="p-3.5 text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[#6366F1]/50 text-xs text-[var(--text-main)] transition-all shadow-sm group"
              >
                <div className="font-medium text-[var(--text-main)] group-hover:text-[#6366F1] transition-colors">🔍 Explain a Concept</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Simple analogies for complex topics</div>
              </button>
              <button
                onClick={() => setInput("Write a clean TypeScript function to debounce an API call.")}
                className="p-3.5 text-left rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-[#6366F1]/50 text-xs text-[var(--text-main)] transition-all shadow-sm group"
              >
                <div className="font-medium text-[var(--text-main)] group-hover:text-[#6366F1] transition-colors">💻 Code & Debug</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Write, debug, or optimize code</div>
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex gap-2.5 sm:gap-3 max-w-3xl ${isUser ? "ml-auto justify-end" : "mr-auto justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[#6366F1] shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4 text-[#6366F1]" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-3.5 sm:p-4 text-xs leading-relaxed max-w-[85vw] sm:max-w-xl md:max-w-2xl shadow-sm ${
                    isUser
                      ? "bg-[var(--bg-user-msg)] text-white font-medium rounded-br-none shadow-md shadow-indigo-950/40"
                      : "bg-[var(--bg-ai-msg)] border border-[var(--border-subtle)] text-[var(--text-main)] rounded-bl-none"
                  }`}
                >
                  {/* Clean Formatted Text like ChatGPT (no raw markdown hashes/asterisks) */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  ) : (
                    <MarkdownRenderer content={message.content} />
                  )}

                  {/* Show Structured JSON Viewer only when data is present */}
                  {message.structuredData && (
                    <StructuredJsonViewer data={message.structuredData} />
                  )}

                  {!isUser && (message.totalTokens > 0 || message.latencyMs > 0) && (
                    <div className="mt-3 pt-2 border-t border-[var(--border-subtle)]/60 flex flex-wrap items-center gap-3 text-[10px] text-[var(--text-muted)] font-mono">
                      {message.latencyMs > 0 && (
                        <span className="flex items-center gap-1 text-[#6366F1]">
                          <Clock className="w-3 h-3 text-[#6366F1]" />
                          <span>{message.latencyMs}ms</span>
                        </span>
                      )}
                      {message.totalTokens > 0 && (
                        <span className="flex items-center gap-1 text-[var(--text-main)]">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>{message.totalTokens} tokens ({message.promptTokens} in / {message.completionTokens} out)</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#4F46E5]/40 border border-[#6366F1] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-2.5 sm:gap-3 mr-auto items-center text-[var(--text-muted)] text-xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[#6366F1] shrink-0 shadow-sm animate-pulse">
              <Bot className="w-4 h-4 text-[#6366F1]" />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-[var(--text-main)] ml-1">Computing LLM response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-input-bar)] shrink-0">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
            placeholder="Type your prompt here... (Press Enter to send, Shift+Enter for new line)"
            className="w-full bg-[var(--bg-input-box)] border border-[var(--border-subtle)] rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-[var(--text-main)] text-xs focus:outline-none focus:border-[#6366F1] transition-colors resize-none placeholder:text-[var(--text-muted)]/60 min-h-[42px] max-h-32"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-[42px] px-3.5 sm:px-4 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
