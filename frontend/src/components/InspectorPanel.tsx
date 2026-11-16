"use client";

import React, { useState } from "react";
import { Activity, Clock, Zap, ChevronRight, ChevronDown, X } from "lucide-react";
import { Session } from "../types/chat";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface InspectorPanelProps {
  session: Session | null;
  lastMetrics: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    latencyMs: number;
    isMock: boolean;
  } | null;
  onCloseMobile?: () => void;
}

export function InspectorPanel({ session, lastMetrics, onCloseMobile }: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<"metrics" | "payload" | "concepts">("metrics");
  const [expandedConcept, setExpandedConcept] = useState<string | null>("tokens");

  if (!session) return null;

  const totalSessionTokens = session.messages?.reduce((acc, m) => acc + (m.totalTokens || 0), 0) || 0;
  const estimatedCost = ((totalSessionTokens / 1_000_000) * 0.15).toFixed(6);

  return (
    <div className="w-full lg:w-80 bg-[var(--bg-sidebar)] border-l border-[var(--border-subtle)] flex flex-col h-full text-xs overflow-hidden select-none text-[var(--text-main)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-sidebar)]">
        <div className="flex items-center gap-2 font-semibold text-xs tracking-wider uppercase text-[var(--text-main)]">
          <Activity className="w-4 h-4 text-[#6366F1]" />
          <span>LLM Inspector & Telemetry</span>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 rounded hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-subtle)] bg-[var(--bg-main)] text-[11px] font-medium text-[var(--text-muted)]">
        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
            activeTab === "metrics" ? "border-[#6366F1] text-[var(--text-main)] bg-[var(--bg-chat)]/60 font-semibold" : "border-transparent hover:text-[var(--text-main)]"
          }`}
        >
          Telemetry
        </button>
        <button
          onClick={() => setActiveTab("payload")}
          className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
            activeTab === "payload" ? "border-[#6366F1] text-[var(--text-main)] bg-[var(--bg-chat)]/60 font-semibold" : "border-transparent hover:text-[var(--text-main)]"
          }`}
        >
          Payload
        </button>
        <button
          onClick={() => setActiveTab("concepts")}
          className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
            activeTab === "concepts" ? "border-[#6366F1] text-[var(--text-main)] bg-[var(--bg-chat)]/60 font-semibold" : "border-transparent hover:text-[var(--text-main)]"
          }`}
        >
          Concepts
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-sidebar)]">
        {activeTab === "metrics" && (
          <div className="space-y-4">
            {/* Last Execution Cards */}
            <div>
              <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Last Turn Performance
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Card className="bg-[var(--bg-card)] border-[var(--border-subtle)] p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[10px]">
                    <Clock className="w-3 h-3 text-[#6366F1]" />
                    <span>Latency</span>
                  </div>
                  <div className="text-base font-bold text-[var(--text-main)] font-mono">
                    {lastMetrics?.latencyMs ? `${lastMetrics.latencyMs}ms` : "--"}
                  </div>
                </Card>

                <Card className="bg-[var(--bg-card)] border-[var(--border-subtle)] p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[10px]">
                    <Zap className="w-3 h-3 text-[#6366F1]" />
                    <span>Total Tokens</span>
                  </div>
                  <div className="text-base font-bold text-[var(--text-main)] font-mono">
                    {lastMetrics?.totalTokens ?? "--"}
                  </div>
                </Card>
              </div>
            </div>

            {/* Token Consumption Breakdown */}
            <Card className="bg-[var(--bg-card)] border-[var(--border-subtle)] p-3.5 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-main)]">
                <span>Token Split (Last Request)</span>
                <Badge variant="default" className="bg-[#6366F1] text-[10px] font-mono">
                  {lastMetrics?.totalTokens || 0}
                </Badge>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Prompt (Input) Tokens:</span>
                  <span className="font-mono text-[var(--text-main)]">{lastMetrics?.promptTokens || 0}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Completion (Output) Tokens:</span>
                  <span className="font-mono text-[var(--text-main)]">{lastMetrics?.completionTokens || 0}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[var(--bg-main)] h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#6366F1] h-full"
                  style={{
                    width: `${
                      lastMetrics && lastMetrics.totalTokens > 0
                        ? (lastMetrics.promptTokens / lastMetrics.totalTokens) * 100
                        : 50
                    }%`,
                  }}
                  title="Prompt Tokens"
                />
                <div
                  className="bg-[#818CF8] h-full"
                  style={{
                    width: `${
                      lastMetrics && lastMetrics.totalTokens > 0
                        ? (lastMetrics.completionTokens / lastMetrics.totalTokens) * 100
                        : 50
                    }%`,
                  }}
                  title="Completion Tokens"
                />
              </div>
              <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]" /> Input
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#818CF8]" /> Output
                </span>
              </div>
            </Card>

            {/* Cumulative Session Metrics */}
            <Card className="bg-[var(--bg-card)] border-[var(--border-subtle)] p-3.5 space-y-2">
              <div className="text-[11px] font-semibold text-[var(--text-main)]">Cumulative Session Usage</div>
              <div className="flex justify-between text-[var(--text-muted)] text-[11px]">
                <span>Total Accumulated Tokens:</span>
                <span className="font-mono text-[#6366F1] font-semibold">{totalSessionTokens}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)] text-[11px]">
                <span>Estimated Cost (USD):</span>
                <span className="font-mono text-emerald-400 font-semibold">${estimatedCost}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)] text-[11px]">
                <span>Context Window Limit:</span>
                <span className="font-mono text-[var(--text-main)]">128,000 tokens</span>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "payload" && (
          <div className="space-y-3">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Context Assembly Sent to LLM
            </div>
            <div className="rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] p-3 font-mono text-[10px] space-y-2 max-h-96 overflow-y-auto text-[var(--text-main)]">
              <div className="text-[#6366F1] font-bold">Role: system</div>
              <div className="text-[var(--text-muted)] pl-2 border-l border-[var(--border-subtle)]">
                "{session.systemPrompt}"
              </div>

              {session.messages?.map((m, idx) => (
                <div key={m.id || idx} className="pt-2">
                  <div className={m.role === "user" ? "text-[var(--text-main)] font-bold" : "text-[#6366F1] font-bold"}>
                    Role: {m.role}
                  </div>
                  <div className="text-[var(--text-muted)] pl-2 border-l border-[var(--border-subtle)] truncate">
                    "{m.content.slice(0, 100)}{m.content.length > 100 ? "..." : ""}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "concepts" && (
          <div className="space-y-2">
            <div className="border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-card)] overflow-hidden">
              <button
                onClick={() => setExpandedConcept(expandedConcept === "tokens" ? null : "tokens")}
                className="w-full flex items-center justify-between p-2.5 text-left text-[11px] font-semibold text-[var(--text-main)] hover:text-[#6366F1]"
              >
                <span>Tokens & Tokenization</span>
                {expandedConcept === "tokens" ? <ChevronDown className="w-3.5 h-3.5 text-[#6366F1]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#6366F1]" />}
              </button>
              {expandedConcept === "tokens" && (
                <div className="p-2.5 pt-0 text-[11px] text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-subtle)]/60 mt-1">
                  LLMs split text into tokens using Byte-Pair Encoding (BPE). 1 token is ~4 chars. Pricing and context window limits are strictly determined by token volume.
                </div>
              )}
            </div>

            <div className="border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-card)] overflow-hidden">
              <button
                onClick={() => setExpandedConcept(expandedConcept === "temp" ? null : "temp")}
                className="w-full flex items-center justify-between p-2.5 text-left text-[11px] font-semibold text-[var(--text-main)] hover:text-[#6366F1]"
              >
                <span>Temperature & Softmax</span>
                {expandedConcept === "temp" ? <ChevronDown className="w-3.5 h-3.5 text-[#6366F1]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#6366F1]" />}
              </button>
              {expandedConcept === "temp" && (
                <div className="p-2.5 pt-0 text-[11px] text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-subtle)]/60 mt-1">
                  Temperature scales raw output logits before Softmax. At <code className="text-[#6366F1]">0.0</code>, it is greedy and deterministic. At <code className="text-[#6366F1]">&gt;1.0</code>, it flattens logits, boosting entropy.
                </div>
              )}
            </div>

            <div className="border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-card)] overflow-hidden">
              <button
                onClick={() => setExpandedConcept(expandedConcept === "structured" ? null : "structured")}
                className="w-full flex items-center justify-between p-2.5 text-left text-[11px] font-semibold text-[var(--text-main)] hover:text-[#6366F1]"
              >
                <span>Structured Output (JSON)</span>
                {expandedConcept === "structured" ? <ChevronDown className="w-3.5 h-3.5 text-[#6366F1]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#6366F1]" />}
              </button>
              {expandedConcept === "structured" && (
                <div className="p-2.5 pt-0 text-[11px] text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-subtle)]/60 mt-1">
                  Forces the model to emit syntax-valid JSON conforming to your prompt schema, preventing parsing exceptions in backend services.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
