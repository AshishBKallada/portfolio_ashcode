"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

// Floating corner button that appears once the hero is behind you and
// glides back to the top through Lenis.
export function BackToTop() {
  const [show, setShow] = useState(false);
  const last = useRef(false);

  const update = (scroll: number) => {
    const next = scroll > window.innerHeight * 1.5;
    if (next === last.current) return;
    last.current = next;
    setShow(next);
  };

  const lenis = useLenis((instance) => update(instance.scroll));

  useEffect(() => {
    if (lenis) return;
    const onScroll = () => update(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() =>
            lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" })
          }
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ color: site.navbar.bg }}
          className="fixed right-4 bottom-4 z-[60] flex size-12 items-center justify-center rounded-full bg-white shadow-[0_6px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 sm:right-6 sm:bottom-6"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
