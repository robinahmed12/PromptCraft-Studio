import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" && "border-transparent bg-[#6366F1] text-[#F8FAFC]",
        variant === "secondary" && "border-[#334155] bg-[#1E293B] text-[#94A3B8]",
        variant === "outline" && "border-[#334155] text-[#94A3B8]",
        variant === "success" && "border-emerald-500/30 bg-emerald-950/60 text-emerald-400",
        variant === "warning" && "border-amber-500/30 bg-amber-950/60 text-amber-400",
        className
      )}
      {...props}
    />
  );
}
