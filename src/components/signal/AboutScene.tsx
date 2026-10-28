"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { DissolvePainting } from "./DissolvePainting";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * About's pinned scene: the nebula filling the screen, the visor-clad figure at
 * the laptop set large in the bottom-right corner, and a scrim from the left so
 * the cream text holds over it. Pinned over the hero, it erodes in from the
 * bottom up along a torn, glowing edge (DissolvePainting, clear where it hasn't
 * arrived), so "Obsession beats Talent" dissolves away above it; `track` is the
 * element whose rise drives that (the chapter's title screen). The figure and
 * scrims fade in with it. Across the section's pass the nebula pushes in and drifts up slowly
 * while the figure, nearer, rises and swells faster, so the two part in depth
 * as the content scrolls over them.
 */
export function AboutScene({ track }: { track: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion() ?? false;

  // The scene is pinned, so progress is read off the section it's pinned in.
  useEffect(() => {
    sectionRef.current = rootRef.current?.closest("section") ?? null;
  }, []);
  const { scrollY } = useScroll();
  const p = useTransform(scrollY, () => {
    const section = sectionRef.current;
    if (!section) return 0;
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight;
    return clamp01((vh - r.top) / (r.height + vh));
  });

  // The erosion's progress: 0 as the tracked element's top meets the viewport's bottom, 1 at the top.
  const enter = useTransform(scrollY, () => {
    // Also computed while rendering on the server, where there's no document.
    const el = typeof document !== "undefined" ? document.getElementById(track) : null;
    if (!el) return 0;
    const vh = window.innerHeight;
    return clamp01((vh - el.getBoundingClientRect().top) / vh);
  });
  const figureIn = useTransform(enter, [0.45, 0.95], [0, 1]);
  const scrimIn = useTransform(enter, [0.3, 0.9], [0, 1]);

  const nebulaScale = useTransform(p, [0, 1], [1.04, 1.28]);
  const nebulaY = useTransform(p, [0, 1], ["2%", "-6%"]);
  const figureScale = useTransform(p, [0, 1], [0.94, 1.08]);
  const figureY = useTransform(p, [0, 1], ["10%", "-4%"]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      <motion.div
        style={reduce ? undefined : { scale: nebulaScale, y: nebulaY }}
        className="absolute inset-0 will-change-transform [&:has(canvas[data-ready=true])>.paint-fallback]:invisible"
      >
        {/* Plain nebula until the shader is drawing (or without WebGL / with reduced motion). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about/about-nebula.webp"
          alt=""
          width={1586}
          height={992}
          loading="lazy"
          className="paint-fallback absolute inset-0 h-full w-full object-cover select-none"
        />
        <DissolvePainting src="/images/about/about-nebula.webp" ground="--theme-night" track={track} className="absolute inset-0 h-full w-full" />
      </motion.div>
      <motion.div
        style={reduce ? undefined : { scale: figureScale, y: figureY, opacity: figureIn }}
        className="absolute right-0 bottom-0 origin-bottom-right will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about/about-visor-figure.webp"
          alt=""
          width={1586}
          height={992}
          loading="lazy"
          className="block h-auto w-[min(150vw,1500px)] max-w-none select-none [filter:drop-shadow(0_30px_60px_rgba(0,0,0,0.5))] md:w-[min(82vw,1500px)]"
        />
      </motion.div>
      <motion.div style={reduce ? undefined : { opacity: scrimIn }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,14,16,0.82)_0%,rgba(10,14,16,0.55)_45%,rgba(10,14,16,0.1)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,16,0.35)_0%,transparent_30%,transparent_70%,rgba(10,14,16,0.45)_100%)]" />
      </motion.div>
    </div>
  );
}
