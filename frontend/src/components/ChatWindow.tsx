"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sliders, Bot, User, Sparkles, Clock, Zap, Menu, Activity } from "lucide-react";
import { Session } from "../types/chat";
import { StructuredJsonViewer } from "./StructuredJsonViewer";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#94A3B8] bg-[#1E293B]">
        <div className="lg:hidden absolute top-4 left-4">
          <Button variant="ghost" size="icon" onClick={onOpenMobileSidebar}>
            <Menu className="w-5 h-5 text-[#F8FAFC]" />
          </Button>
        </div>
        <Sparkles className="w-12 h-12 text-[#6366F1] mb-4" />
        <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">Welcome to PromptCraft Studio</h2>
        <p className="text-sm max-w-md text-[#94A3B8]">
          Select an existing conversation from the sidebar or tap "New Conversation" to begin.
        </p>
      </div>
    );
  }

  const messages = session.messages || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1E293B] overflow-hidden text-[#F8FAFC] relative">
      {/* Top Header */}
      <div className="px-4 lg:px-6 py-3 border-b border-[#334155] bg-[#1E293B] flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Sidebar Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileSidebar}
            className="lg:hidden h-8 w-8 text-[#94A3B8] hover:text-[#F8FAFC]"
            title="Open Conversations"
          >
            <Menu className="w-4 h-4" />
          </Button>

          <div className="p-2 rounded-xl bg-[#0B1120] border border-[#334155] text-[#6366F1] shrink-0">
            <Bot className="w-4 h-4 text-[#6366F1]" />
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-xs sm:text-sm text-[#F8FAFC] truncate max-w-[160px] sm:max-w-xs md:max-w-md">
              {session.title}
            </h2>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-[#94A3B8] truncate">
              <span className="font-mono text-[#6366F1]">{session.model}</span>
              <span>•</span>
              <span>Temp: <strong className="text-[#F8FAFC]">{session.temperature}</strong></span>
              <span>•</span>
              <span className="font-mono">{session.responseFormat}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Config & Persona Button */}
          <Button
            onClick={onOpenSettings}
            variant="secondary"
            size="sm"
            className="gap-1.5 bg-[#0B1120] hover:bg-[#334155] border-[#334155] text-[#F8FAFC]"
          >
            <Sliders className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="hidden sm:inline">Config & Persona</span>
          </Button>

          {/* Mobile Inspector Toggle */}
          <Button
            onClick={onOpenMobileInspector}
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 text-[#94A3B8] hover:text-[#F8FAFC]"
            title="Open Inspector"
          >
            <Activity className="w-4 h-4 text-[#6366F1]" />
          </Button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 bg-[#1E293B]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8 sm:py-12">
            <div className="p-3 rounded-2xl bg-[#0B1120] border border-[#334155] text-[#6366F1]">
              <Sparkles className="w-8 h-8 text-[#6366F1]" />
            </div>
            <h3 className="text-base font-semibold text-[#F8FAFC]">Start the conversation</h3>
            <p className="text-xs text-[#94A3B8] max-w-md px-2">
              Explore LLM fundamentals, behavior parameters, or test structured responses.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full pt-2">
              <button
                onClick={() => setInput("Explain tokens and tokenization in 2 sentences.")}
                className="p-3 text-left rounded-xl border border-[#334155] bg-[#0B1120]/70 hover:bg-[#0B1120] hover:border-[#6366F1]/50 text-xs text-[#F8FAFC] transition-all"
              >
                💡 Explain tokens and tokenization
              </button>
              <button
                onClick={() => setInput("What is the difference between temperature 0.0 and 1.5?")}
                className="p-3 text-left rounded-xl border border-[#334155] bg-[#0B1120]/70 hover:bg-[#0B1120] hover:border-[#6366F1]/50 text-xs text-[#F8FAFC] transition-all"
              >
                🌡️ Compare Temperature 0.0 vs 1.5
              </button>
              <button
                onClick={() => setInput("Extract key themes and entities from: 'Transformers use multi-head attention to process entire sequences simultaneously.'")}
                className="p-3 text-left rounded-xl border border-[#334155] bg-[#0B1120]/70 hover:bg-[#0B1120] hover:border-[#6366F1]/50 text-xs text-[#F8FAFC] transition-all"
              >
                📊 Extract key themes & entities
              </button>
              <button
                onClick={() => setInput("How does pretraining differ from fine-tuning?")}
                className="p-3 text-left rounded-xl border border-[#334155] bg-[#0B1120]/70 hover:bg-[#0B1120] hover:border-[#6366F1]/50 text-xs text-[#F8FAFC] transition-all"
              >
                🧠 Pretraining vs Fine-tuning
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
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#1F2937] border border-[#334155] flex items-center justify-center text-[#6366F1] shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4 text-[#6366F1]" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-3.5 sm:p-4 text-xs leading-relaxed max-w-[85vw] sm:max-w-xl md:max-w-2xl shadow-sm ${
                    isUser
                      ? "bg-[#4F46E5] text-[#F8FAFC] font-medium rounded-br-none shadow-md shadow-indigo-950/40"
                      : "bg-[#1F2937] border border-[#334155] text-[#F8FAFC] rounded-bl-none"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>

                  {message.structuredData && (
                    <StructuredJsonViewer data={message.structuredData} />
                  )}

                  {!isUser && (message.totalTokens > 0 || message.latencyMs > 0) && (
                    <div className="mt-3 pt-2 border-t border-[#334155]/60 flex flex-wrap items-center gap-3 text-[10px] text-[#94A3B8] font-mono">
                      {message.latencyMs > 0 && (
                        <span className="flex items-center gap-1 text-[#6366F1]">
                          <Clock className="w-3 h-3 text-[#6366F1]" />
                          <span>{message.latencyMs}ms</span>
                        </span>
                      )}
                      {message.totalTokens > 0 && (
                        <span className="flex items-center gap-1 text-[#F8FAFC]">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>{message.totalTokens} tokens ({message.promptTokens} in / {message.completionTokens} out)</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#4F46E5]/40 border border-[#6366F1] flex items-center justify-center text-[#F8FAFC] shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-2.5 sm:gap-3 mr-auto items-center text-[#94A3B8] text-xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#1F2937] border border-[#334155] flex items-center justify-center text-[#6366F1] shrink-0 shadow-sm animate-pulse">
              <Bot className="w-4 h-4 text-[#6366F1]" />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#1F2937] border border-[#334155]">
              <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-[#F8FAFC] ml-1">Computing LLM response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-[#334155] bg-[#0B1120] shrink-0">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
            placeholder="Type your prompt here... (Press Enter to send, Shift+Enter for new line)"
            className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-[#F8FAFC] text-xs focus:outline-none focus:border-[#6366F1] transition-colors resize-none placeholder:text-[#94A3B8]/60 min-h-[42px] max-h-32"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-[42px] px-3.5 sm:px-4 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-[#F8FAFC] shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <div className="text-center text-[10px] text-[#94A3B8] mt-2 hidden sm:block">
          Connected to <strong>Neon DB PostgreSQL</strong> • Live inference via <strong>OpenRouter</strong>
        </div>
      </div>
    </div>
  );
}
