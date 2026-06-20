"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Variant = "word" | "line" | "fade" | "mark";

const ENTRY: Record<Variant, gsap.TweenVars> = {
  word: { yPercent: 110, opacity: 0, stagger: 0.25 },
  line: { y: 40, opacity: 0, stagger: 0.35 },
  fade: { y: 18, opacity: 0, stagger: 0.2 },
  mark: { yPercent: 100, opacity: 0 },
};

export function useScrollReveal<T extends HTMLElement>(ref: RefObject<T>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      (Object.keys(ENTRY) as Variant[]).forEach((variant) => {
        const els = root.querySelectorAll<HTMLElement>(`[data-reveal="${variant}"]`);
        if (els.length === 0) return;
        gsap.from(els, {
          ...ENTRY[variant],
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            end: "top 30%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });

      // Scrub character reveal — text dims then brightens as scroll passes through
      root.querySelectorAll<HTMLElement>('[data-reveal="char"]').forEach((el) => {
        const text = el.textContent ?? "";
        el.textContent = "";
        const spans = Array.from(text).map((ch) => {
          const span = document.createElement("span");
          span.textContent = ch;
          el.appendChild(span);
          return span;
        });
        gsap.fromTo(
          spans,
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.5,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "bottom 40%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, root);

    // After loader releases its overflow lock, layout shifts — refresh measurements
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("loader:done", refresh, { once: true });
    const safety = window.setTimeout(refresh, 4500);

    return () => {
      window.removeEventListener("loader:done", refresh);
      window.clearTimeout(safety);
      ctx.revert();
    };
  }, [ref]);
}
