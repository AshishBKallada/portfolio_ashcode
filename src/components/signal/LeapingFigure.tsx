"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef } from "react";

const SRC = "/images/about/courier-leap.webp";
const W = 944;
const H = 1131;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => v * v * (3 - 2 * v);

/**
 * The courier mid-leap, scroll-linked: leaps in from the bottom left as its
 * spot comes up, rests in the empty space beside the heading, then carries on
 * up and out to the top right, the way it's facing. Only transform and
 * opacity animate; with reduced motion it just sits at rest. Desktop only,
 * where that space beside the heading is free.
 */
export function LeapingFigure({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // In as its spot climbs the lower screen, at rest while the heading is in
  // view (box top ≈ 65% down to just above the top), then up and out.
  const enter = useTransform(p, (v) => ease(clamp01(v / 0.28)));
  const exit = useTransform(p, (v) => ease(clamp01((v - 0.84) / 0.16)));
  // In viewport units, so the server and client render the same start position.
  const x = useTransform([enter, exit], ([a, b]: number[]) => `${(1 - a) * -45 + b * 50}vw`);
  const y = useTransform([enter, exit], ([a, b]: number[]) => `${(1 - a) * 28 - b * 42}vh`);
  const rotate = useTransform([enter, exit], ([a, b]: number[]) => (1 - a) * -12 + b * 14);
  // A function transform, so the fade isn't handed to the browser's scroll timeline.
  const opacity = useTransform([enter, exit], ([a, b]: number[]) => clamp01(a * 1.4) * (1 - clamp01((b - 0.55) / 0.45)));

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none hidden md:block ${className}`}>
      <motion.img
        src={SRC}
        alt=""
        width={W}
        height={H}
        loading="lazy"
        draggable={false}
        style={reduce ? undefined : { x, y, rotate, opacity }}
        className="h-auto w-full select-none will-change-transform [filter:drop-shadow(0_30px_40px_rgba(26,5,5,0.22))]"
      />
    </div>
  );
}

/**
 * The same courier, still and large, for a pinned backdrop (Chapter's
 * `backdrop`): across its section's scroll it drifts up and turns a little,
 * slower than the panel rising over it, so it reads as a layer of its own.
 */
export function PinnedCourier({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const section = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  // The image is pinned, so the section it's pinned in drives the scroll; found before useScroll subscribes.
  useLayoutEffect(() => {
    section.current = ref.current?.closest("section") ?? null;
  }, []);
  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });
  const y = useTransform(p, [0, 1], ["10svh", "-6svh"]);
  const rotate = useTransform(p, [0, 1], [-3, 3]);
  const scale = useTransform(p, [0, 1], [1.04, 0.98]);

  return (
    <motion.img
      ref={ref}
      src={SRC}
      alt=""
      width={W}
      height={H}
      loading="lazy"
      draggable={false}
      style={reduce ? undefined : { y, rotate, scale }}
      className={`select-none will-change-transform ${className}`}
    />
  );
}
