"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Button } from "./ui/button";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`h-8 px-2.5 gap-1.5 rounded-xl border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-main)] text-[var(--text-main)] transition-all shadow-sm ${className || ""}`}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#6366F1]" />
      )}
      <span className="text-[11px] font-medium hidden sm:inline">
        {isDark ? "Light Mode" : "Dark Mode"}
      </span>
    </Button>
  );
}
