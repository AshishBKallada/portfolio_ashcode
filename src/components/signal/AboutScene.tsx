"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { DissolvePainting } from "./DissolvePainting";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * About's pinned scene: the page cream filling the screen and the courier on
 * horseback set large in the bottom-right corner, the text in ink
 * over it. Pinned over the hero, the cream erodes in from the bottom up along a
 * torn, glowing edge (DissolvePainting, clear where it hasn't arrived), so
 * "Obsession beats Talent" dissolves away above it; `track` is the element
 * whose rise drives that (the chapter's title screen). The figure fades in with
 * it, then rises and swells across the section's pass as the content scrolls over it.
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

  const figureScale = useTransform(p, [0, 1], [0.94, 1.08]);
  const figureY = useTransform(p, [0, 1], ["10%", "-4%"]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      <div className="absolute inset-0 [&:has(canvas[data-ready=true])>.paint-fallback]:invisible">
        {/* Plain cream until the shader is drawing (or without WebGL / with reduced motion). */}
        <div className="paint-fallback absolute inset-0 bg-background" />
        <DissolvePainting solid="--background" ground="--theme-night" track={track} className="absolute inset-0 h-full w-full" />
      </div>
      <motion.div
        style={reduce ? undefined : { scale: figureScale, y: figureY, opacity: figureIn }}
        className="absolute right-0 bottom-0 origin-bottom-right will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about/about-rider.webp"
          alt=""
          width={1376}
          height={768}
          loading="lazy"
          className="block h-auto w-[min(150vw,1500px)] max-w-none select-none [filter:drop-shadow(0_30px_60px_rgba(0,0,0,0.22))] md:w-[min(82vw,1500px)]"
        />
      </motion.div>
    </div>
  );
}
