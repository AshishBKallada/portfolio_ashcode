"use client";

import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Reveals its children from the bottom up in step with a pinned
 * DissolvePainting tracking the same element (`track`): a soft-edged mask
 * that climbs at the painting's eroded depth, a little behind its torn edge,
 * so what sits over the painting arrives with it and not before.
 */
export function TrackFade({ track, children }: { track: string; children: ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  // Revealed height, 0–1 from the bottom: DissolvePainting's pinned depth for the same progress.
  const depth = useTransform(scrollY, () => {
    // On the server there's no document: start hidden, as the client does before the track rises.
    if (typeof document === "undefined") return 0;
    const el = document.getElementById(track);
    if (!el) return 1;
    const vh = window.innerHeight;
    const p = clamp01((vh - el.getBoundingClientRect().top) / vh);
    return clamp01(p * 1.15 - 0.1 + Math.max(0, p - 0.85) * 2);
  });
  // Trails the torn edge a touch, with a soft band where it's arriving.
  const solid = useTransform(depth, (d) => `${Math.max(0, d - 0.14) * 100}%`);
  const clear = useTransform(depth, (d) => `${Math.max(0, d - 0.04) * 100}%`);
  const mask = useMotionTemplate`linear-gradient(to top, #000 ${solid}, transparent ${clear})`;
  return (
    <motion.div style={reduce ? undefined : { maskImage: mask, WebkitMaskImage: mask }} className="absolute inset-0">
      {children}
    </motion.div>
  );
}
