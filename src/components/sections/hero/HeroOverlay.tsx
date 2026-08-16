"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { introEase } from "@/components/motion/intro";

const CYCLE = [
  "/images/hero/1.jpg",
  "/images/hero/2.jpg",
  "/images/hero/3.jpg",
  "/images/hero/4.jpg",
  "/images/hero/bg.png",
];
const STEP_MS = 320;
const RED = "#c0392b";

export function HeroOverlay() {
  const { phase } = useHeroIntro();
  const reduce = useReducedMotion();
  const [cycleTick, setCycleTick] = useState(0);

  const cycling = phase === "loading" || phase === "cycle";
  const zoomed = phase === "zoom" || phase === "text" || phase === "done";
  const settled = phase === "done";
  const index = reduce || !cycling ? CYCLE.length - 1 : cycleTick;

  useEffect(() => {
    if (reduce || phase !== "cycle") return;
    const timers: number[] = [];
    for (let i = 1; i < CYCLE.length; i++) {
      timers.push(window.setTimeout(() => setCycleTick(i), i * STEP_MS));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [phase, reduce]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5]"
    >
      {/* Red backdrop fades out once the image starts filling the screen. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: reduce ? 0 : 1 }}
        animate={{ opacity: cycling && !reduce ? 1 : 0 }}
        transition={{ duration: 0.55, ease: introEase }}
        style={{ backgroundColor: RED }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={
            reduce
              ? { width: "100%", height: "100%", borderRadius: 0 }
              : {
                  width: "min(340px, 62vw)",
                  height: "min(200px, 36vh)",
                  borderRadius: 10,
                }
          }
          animate={
            zoomed || reduce
              ? { width: "100%", height: "100%", borderRadius: 0 }
              : {
                  width: "min(340px, 62vw)",
                  height: "min(200px, 36vh)",
                  borderRadius: 10,
                }
          }
          transition={{
            duration: reduce ? 0 : 0.9,
            ease: introEase,
          }}
          className="relative overflow-hidden will-change-[width,height]"
        >
          <AnimatePresence mode="sync" initial={false}>
            <motion.img
              key={CYCLE[index]}
              src={CYCLE[index]}
              alt=""
              draggable={false}
              initial={
                reduce
                  ? { opacity: 1, scale: 1 }
                  : cycling
                    ? { opacity: 0, scale: 1.08 }
                    : { opacity: 1, scale: 1 }
              }
              animate={{
                opacity: 1,
                scale: settled && !reduce ? 1.04 : 1,
              }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{
                opacity: { duration: cycling ? 0.18 : 0.4, ease: introEase },
                scale: {
                  duration: settled ? 6 : cycling ? 0.5 : 0.9,
                  ease: settled ? "linear" : introEase,
                },
              }}
              className="absolute inset-0 h-full w-full object-cover select-none"
              decoding="async"
              fetchPriority="high"
            />
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
