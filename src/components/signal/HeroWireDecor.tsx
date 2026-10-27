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
 * Top-right wireframe cluster — square outline with a dotted circle through it
 * (see yogindersuria.live hero).
 */
export function HeroWireDecor({ mx, my, scrollY, still, ready }: Props) {
  const x = useTransform(mx, (v) => v * 26);
  const yPointer = useTransform(my, (v) => v * 16);
  const y = useTransform([yPointer, scrollY], ([p, s]: number[]) => p + s);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
      <motion.div
        initial={still ? false : { opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.1, delay: still ? 0 : 0.55 }}
        style={still ? undefined : { x, y }}
        className="absolute top-[11%] right-[4%] h-[clamp(8.5rem,24vw,15rem)] w-[clamp(8.5rem,24vw,15rem)] sm:right-[6%] max-md:top-[9%] max-md:right-[2%] max-md:h-[6.5rem] max-md:w-[6.5rem]"
      >
        {/* Square — thin solid outline */}
        <div className="absolute inset-0 border border-cream/55" />

        {/* Dotted circle — larger, offset so the arc cuts through the square */}
        <svg
          viewBox="0 0 240 240"
          className="absolute -top-[32%] -right-[28%] h-[165%] w-[165%] text-cream/45"
          fill="none"
        >
          <circle cx="120" cy="120" r="104" stroke="currentColor" strokeWidth="1" strokeDasharray="2.5 7" />
        </svg>
      </motion.div>
    </div>
  );
}
