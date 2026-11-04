"use client";

import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";

/**
 * Back to the top: fixed at the bottom right, just above the record player
 * (CornerPlayer) and over everything else, shown once the page has scrolled
 * a screen.
 */
export function BackToTop() {
  const lenis = useLenis();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const update = () => setShown(window.scrollY > window.innerHeight);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis) lenis.scrollTo(0, { duration: reduce ? 0 : 1.6 });
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      className={`fixed right-8 bottom-[8.5rem] z-[70] inline-flex size-12 items-center justify-center rounded-full bg-ink text-cream shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-[opacity,translate] duration-300 hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:right-12 sm:bottom-[10.5rem] ${shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <span aria-hidden className="font-headline text-[18px] leading-none">↑</span>
    </button>
  );
}
