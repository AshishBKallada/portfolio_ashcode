"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type UseScrollOptions,
} from "motion/react";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Pixels of drift either side of rest; positive lags, negative leads. */
  speed?: number;
  /** Explicit [from, to] in px, used instead of speed. */
  y?: [number, number];
  offset?: UseScrollOptions["offset"];
};

// Scroll-linked vertical drift. Layers with different speeds separate in
// depth as their section passes through the viewport. Transform-only, so it
// stays on the compositor.
export function Parallax({
  children,
  className,
  speed = 60,
  y,
  offset = ["start end", "end start"],
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const range = y ?? [speed, -speed];
  const translate = useTransform(scrollYProgress, [0, 1], range);

  return (
    <motion.div
      ref={ref}
      style={reduce ? undefined : { y: translate }}
      className={`will-change-transform ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
