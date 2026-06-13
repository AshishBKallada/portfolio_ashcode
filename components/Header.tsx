"use client";

import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 w-full px-6 py-5 flex justify-between items-center z-50 text-white"
      style={{ mixBlendMode: "difference" }}
    >
      <button className="pointer-events-auto flex items-baseline gap-1">
        <span className="font-headline text-xl italic">ashish</span>
        <span className="font-body text-xs uppercase tracking-[0.25em] opacity-50">/ kallada</span>
      </button>
      <nav className="hidden md:flex items-center space-x-6 pointer-events-auto">
        {["Works", "About", "Contact"].map((label) => (
          <button
            key={label}
            onClick={() =>
              document
                .getElementById(label.toLowerCase() === "works" ? "projects" : label.toLowerCase())
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-xs hover:opacity-50 transition-opacity uppercase tracking-[0.2em] font-body"
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="md:hidden pointer-events-auto flex items-center gap-4">
        <button aria-label="Toggle menu">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
