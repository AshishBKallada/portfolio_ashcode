"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ThemeToggle from "@/components/ThemeToggle";
import { useActiveSection } from "@/lib/useActiveSection";
import { useScrollVisibility } from "@/lib/useScrollVisibility";
import { NAV_ITEMS, SITE } from "@/lib/constants/site";

type LenisLike = { scrollTo: (target: number | string | HTMLElement, opts?: { offset?: number }) => void };

const HEADER_NAV = [
  { label: "Home", target: "hero" },
  ...NAV_ITEMS,
] as const;

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

export default function Header() {
  const innerRef = useRef<HTMLDivElement>(null);
  const active = useActiveSection(NAV_ITEMS.map((n) => n.target));
  const scrollVisible = useScrollVisibility();

  const headerTone = "text-ink transition-colors duration-500";

  useEffect(() => {
    const root = innerRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const brand = root.querySelectorAll(".hd-brand");
      const navItems = root.querySelectorAll(".hd-nav-item");
      const rail = root.querySelectorAll(".hd-rail");

      gsap.set(root, { y: -24, opacity: 0 });
      gsap.set([brand, navItems, rail], { y: -12, opacity: 0 });

      const runEntrance = () => {
        gsap.to(root, { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" });
        gsap.to(brand, { y: 0, opacity: 1, duration: 0.6, delay: 0.12, ease: "power3.out" });
        gsap.to(navItems, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          delay: 0.22,
          stagger: 0.06,
          ease: "power3.out",
        });
        gsap.to(rail, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          delay: 0.35,
          stagger: 0.08,
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
    if (target === "hero") {
      smoothScrollTo(0);
      return;
    }
    const el = document.getElementById(target);
    if (el) smoothScrollTo(el);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9999] pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
        scrollVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        ref={innerRef}
        className={`relative w-full min-h-[7.5rem] md:min-h-[9rem] px-4 md:px-8 lg:px-10 py-5 md:py-7 opacity-0 ${headerTone}`}
      >
        {/* Brand — far left */}
        <button
          type="button"
          onClick={() => smoothScrollTo(0)}
          className="hd-brand pointer-events-auto absolute top-5 md:top-7 left-4 md:left-8 lg:left-10 group flex items-center gap-2.5 opacity-0 -translate-y-3"
        >
          <span
            aria-hidden
            className="relative inline-flex items-center justify-center w-5 h-5 border border-current/70 transition-transform duration-500 ease-out group-hover:rotate-45"
          >
            <span className="font-headline text-[9px] italic leading-none">A</span>
          </span>
          <span className="flex items-baseline gap-1">
            <span className="font-headline text-lg md:text-xl italic tracking-tight">{SITE.brand}</span>
            <span className="hidden sm:inline font-body text-[9px] tracking-[0.15em] opacity-50">
              / {SITE.brandJp}
            </span>
          </span>
        </button>

        {/* Vertical nav — ~3/4 across the screen */}
        <nav
          aria-label="Site navigation"
          className="pointer-events-auto absolute top-5 md:top-7 left-[56%] sm:left-[60%] md:left-[66%] lg:left-[72%] flex flex-col items-start gap-1"
        >
          {HEADER_NAV.map(({ label, target }) => {
            const isActive =
              target === "hero" ? active === null : active === target;
            return (
              <button
                key={target}
                type="button"
                onClick={() => goTo(target)}
                className="hd-nav-item group relative text-left font-body text-[11px] md:text-xs font-semibold tracking-normal leading-snug opacity-0 -translate-y-3 transition-opacity"
              >
                <span
                  className={`relative inline-block transition-opacity ${
                    isActive ? "opacity-100" : "opacity-75 group-hover:opacity-100"
                  }`}
                >
                  {label}
                </span>
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-0 right-0 -bottom-px h-px origin-left bg-current transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="pointer-events-auto absolute top-5 md:top-7 right-4 md:right-8 lg:right-10">
          <div className="hd-rail opacity-0 -translate-y-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
