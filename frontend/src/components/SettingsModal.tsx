"use client";

import React, { useState } from "react";
import { Sliders, X, Check } from "lucide-react";
import { Session } from "../types/chat";
import { Button } from "./ui/button";

interface SettingsModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedConfig: Partial<Session>) => void;
}

const PRESETS = [
  {
    name: "Helpful General Assistant",
    prompt: "You are a friendly, highly intelligent, and helpful AI assistant. Provide clear, direct, and well-structured answers.",
    temp: 0.7,
    format: "text" as const,
  },
  {
    name: "Strict Code Reviewer",
    prompt: "You are a principal software engineer. Review code with extreme attention to detail, performance, security, and edge cases. Offer concrete refactored snippets.",
    temp: 0.2,
    format: "text" as const,
  },
  {
    name: "Socratic AI Tutor",
    prompt: "You are an AI learning mentor. Do not just hand out answers directly. Guide the student by asking thoughtful questions and breaking complex ideas into bite-sized concepts.",
    temp: 0.6,
    format: "text" as const,
  },
  {
    name: "Structured JSON Extractor",
    prompt: "You are a structured data extractor. You must analyze the user input and produce clean, valid JSON with fields: status, analysis, keyThemes, insights, and confidenceScore.",
    temp: 0.1,
    format: "json_object" as const,
  },
];

export function SettingsModal({ session, isOpen, onClose, onSave }: SettingsModalProps) {
  if (!isOpen || !session) return null;

  const [systemPrompt, setSystemPrompt] = useState(session.systemPrompt);
  const [temperature, setTemperature] = useState(session.temperature);
  const [model, setModel] = useState(session.model);
  const [responseFormat, setResponseFormat] = useState<"text" | "json_object">(session.responseFormat);

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setSystemPrompt(preset.prompt);
    setTemperature(preset.temp);
    setResponseFormat(preset.format);
  };

  const handleSave = () => {
    onSave({
      systemPrompt,
      temperature,
      model,
      responseFormat,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120]/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#111827] border border-[#334155] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh] text-[#F8FAFC]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#334155] bg-[#1E293B]">
          <div className="flex items-center gap-2 text-[#6366F1] font-semibold text-sm">
            <Sliders className="w-4 h-4 text-[#6366F1]" />
            <span className="text-[#F8FAFC]">LLM Controls & Prompt Engineering</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto text-xs bg-[#111827]">
          {/* Quick Presets */}
          <div>
            <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              System Instruction Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-3 py-2.5 rounded-xl border border-[#334155] bg-[#1E293B]/60 hover:bg-[#1E293B] hover:border-[#6366F1]/50 text-left text-[#F8FAFC] transition-all text-xs"
                >
                  <div className="font-semibold text-[#6366F1] text-[11px]">{p.name}</div>
                  <div className="text-[10px] text-[#94A3B8] truncate">Temp: {p.temp} | {p.format}</div>
                </button>
              ))}
            </div>
          </div>

          {/* System Instructions Editor */}
          <div>
            <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              System Prompt (Persona & Constraints)
            </label>
            <textarea
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-[#0B1120] border border-[#334155] rounded-xl p-3 text-[#F8FAFC] text-xs focus:outline-none focus:border-[#6366F1] transition-colors leading-relaxed placeholder:text-[#94A3B8]/40"
              placeholder="Enter system prompt here..."
            />
            <p className="text-[10px] text-[#94A3B8] mt-1">
              Steers persona tone, reasoning depth, and output formatting.
            </p>
          </div>

          {/* Hyperparameters: Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Temperature: <span className="text-[#6366F1] font-mono text-xs">{temperature.toFixed(2)}</span>
              </label>
              <span className="text-[10px] text-[#94A3B8] font-medium">
                {temperature < 0.3 ? "Deterministic" : temperature > 1.0 ? "High Entropy / Creative" : "Balanced"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-[#6366F1] h-1.5 bg-[#1E293B] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#94A3B8] font-mono">
              <span>0.0 (Greedy / Precise)</span>
              <span>1.0 (Standard)</span>
              <span>2.0 (High Entropy)</span>
            </div>
          </div>

          {/* Model & Response Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#0B1120] border border-[#334155] rounded-xl p-2.5 text-[#F8FAFC] text-xs focus:outline-none focus:border-[#6366F1] font-mono"
              >
                <option value="nvidia/nemotron-3-ultra-550b-a55b:free">nvidia/nemotron-3-ultra-550b-a55b:free (Active OpenRouter)</option>
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-4o">gpt-4o</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Response Format
              </label>
              <select
                value={responseFormat}
                onChange={(e) => setResponseFormat(e.target.value as "text" | "json_object")}
                className="w-full bg-[#0B1120] border border-[#334155] rounded-xl p-2.5 text-[#F8FAFC] text-xs focus:outline-none focus:border-[#6366F1] font-mono"
              >
                <option value="text">text (Standard Markdown)</option>
                <option value="json_object">json_object (Structured JSON)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#1E293B] border-t border-[#334155] flex items-center justify-end gap-2.5">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-[#F8FAFC] font-semibold text-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Changes</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
