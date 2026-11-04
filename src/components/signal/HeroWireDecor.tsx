"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

type Props = {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  scrollY: MotionValue<number>;
  still: boolean;
  ready: boolean;
};

/**
 * Top-right wireframe cluster, sized and placed after the reference
 * (yogindersuria.live hero): two concentric circles centred near the top-right
 * corner, one thin solid and one dashed just outside it, and a square outline
 * whose top-left sits inside the circles' sweep. Everything in viewport units,
 * so it holds its framing at any size.
 */
export function HeroWireDecor({ mx, my, scrollY, still, ready }: Props) {
  const x = useTransform(mx, (v) => v * 52);
  const yPointer = useTransform(my, (v) => v * 32);
  const y = useTransform([yPointer, scrollY], ([p, s]: number[]) => p + s);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
      <motion.div
        initial={still ? false : { opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.1, delay: still ? 0 : 0.55 }}
        style={still ? undefined : { x, y }}
        className="absolute inset-0"
      >
        {/* Circles: centred at 85vw across, 15.2vh down; radii 26.4vw (solid) and 27.75vw (dashed). */}
        <svg
          viewBox="0 0 100 100"
          className="absolute top-[15.2vh] left-[85vw] h-[55.5vw] w-[55.5vw] -translate-x-1/2 -translate-y-1/2 overflow-visible text-cream"
          fill="none"
        >
          <circle cx="50" cy="50" r={(26.4 / 55.5) * 100} stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="50" cy="50" r="50" stroke="currentColor" strokeOpacity="0.65" strokeWidth="1" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* Square: 25vw on a side, its top-left at 65vw across and 30vh down. */}
        <div className="absolute top-[30vh] left-[65vw] size-[25vw] border border-cream/60" />
      </motion.div>
    </div>
  );
}
