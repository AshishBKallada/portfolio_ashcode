"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { site } from "@/data/site";
import { DissolvePainting } from "./DissolvePainting";
import { DropCap } from "./Editions";
import { PointerParallax } from "./PointerParallax";
import { frame } from "./primitives";
import { TrackFade } from "./TrackFade";

/** The guitar gallery: Studio's own painting. */
const PAINTING = {
  src: "/images/studio/studio-gallery.webp",
  width: 1600,
  height: 901,
};

/** The guitarist, falling through it head first: a cutout over the painting. */
const FIGURE = {
  src: "/images/studio/studio-guitarist.webp",
  width: 884,
  height: 883,
};

const contact = site.contactStatement;

/** The contact card's opener, over the gallery in Studio's place. */
const copy = {
  title: "Contact",
  lede: `${contact.lines.join(" ")} ${contact.script}.`,
};

/** A pinned painting that erodes in over what's held behind it, as the element `track` rises. */
function PinnedPainting({
  painting,
  track,
  position = "50% 50%",
  pointer = false,
}: {
  painting: { src: string; width: number; height: number };
  track: string;
  position?: string;
  pointer?: boolean;
}) {
  return (
    // Once the shader is drawing, the plain painting steps aside: the canvas is clear where it
    // hasn't eroded in yet, so what's held behind shows through.
    <div className="absolute inset-0 [&:has(canvas[data-ready=true])_.paint-fallback]:invisible">
      <PointerParallax x={pointer ? -36 : 0} y={pointer ? -24 : 0} className="absolute -inset-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={painting.src}
          alt=""
          width={painting.width}
          height={painting.height}
          loading="lazy"
          style={{ objectPosition: position }}
          className="paint-fallback absolute inset-0 h-full w-full object-cover select-none"
        />
        <div className="paint-fallback absolute inset-0 bg-[linear-gradient(to_bottom,rgba(21,19,15,0.42)_0%,transparent_22%),linear-gradient(to_top,rgba(21,19,15,0.28)_0%,transparent_30%)]" />
        <DissolvePainting src={painting.src} track={track} className="absolute inset-0 h-full w-full" />
      </PointerParallax>
    </div>
  );
}

/** The guitarist over the gallery: drifts and turns a little across Studio's pass, nearer than the painting. */
function Guitarist({ still }: { still: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(p, [0, 1], ["10svh", "-12svh"]);
  const rotate = useTransform(p, [0, 1], [-6, 5]);
  return (
    <TrackFade track="studio-text">
      <PointerParallax x={64} y={38} rotate={2.8} className="absolute inset-y-0 right-[2%] hidden items-center md:flex">
        <motion.div
          className="will-change-transform"
          animate={still ? undefined : { y: [0, -14, 0] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        >
          <motion.img
            ref={ref}
            src={FIGURE.src}
            alt=""
            width={FIGURE.width}
            height={FIGURE.height}
            loading="lazy"
            draggable={false}
            style={still ? undefined : { y, rotate }}
            className="h-[min(78svh,52vw)] w-auto select-none will-change-transform [filter:drop-shadow(0_30px_50px_rgba(0,0,0,0.4))]"
          />
        </motion.div>
      </PointerParallax>
    </TrackFade>
  );
}

/**
 * A chapter opener after the reference's: the guitar gallery pinned full bleed,
 * the guitarist falling through it, and a huge title and a drop-cap line over
 * it. The painting is pinned beneath the end of the Index and erodes in over it
 * from the bottom, the Index holding; the text then travels up from the bottom
 * of the frame as you scroll. Then the close (children: the contact + footer
 * card) scrolls up over the same painting, just below the text.
 */
export function StudioEdition({ children }: { children?: ReactNode }) {
  const textRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  // Across the text's whole pass through the viewport, it rises a little faster than the page.
  const { scrollYProgress: p } = useScroll({
    target: textRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(p, [0, 1], ["10svh", "-10svh"]);

  return (
    <section id="studio" aria-label={copy.title} className="relative text-cream">
      {/* Studio's stretch, the close in it: its painting is pinned across it all. */}
      <div className="relative">
        <div aria-hidden className="pointer-events-none sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden">
          {/* Erodes in from the bottom over the end of the Index, as the Studio text rises. */}
          <PinnedPainting painting={PAINTING} track="studio-text" pointer />
          <Guitarist still={reduce} />
        </div>

        {/* The screen spent over the end of the Index, as the painting erodes in over it. Click-through,
            and unmarked: the rail's column is still the Index's cream panel until the painting arrives,
            which the text below (marked dark) tracks as it rises. */}
        <div aria-hidden className="pointer-events-none h-[100svh]" />
        {/* A screen tall, the text at its foot so the contact card follows just below it; it rises
            toward the card as it scrolls. */}
        <div id="studio-text" ref={textRef} data-nav-theme="dark" className="relative flex min-h-[100svh] items-end pb-[clamp(4rem,12vh,8rem)]">
          <motion.div style={reduce ? undefined : { y }} className={`${frame} md:pl-[calc(var(--nav-sidebar-w)+1.5rem)]`}>
            <h2 className="font-headline text-[clamp(4.5rem,15vw,15rem)] leading-[0.88] tracking-[-0.05em] [text-shadow:0_6px_60px_rgba(0,0,0,0.35)]">
              {copy.title}
            </h2>
            <p className="mt-[clamp(2rem,6vh,4rem)] max-w-[52rem] text-[clamp(1.8rem,3.6vw,3.4rem)] leading-[1.02] text-pretty [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]">
              <DropCap>{copy.lede}</DropCap>
            </p>
          </motion.div>
        </div>
        {/* The close: the contact + footer card, over the gallery. */}
        <div className="relative">{children}</div>
      </div>
    </section>
  );
}
