"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * A pinned background's parallax: across the pass of the section it's pinned
 * in, it pushes in slowly and drifts up, so the content scrolling over it
 * reads as nearer.
 */
export function ScrollZoom({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  // Pinned, so progress is read off the section it's pinned in.
  useEffect(() => {
    section.current = ref.current?.closest("section") ?? null;
  }, []);
  const { scrollY } = useScroll();
  const p = useTransform(scrollY, () => {
    const el = section.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return clamp01((vh - r.top) / (r.height + vh));
  });
  const scale = useTransform(p, [0, 1], [1.02, 1.3]);
  const y = useTransform(p, [0, 1], ["3%", "-7%"]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { scale, y }} className="absolute inset-0 will-change-transform">
      {children}
    </motion.div>
  );
}
