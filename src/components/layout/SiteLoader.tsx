"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { introEase } from "@/components/motion/intro";
import { site } from "@/data/site";

// Floor keeps the loader on screen long enough to read; ceiling guarantees
// dismissal even if `load` or `fonts.ready` never resolve (e.g. a stalled asset).
const MIN_DISPLAY_MS = 650;
const MAX_DISPLAY_MS = 6000;

export function SiteLoader() {
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const { markLoaded } = useHeroIntro();

  useEffect(() => {
    const start = performance.now();
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      window.setTimeout(() => {
        if (cancelled) return;
        setReady(true);
        markLoaded();
      }, wait);
    };

    const waitForLoad = () =>
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") {
          resolve();
          return;
        }
        window.addEventListener("load", () => resolve(), { once: true });
      });

    const waitForFonts = () =>
      document.fonts?.ready
        ? document.fonts.ready.then(() => undefined)
        : Promise.resolve();

    Promise.all([waitForLoad(), waitForFonts()]).then(finish);

    const cap = window.setTimeout(finish, MAX_DISPLAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
    };
  }, [markLoaded]);

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="site-loader"
          className="site-loader fixed inset-0 z-[999] flex items-center justify-center bg-background"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.55, ease: introEase }}
          role="status"
          aria-live="polite"
          aria-label={`Loading ${site.name}`}
        >
          <div className="flex flex-col items-center gap-5">
            <span className="text-[0.7rem] uppercase tracking-[0.4em] text-subtle">
              Loading
            </span>
            <span className="font-serif text-4xl italic text-foreground sm:text-5xl">
              {site.name}
            </span>
            <span className="relative mt-1 block h-px w-24 overflow-hidden bg-border">
              <motion.span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1/3 bg-foreground"
                initial={{ x: "-100%" }}
                animate={reduce ? { x: "200%" } : { x: ["-100%", "300%"] }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 1.4, ease: [0.4, 0, 0.2, 1], repeat: Infinity }
                }
              />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
