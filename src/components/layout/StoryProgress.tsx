"use client";

import { useLenis } from "lenis/react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useCallback, useEffect, useState } from "react";

// After the hero hook the page reads as four chapters, in page order.
const CHAPTERS = [
  { id: "about-me", label: "About me" },
  { id: "about", label: "Journey" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * A thin flame progress bar across the top of the viewport and a cream
 * chapter chip in the bottom-left corner ("02 / 04 — Journey"), so the long
 * scroll always says where you are.
 */
export function StoryProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const [active, setActive] = useState(-1);

  const update = useCallback(() => {
    // The About-me poster sits inside the pinned hero, so it is "current"
    // from the moment the hero starts to exit until Journey takes over.
    const mid = window.innerHeight / 2;
    let next = window.scrollY > window.innerHeight * 0.5 ? 0 : -1;
    CHAPTERS.forEach((chapter, i) => {
      if (i === 0) return;
      const el = document.getElementById(chapter.id);
      if (el && el.getBoundingClientRect().top <= mid) next = i;
    });
    setActive((prev) => (prev === next ? prev : next));
  }, []);

  const lenis = useLenis(update);
  useEffect(() => {
    // First read on the next frame, once layout has settled.
    const raf = window.requestAnimationFrame(update);
    if (!lenis) window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
    };
  }, [lenis, update]);

  const shown = Math.max(active, 0);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: reduce ? scrollYProgress : smooth }}
        className="fixed inset-x-0 top-0 z-[61] h-[2px] origin-left bg-flame"
      />
      <div
        aria-hidden
        className={`pointer-events-none fixed bottom-4 left-4 z-[60] hidden items-center gap-2 bg-cream px-2.5 py-1.5 font-sans text-[11px] leading-none font-medium tracking-[0.14em] text-brand uppercase shadow-[0_6px_24px_rgba(0,0,0,0.18)] transition-[opacity,translate] duration-300 sm:left-6 sm:bottom-6 md:flex ${
          active < 0 ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <span className="tabular-nums">
          <span className="font-semibold">{String(shown + 1).padStart(2, "0")}</span> /{" "}
          {String(CHAPTERS.length).padStart(2, "0")}
        </span>
        <span aria-hidden className="h-3 w-px bg-brand/25" />
        {CHAPTERS[shown].label}
      </div>
    </>
  );
}
