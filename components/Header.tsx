"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ThemeToggle from "@/components/ThemeToggle";
import { useActiveSection } from "@/lib/useActiveSection";
import { useClock } from "@/lib/useClock";

type LenisLike = { scrollTo: (target: number | string | HTMLElement, opts?: { offset?: number }) => void };

function smoothScrollTo(target: HTMLElement | number) {
  const lenis = (typeof window !== "undefined"
    ? (window as unknown as { __lenis?: LenisLike }).__lenis
    : undefined);
  if (lenis) {
    lenis.scrollTo(target);
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

const NAV = [
  { label: "Works", target: "projects" },
  { label: "About", target: "statement" },
  { label: "Contact", target: "contact" },
];

// Whether the viewport top is still over the hero section — header inverts
// its color treatment based on this so the brand stays legible.
function useOverHero() {
  const [overHero, setOverHero] = useState(true);
  useEffect(() => {
    const measure = () => {
      const statement = document.getElementById("statement");
      if (!statement) return;
      setOverHero(statement.getBoundingClientRect().top > 72);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("loader:done", measure, { once: true });
    return () => window.removeEventListener("scroll", measure);
  }, []);
  return overHero;
}

export default function Header() {
  const innerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV.map((n) => n.target));
  const time = useClock();
  const overHero = useOverHero();

  useEffect(() => {
    const root = innerRef.current;
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
        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.3,
          stagger: 0.07,
          ease: "power3.out",
        });
      };

      const onHeroTextDone = () => runEntrance();
      window.addEventListener("hero:textDone", onHeroTextDone, { once: true });
      const safety = window.setTimeout(() => {
        window.removeEventListener("hero:textDone", onHeroTextDone);
        runEntrance();
      }, 8000);

      return () => {
        window.removeEventListener("hero:textDone", onHeroTextDone);
        window.clearTimeout(safety);
      };
    }, innerRef);
    return () => ctx.revert();
  }, []);

  const goTo = (target: string) => {
    const el = document.getElementById(target);
    if (el) smoothScrollTo(el);
    setOpen(false);
  };

  return (
    <>
    <header
      className="fixed inset-x-0 top-0 z-[9999] pointer-events-none"
      style={{ position: "fixed" }}
    >
      <div
        ref={innerRef}
        className={`w-full px-4 md:px-6 py-3 flex justify-between items-center opacity-0 -translate-y-7 transition-colors duration-500 ${
          overHero
            ? "text-black [text-shadow:0_1px_12px_rgba(255,255,255,0.65)]"
            : "text-ink"
        }`}
      >
      <button
        onClick={() => smoothScrollTo(0)}
        className="hd-brand pointer-events-auto group flex items-center gap-2.5 opacity-0 -translate-y-3"
      >
        <span
          aria-hidden
          className="relative inline-flex items-center justify-center w-5 h-5 border border-current/70 transition-transform duration-500 ease-out group-hover:rotate-45"
        >
          <span className="font-headline text-[9px] italic leading-none">A</span>
        </span>
        <span className="flex items-baseline gap-1">
          <span className="font-headline text-base italic">Ashcode</span>
          <span className="font-body text-[9px] tracking-[0.15em] opacity-50">
            / アッシュコード
          </span>
        </span>
      </button>

      <nav className="hd-item hidden md:flex items-center gap-7 pointer-events-auto opacity-0 -translate-y-3">
        {NAV.map(({ label, target }, i) => {
          const isActive = active === target;
          return (
            <button
              key={label}
              onClick={() => goTo(target)}
              className="group relative flex items-baseline gap-1.5 font-body text-[11px] uppercase tracking-[0.22em]"
            >
              <span
                aria-hidden
                className={`font-body text-[8px] tracking-normal transition-opacity ${
                  isActive ? "opacity-90" : "opacity-40"
                }`}
              >
                0{i + 1}
              </span>
              <span
                className={`relative z-[1] transition-opacity ${
                  isActive ? "opacity-100" : "opacity-90 group-hover:opacity-100"
                }`}
              >
                {label}
              </span>
              <span
                aria-hidden
                className={`pointer-events-none absolute left-0 right-0 -bottom-1 h-[1.5px] origin-left bg-current transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>
          );
        })}

        <span aria-hidden className="block w-px h-3 bg-current/30" />

        <span className="flex items-center gap-1.5 font-body text-[9px] uppercase tracking-[0.28em] opacity-70">
          <span className="relative inline-flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-current opacity-60 animate-ping" />
            <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-current" />
          </span>
          {time || "Kerala"} · IST
        </span>

        <ThemeToggle />
      </nav>

      <div className="hd-item md:hidden pointer-events-auto flex items-center gap-3 opacity-0 -translate-y-3">
        <ThemeToggle />
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      </div>

    </header>

    {open && (
      <div className={`md:hidden fixed top-[52px] inset-x-3 z-[9999] flex flex-col gap-1 p-3 rounded-md backdrop-blur ${
        overHero ? "bg-black/75 text-white" : "bg-paper/95 text-ink border border-ink/10"
      }`}>
        {NAV.map(({ label, target }, i) => (
          <button
            key={label}
            onClick={() => goTo(target)}
            className="flex items-baseline gap-2 px-2 py-2 font-body text-sm uppercase tracking-[0.22em] hover:bg-paper/10 rounded"
          >
            <span className="text-[10px] opacity-50">0{i + 1}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    )}
    </>
  );
}
