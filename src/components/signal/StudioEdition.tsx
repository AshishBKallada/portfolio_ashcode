"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { DissolvePainting } from "./DissolvePainting";
import { DropCap } from "./Editions";
import { frame } from "./primitives";

/** The courier at his desk: code on one side, a drawing board on the other. */
const PAINTING = {
  src: "/images/studio/studio-courier.jpg",
  width: 1040,
  height: 740,
};

const copy = {
  title: "Studio",
  lede: "Sketched by hand, shipped in code. Every product starts on paper and ends in production.",
};

/**
 * A chapter opener after the reference's: the painting pinned full bleed, a
 * huge title and a drop-cap line over it. The painting is pinned beneath the
 * end of the Index and erodes in over it from the bottom, the Index holding; the text then travels up from the bottom of the
 * frame and out of the top as you scroll. The painting stays pinned to the
 * end of the section, so what follows (children: the close and the footer
 * card) stacks over it.
 */
export function StudioEdition({ children }: { children?: ReactNode }) {
  const textRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  // Across the text's whole pass through the viewport, it rises a little faster than the page.
  const { scrollYProgress: p } = useScroll({
    target: textRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(p, [0, 1], ["25svh", "-25svh"]);
  // As the close and the footer card rise over it, the painting pushes in, drifts up and dims.
  const { scrollYProgress: close } = useScroll({
    target: closeRef,
    offset: ["start end", "end end"],
  });
  const bgScale = useTransform(close, [0, 1], [1, 1.18]);
  const bgY = useTransform(close, [0, 1], ["0%", "-6%"]);
  const bgDim = useTransform(close, [0.3, 1], [0, 0.55]);

  return (
    <section
      id="studio"
      aria-label={copy.title}
      className="relative text-cream"
    >
      <div
        aria-hidden
        // Once the shader is drawing, the plain painting and night step aside: the canvas is clear
        // where it hasn't eroded in yet, so the end of the Index shows through.
        className="pointer-events-none sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden bg-night has-[canvas[data-ready=true]]:bg-transparent"
      >
        <motion.div
          style={reduce ? undefined : { scale: bgScale, y: bgY }}
          className="absolute inset-0 will-change-transform [&:has(canvas[data-ready=true])>.paint-fallback]:invisible"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PAINTING.src}
            alt=""
            width={PAINTING.width}
            height={PAINTING.height}
            loading="lazy"
            className="paint-fallback absolute inset-0 h-full w-full object-cover object-[60%_30%] select-none"
          />
          <div className="paint-fallback absolute inset-0 bg-[linear-gradient(to_bottom,rgba(21,19,15,0.42)_0%,transparent_22%),linear-gradient(to_top,rgba(21,19,15,0.28)_0%,transparent_30%)]" />
          {/* Erodes in from the bottom over the end of the Index, as the Studio text rises. */}
          <DissolvePainting src={PAINTING.src} track="studio-text" className="absolute inset-0 h-full w-full" />
        </motion.div>
        <motion.div
          style={reduce ? undefined : { opacity: bgDim }}
          className="absolute inset-0 bg-night opacity-0"
        />
      </div>

      {/* The screen spent over the end of the Index, as the painting erodes in over it. Click-through,
          and marked dark: the rail's column shows the Index's nebula and then the painting here. */}
      <div aria-hidden data-nav-theme="dark" className="pointer-events-none h-[100svh]" />
      {/* Starts a screen down and runs a screen past, so it enters near the bottom and rises toward the close. */}
      <div id="studio-text" ref={textRef} data-nav-theme="dark" className="relative flex min-h-[140svh] items-center">
        <motion.div
          style={reduce ? undefined : { y }}
          className={`${frame} md:pl-[calc(var(--nav-sidebar-w)+1.5rem)]`}
        >
          <h2 className="font-headline text-[clamp(4.5rem,15vw,15rem)] leading-[0.88] tracking-[-0.05em] [text-shadow:0_6px_60px_rgba(0,0,0,0.35)]">
            {copy.title}
          </h2>
          <p className="mt-[clamp(2rem,6vh,4rem)] max-w-[52rem] text-[clamp(1.8rem,3.6vw,3.4rem)] leading-[1.02] text-pretty [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]">
            <DropCap>{copy.lede}</DropCap>
          </p>
        </motion.div>
      </div>

      <div ref={closeRef} className="relative">
        {children}
      </div>
    </section>
  );
}
