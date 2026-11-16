"use client";

import React, { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";
import { Button } from "./ui/button";

interface StructuredJsonViewerProps {
  data: any;
}

export function StructuredJsonViewer({ data }: StructuredJsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = typeof data === "string" ? data : JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-mono my-2.5 shadow-md">
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--bg-main)] border-b border-[var(--border-subtle)] text-[var(--text-main)]">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#6366F1]" />
          <span className="font-semibold text-xs tracking-wider uppercase text-[var(--text-main)]">
            Structured JSON Response
          </span>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-[11px] border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-main)] text-[var(--text-main)] gap-1"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#6366F1]" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <div className="p-3.5 overflow-x-auto max-h-96 leading-relaxed text-[var(--text-main)] bg-[var(--bg-card)]">
        <pre>{jsonString}</pre>
      </div>
    </div>
  );
}
