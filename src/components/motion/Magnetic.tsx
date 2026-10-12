"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";

const spring = { stiffness: 220, damping: 16, mass: 0.4 };

/**
 * Pulls its child a share of the way toward a hovering mouse and springs it
 * back on leave. Mouse only; touch and reduced motion get a plain wrapper.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  if (reduce) return <span className={`inline-flex ${className}`}>{children}</span>;

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-flex will-change-transform ${className}`}
    >
      {children}
    </motion.span>
  );
}
