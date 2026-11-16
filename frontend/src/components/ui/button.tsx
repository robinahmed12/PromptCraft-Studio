import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          variant === "default" && "bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-sm shadow-indigo-950/50",
          variant === "secondary" && "bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-main)] border border-[var(--border-subtle)]",
          variant === "outline" && "border border-[var(--border-subtle)] bg-transparent text-[var(--text-main)] hover:bg-[var(--bg-card)]",
          variant === "ghost" && "hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)]",
          variant === "destructive" && "bg-rose-600 text-white hover:bg-rose-700",
          size === "default" && "h-9 px-4 py-2",
          size === "sm" && "h-8 rounded-md px-3 text-[11px]",
          size === "lg" && "h-10 rounded-md px-6 text-sm",
          size === "icon" && "h-9 w-9 p-0",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
