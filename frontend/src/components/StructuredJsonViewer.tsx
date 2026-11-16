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
    <div className="rounded-xl overflow-hidden border border-[#334155] bg-[#111827] text-xs font-mono my-2.5 shadow-md">
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#1E293B] border-b border-[#334155] text-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#6366F1]" />
          <span className="font-semibold text-xs tracking-wider uppercase text-[#F8FAFC]">
            Structured JSON Response
          </span>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-[11px] border-[#334155] bg-[#111827] hover:bg-[#334155] text-[#F8FAFC] gap-1"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#6366F1]" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <div className="p-3.5 overflow-x-auto max-h-96 leading-relaxed text-[#F8FAFC]/90 bg-[#111827]">
        <pre>{jsonString}</pre>
      </div>
    </div>
  );
}
