"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const NAV = [
  { label: "Works", target: "projects" },
  { label: "About", target: "statement" },
  { label: "Contact", target: "contact" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="pointer-events-auto flex items-center justify-center w-7 h-7 rounded-full border border-current/40 hover:border-current transition-colors"
    >
      {mounted ? (
        isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />
      ) : (
        <span className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = headerRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const brand = root.querySelectorAll(".hd-brand");
      const items = root.querySelectorAll(".hd-item");
      gsap.set(root, { y: -28, opacity: 0 });
      gsap.set(brand, { y: -12, opacity: 0 });
      gsap.set(items, { y: -12, opacity: 0 });

      const runEntrance = () => {
        gsap.to(root, { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" });
        gsap.to(brand, { y: 0, opacity: 1, duration: 0.6, delay: 0.15, ease: "power3.out" });
        gsap.to(items, { y: 0, opacity: 1, duration: 0.6, delay: 0.3, stagger: 0.07, ease: "power3.out" });
      };

      const onLoaderDone = () => runEntrance();
      window.addEventListener("loader:done", onLoaderDone, { once: true });
      const safety = window.setTimeout(() => {
        window.removeEventListener("loader:done", onLoaderDone);
        runEntrance();
      }, 4000);

      return () => {
        window.removeEventListener("loader:done", onLoaderDone);
        window.clearTimeout(safety);
      };
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full px-6 py-5 flex justify-between items-center z-50 text-white"
      style={{ mixBlendMode: "difference" }}
    >
      <button className="hd-brand pointer-events-auto flex items-baseline gap-1">
        <span className="font-headline text-xl italic">ashish</span>
        <span className="font-body text-xs uppercase tracking-[0.25em] opacity-50">/ kallada</span>
      </button>
      <nav className="hd-item hidden md:flex items-center space-x-7 pointer-events-auto">
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
        <ThemeToggle />
      </nav>
      <div className="hd-item md:hidden pointer-events-auto flex items-center gap-3">
        <ThemeToggle />
        <button aria-label="Toggle menu">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
