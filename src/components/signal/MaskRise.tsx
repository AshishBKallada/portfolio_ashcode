"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { introEase } from "@/lib/motion";

/**
 * Text that rises into place through a mask the first time it scrolls into
 * view. The trigger sits on the mask, not on the clipped line inside it,
 * which an observer would never see. Reduced motion is handled by the
 * MotionConfig at the root.
 */
export function MaskRise({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className="block overflow-hidden pb-[0.14em]"
    >
      <motion.span
        variants={{ hidden: { y: "105%" }, show: { y: "0%" } }}
        transition={{ duration: 1, delay, ease: introEase }}
        className="block"
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
