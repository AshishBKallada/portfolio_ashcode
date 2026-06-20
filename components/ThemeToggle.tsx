"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="pointer-events-auto group relative flex items-center justify-center w-6 h-6"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-current/40 transition-all duration-300 group-hover:border-current group-hover:scale-110"
      />
      {mounted ? (
        isDark ? <Sun className="w-3 h-3 relative" /> : <Moon className="w-3 h-3 relative" />
      ) : (
        <span className="w-3 h-3" />
      )}
    </button>
  );
}
