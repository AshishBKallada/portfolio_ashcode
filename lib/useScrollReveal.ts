"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Variant = "word" | "line" | "fade" | "mark";

const ENTRY: Record<Variant, gsap.TweenVars> = {
  word: { y: 60, opacity: 0, duration: 0.95, ease: "expo.out", stagger: 0.08 },
  line: { y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 },
  fade: { y: 12, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 },
  mark: { y: 80, opacity: 0, duration: 1.2, ease: "expo.out" },
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
          scrollTrigger: { trigger: root, start: "top 80%" },
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
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.6,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 30%",
              scrub: true,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [ref]);
}
