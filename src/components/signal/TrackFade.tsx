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

/**
 * One stage of a chapter's entrance, scroll-linked to the same tracked intro as
 * TrackFade: across `from`–`to` of the intro's rise (0 as its top meets the
 * viewport's bottom, 1 as it reaches the top, 2 a screen past) its children rise `y` into place,
 * fading in too with `fade`. Stages with later ranges arrive one after another.
 */
export function TrackRise({
  track,
  from,
  to,
  y,
  fade = false,
  className = "absolute inset-0",
  children,
}: {
  track: string;
  from: number;
  to: number;
  /** How far below its place it starts, as a CSS length. */
  y: string;
  fade?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const t = useTransform(scrollY, () => {
    if (typeof document === "undefined") return 0;
    const el = document.getElementById(track);
    if (!el) return 1;
    const vh = window.innerHeight;
    const v = clamp01(((vh - el.getBoundingClientRect().top) / vh - from) / (to - from));
    return v * v * (3 - 2 * v);
  });
  const ty = useTransform(t, (v) => `calc(${1 - v} * ${y})`);
  // A function transform, so the fade isn't handed to the browser's scroll timeline.
  const opacity = useTransform(t, (v) => (fade ? v : 1));
  return (
    <motion.div style={reduce ? undefined : { y: ty, opacity }} className={`will-change-transform ${className}`}>
      {children}
    </motion.div>
  );
}
