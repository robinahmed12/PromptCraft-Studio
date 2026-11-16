"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "left" | "right";
  className?: string;
}

export function Sheet({ open, onOpenChange, children, side = "left", className }: SheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B1120]/80 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "relative z-50 flex flex-col h-full w-[85%] max-w-xs bg-[#111827] border-[#334155] shadow-2xl transition-transform ease-in-out duration-300",
          side === "left" && "mr-auto border-r animate-in slide-in-from-left",
          side === "right" && "ml-auto border-l animate-in slide-in-from-right",
          className
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
