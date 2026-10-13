"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/** A thin flame progress bar across the top of the viewport. */
export function StoryProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
      className="fixed inset-x-0 top-0 z-[61] h-[2px] origin-left bg-flame"
    />
  );
}
