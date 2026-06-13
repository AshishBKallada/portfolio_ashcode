"use client";

import { Menu } from "lucide-react";

const NAV = [
  { label: "Works", target: "projects" },
  { label: "About", target: "statement" },
  { label: "Contact", target: "contact" },
];

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
      <nav className="hidden md:flex items-center space-x-7 pointer-events-auto">
        {NAV.map(({ label, target }) => (
          <button
            key={label}
            onClick={() =>
              document.getElementById(target)?.scrollIntoView({ behavior: "smooth" })
            }
            className="group relative font-body text-xs uppercase tracking-[0.2em]"
          >
            <span className="relative z-[1] transition-opacity group-hover:opacity-80">
              {label}
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 -bottom-1 h-[1.5px] origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100 bg-current"
            />
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
