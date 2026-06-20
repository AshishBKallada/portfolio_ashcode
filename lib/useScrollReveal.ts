"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Variant = "word" | "line" | "fade" | "mark";

const ENTRY: Record<Variant, gsap.TweenVars> = {
  word: { yPercent: 110, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.07 },
  line: { y: 36, opacity: 0, duration: 0.9, ease: "power4.out", stagger: 0.1 },
  fade: { y: 14, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.06 },
  mark: { yPercent: 100, opacity: 0, duration: 1.4, ease: "expo.out" },
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
          scrollTrigger: { trigger: root, start: "top 88%" },
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
            },
          }
        );
      });
    }, root);

    // After loader releases its overflow lock, layout may have shifted — refresh
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
