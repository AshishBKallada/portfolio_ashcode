"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * A layer that drifts with the cursor, as SkyHero's do: the pointer's place
 * across the screen (-1 to 1 each way) on the hero's spring, times `x` and
 * `y` px (negative moves against the cursor, so it reads as further back),
 * and `rotate` degrees with x. With `scroll`, it also drifts on its own as
 * the page scrolls, without the pointer: from `scroll` px below its place to
 * as far above across its section's pass, so nearer layers (larger values)
 * slide past further ones. Scrolling also moves it as the pointer does, by
 * the scroll's speed (on the same spring, settling back when it stops), so
 * the layers shift against each other at their hover depths as the page
 * moves, touch included. Still under reduced motion; the pointer part is off
 * on touch.
 */
export function PointerParallax({
  x,
  y,
  rotate = 0,
  scroll = 0,
  className = "absolute inset-0",
  children,
}: {
  x: number;
  y: number;
  rotate?: number;
  scroll?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement | null>(null);
  useEffect(() => {
    section.current = ref.current?.closest("section") ?? null;
  }, []);
  const { scrollY } = useScroll();
  // As ScrollZoom: 0 as the section's top meets the viewport's bottom, 1 as its foot leaves the top.
  const pass = useTransform(scrollY, () => {
    const el = section.current;
    if (!scroll || !el) return 0.5;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return clamp01((vh - r.top) / (r.height + vh));
  });
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 62, damping: 16, mass: 0.55 });
  const my = useSpring(rawY, { stiffness: 62, damping: 16, mass: 0.55 });
  const tx = useTransform(mx, (v) => v * x);
  // Scroll speed as a pointer reach, up to half again the pointer's (full at 1500px/s), nearer
  // layers lifting as the page goes down.
  const speed = useSpring(
    useTransform(useVelocity(scrollY), (v) => 1.5 * Math.max(-1, Math.min(1, v / 1500))),
    { stiffness: 62, damping: 16, mass: 0.55 },
  );
  const ty = useTransform([my, speed, pass], ([v, sv, q]: number[]) => (v - sv) * y + (1 - 2 * q) * scroll);
  const rot = useTransform([mx, speed], ([v, sv]: number[]) => (v - sv * 0.5) * rotate);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  return (
    <motion.div ref={ref} style={reduce ? undefined : { x: tx, y: ty, rotate: rot }} className={`will-change-transform ${className}`}>
      {children}
    </motion.div>
  );
}
