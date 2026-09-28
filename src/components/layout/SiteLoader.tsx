"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { introEase } from "@/components/motion/intro";
import {
  HERO_INTRO_CYCLE,
  HERO_INTRO_FRAME,
  HERO_OVERLAY,
  HERO_SIDE,
  HERO_INTRO_STEP_MS,
  heroIntroSequenceMs,
} from "@/components/sections/hero/heroIntroCycle";
import { DinoRun } from "@/components/layout/DinoRun";
import { setHeroHandoff } from "@/components/sections/hero/heroHandoff";

// Floor keeps the phrase on screen long enough to read; ceiling guarantees
// dismissal even if `load` or `fonts.ready` never resolve (e.g. a stalled asset).
const MIN_PHRASE_MS = 850;
const SEQUENCE_TAIL_MS = 520;
const MAX_DISPLAY_MS = 8000;

export function SiteLoader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [assetsReady, setAssetsReady] = useState(false);
  const [cycleTick, setCycleTick] = useState(0);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const { markLoaded } = useHeroIntro();
  const finishedRef = useRef(false);
  const figureRef = useRef<HTMLImageElement>(null);

  const dismiss = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const figure = figureRef.current;
    if (figure) {
      // Hand the character off to the hero; hide ours so only one is visible.
      setHeroHandoff(figure.getBoundingClientRect());
      figure.style.visibility = "hidden";
    }
    setReady(true);
    markLoaded();
  }, [markLoaded]);

  useEffect(() => {
    [...HERO_INTRO_CYCLE, HERO_INTRO_FRAME, HERO_OVERLAY, HERO_SIDE].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const start = performance.now();
    let cancelled = false;

    const finishAssets = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_PHRASE_MS - elapsed);
      window.setTimeout(() => {
        if (cancelled) return;
        setAssetsReady(true);
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

    Promise.all([waitForLoad(), waitForFonts()]).then(finishAssets);

    const cap = window.setTimeout(() => {
      if (cancelled) return;
      dismiss();
    }, MAX_DISPLAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
    };
  }, [dismiss]);

  const showSequence = assetsReady && isHome && !reduce && !ready;

  useEffect(() => {
    if (!assetsReady || ready) return;
    if (!isHome || reduce) {
      const id = window.setTimeout(dismiss, 0);
      return () => window.clearTimeout(id);
    }
  }, [assetsReady, dismiss, isHome, ready, reduce]);

  useEffect(() => {
    if (!showSequence) return;

    const timers: number[] = [];
    for (let i = 1; i < HERO_INTRO_CYCLE.length; i++) {
      timers.push(
        window.setTimeout(() => setCycleTick(i), i * HERO_INTRO_STEP_MS),
      );
    }
    timers.push(
      window.setTimeout(dismiss, heroIntroSequenceMs + SEQUENCE_TAIL_MS),
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [dismiss, showSequence]);

  const imageIndex = showSequence ? cycleTick : 0;

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="site-loader"
          className="site-loader fixed inset-0 z-[999] flex items-center justify-center bg-background"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.45, ease: introEase }}
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <motion.div
            layout
            className="flex flex-col items-center"
            transition={{
              layout: { duration: reduce ? 0 : 0.65, ease: introEase },
            }}
          >
            <AnimatePresence initial={false}>
              {showSequence && (
                <motion.div
                  key="loader-frame"
                  initial={{ opacity: 0, y: -36, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.7, ease: introEase }}
                  className="relative mb-6 w-[min(260px,52vw)]"
                >
                  <AnimatePresence mode="sync" initial={false}>
                    <motion.img
                      ref={figureRef}
                      key={HERO_INTRO_CYCLE[imageIndex]}
                      src={HERO_INTRO_CYCLE[imageIndex]}
                      alt=""
                      draggable={false}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1 }}
                      transition={{
                        opacity: { duration: 0.2, ease: introEase },
                        scale: { duration: 0.55, ease: introEase },
                      }}
                      className="block h-auto w-full select-none [backface-visibility:hidden]"
                      decoding="async"
                      fetchPriority="high"
                      width={1445}
                      height={1089}
                    />
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              layout
              className="flex flex-col items-center gap-5"
              animate={showSequence ? { y: 10, gap: 16 } : { y: 0, gap: 20 }}
              transition={{ duration: 0.65, ease: introEase }}
            >
              <motion.span
                animate={
                  showSequence
                    ? { opacity: 0.45, scale: 0.96 }
                    : { opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.5, ease: introEase }}
                className="text-[0.7rem] uppercase tracking-[0.4em] text-subtle"
              >
                Loading
              </motion.span>
              <DinoRun />
              <AnimatePresence initial={false}>
                {!showSequence && (
                  <motion.span
                    key="loader-bar"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="relative mt-1 block h-px w-24 overflow-hidden bg-border"
                  >
                    <motion.span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-1/3 bg-foreground"
                      initial={{ x: "-100%" }}
                      animate={
                        reduce ? { x: "200%" } : { x: ["-100%", "300%"] }
                      }
                      transition={
                        reduce
                          ? { duration: 0 }
                          : {
                              duration: 1.4,
                              ease: [0.4, 0, 0.2, 1],
                              repeat: Infinity,
                            }
                      }
                    />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
