"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef } from "react";

const W = 1440;
const H = 120;

/** Small seeded PRNG so the tear is the same on server and client. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A ragged line across the strip: slow swells, then a fine jitter on top. */
function tearLine(seed: number) {
  const r = rng(seed);
  const a = r() * Math.PI * 2;
  const b = r() * Math.PI * 2;
  const pts: [number, number][] = [];
  for (let x = 0; x <= W; x += 10) {
    const swell = Math.sin(x / 210 + a) * 16 + Math.sin(x / 83 + b) * 9;
    const y = H * 0.55 + swell + (r() - 0.5) * 9;
    pts.push([x, y]);
  }
  return pts;
}

function fillBelow(pts: [number, number][], lift: (i: number) => number) {
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${(y - lift(i)).toFixed(1)}`).join(" ");
  return `${line} L${W} ${H} L0 ${H} Z`;
}

/**
 * Torn-paper seam: sits on top of a section (absolute, bottom-full) and fills
 * with the page background, so the section reads as a sheet torn across. A
 * white fibrous rim shows along the tear. When it scrolls into view the tear
 * rips across left to right and its fibres settle.
 */
export function TornEdge({ seed = 7, className = "" }: { seed?: number; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pts = tearLine(seed);
  const r = rng(seed * 31);
  const rimLift = pts.map(() => 4 + r() * 7);
  const paper = fillBelow(pts, () => 0);
  const rim = fillBelow(pts, (i) => rimLift[i]);

  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion() ?? false;
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    if (!inView || reduce) return;
    ref.current?.querySelectorAll<SVGAnimationElement>("animate").forEach((a) => a.beginElement());
  }, [inView, reduce]);

  return (
    <motion.svg
      ref={ref}
      initial={reduce ? false : { clipPath: "inset(-50% 100% -50% 0)" }}
      animate={inView || reduce ? { clipPath: "inset(-50% 0% -50% 0)" } : undefined}
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={`torn-edge pointer-events-none absolute inset-x-0 bottom-full z-[1] block h-[clamp(44px,7vw,110px)] w-full translate-y-px ${className}`}
    >
      <defs>
        {/* Fibres: high-frequency noise pushes the rim's edge into fuzz. */}
        <filter id={`${id}-fibre`} x="-2%" y="-40%" width="104%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.35" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G">
            <animate attributeName="scale" values="30;14;9" dur="1.4s" begin="indefinite" fill="freeze" />
          </feDisplacementMap>
        </filter>
        {/* The paper's edge: a gentler, more ragged displacement. */}
        <filter id={`${id}-tear`} x="-2%" y="-40%" width="104%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.5" numOctaves="4" seed={seed + 3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G">
            <animate attributeName="scale" values="18;6" dur="1.2s" begin="indefinite" fill="freeze" />
          </feDisplacementMap>
        </filter>
      </defs>
      <path d={rim} fill="#fbfaf4" filter={`url(#${id}-fibre)`} />
      <path d={paper} fill="var(--background)" filter={`url(#${id}-tear)`} />
    </motion.svg>
  );
}
