"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/** The hero's runway (svh): it holds pinned for all of it but the last screen. */
export const HERO_RUNWAY_SVH = 400;
/** Of that, the screens the corridor's camera travels before the sections start to rise. */
export const HERO_TRAVEL_SVH = 200;

/**
 * The home page's frame, one vertical page at every width. The hero pins to the screen
 * for a long runway while its camera travels; then the sections rise up over it like a
 * sheet laid on top, the hero sinking back and dimming beneath them until it's covered.
 */
export function HomeLayout({
  hero,
  children,
  runwaySvh = HERO_RUNWAY_SVH,
  travelSvh = HERO_TRAVEL_SVH,
  seam,
}: {
  hero: ReactNode;
  children: ReactNode;
  /** A hero that needs a longer pin passes its own runway and travel. */
  runwaySvh?: number;
  travelSvh?: number;
  /** Drawn along the top edge of the rising sheet, where it meets the hero. */
  seam?: ReactNode;
}) {
  const runway = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: runway, offset: ["start start", "end end"] });
  // The sections enter at the end of the travel and cover the hero by the end of the runway.
  const enter = travelSvh / (runwaySvh - 100);
  const scale = useTransform(scrollYProgress, [enter, 1], [1, 0.94]);
  const shade = useTransform(scrollYProgress, [enter, 1], [0, 0.42]);

  return (
    <>
      <div ref={runway} className="relative" style={{ height: `${runwaySvh}svh` }}>
        <motion.div
          style={reduce ? undefined : { scale }}
          className="sticky top-0 h-[100svh] overflow-hidden will-change-transform"
        >
          {hero}
          <motion.div
            aria-hidden
            style={{ opacity: reduce ? 0 : shade }}
            className="pointer-events-none absolute inset-0 bg-black"
          />
        </motion.div>
      </div>
      {/* Pulled up a screen so it slides over the still-pinned hero. */}
      <div className="relative z-10 -mt-[100svh] bg-background text-ink">
        {seam}
        {children}
      </div>
    </>
  );
}
