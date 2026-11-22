"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * A section part's entrance: it rises a little and fades in once as it comes into view,
 * `order` steps of 75ms after its siblings. MotionProvider drops the travel under reduced
 * motion, and the content is in the markup either way.
 */
export function Reveal({
  children,
  order = 0,
  className,
}: {
  children: ReactNode;
  order?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: order * 0.075 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
