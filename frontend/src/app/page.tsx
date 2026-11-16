import React from "react";
import { Sparkles, Database, Server, Cpu } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-sm font-medium">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>NeonMind AI Assistant Scaffolding Ready</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
          AI Text Assistant
        </h1>
        <p className="text-slate-400 text-lg">
          Mastering LLM Fundamentals, Behavior Controls & Prompt Engineering
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <Database className="w-5 h-5" />
              <span>Neon DB</span>
            </div>
            <p className="text-xs text-slate-400">Serverless PostgreSQL persistence for sessions and messages.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Server className="w-5 h-5" />
              <span>Express API</span>
            </div>
            <p className="text-xs text-slate-400">TypeScript backend orchestration and context assembly.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-semibold">
              <Cpu className="w-5 h-5" />
              <span>OpenAI SDK</span>
            </div>
            <p className="text-xs text-slate-400">Chat completions, structured JSON mode, and latency metrics.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
