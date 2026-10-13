"use client";

import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { HERO_OVERLAY } from "@/components/sections/hero/heroIntroCycle";
import { site } from "@/data/site";

const copy = site.aboutPoster;
const red = site.navbar.bg;
const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/**
 * Lets its child lean toward the cursor: a small shift and tilt, eased by
 * GSAP quickTo so it glides, without pulling the eye off the copy. Fine
 * pointers only, off with reduced motion.
 */
const FOLLOW = 0.03; // share of the cursor-to-card distance the card covers
const MAX_X = 14;
const MAX_Y = 10;

function CursorFloat({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const opts = { duration: 1.1, ease: "power3.out" };
    const x = gsap.quickTo(el, "x", opts);
    const y = gsap.quickTo(el, "y", opts);
    const r = gsap.quickTo(el, "rotation", { duration: 1.4, ease: "power3.out" });

    // Resting center, measured without the current offset.
    const home = () => {
      const b = el.getBoundingClientRect();
      const cx = Number(gsap.getProperty(el, "x")) || 0;
      const cy = Number(gsap.getProperty(el, "y")) || 0;
      return { x: b.left + b.width / 2 - cx, y: b.top + b.height / 2 - cy };
    };

    const onMove = (e: PointerEvent) => {
      const h = home();
      const dx = gsap.utils.clamp(-MAX_X, MAX_X, (e.clientX - h.x) * FOLLOW);
      const dy = gsap.utils.clamp(-MAX_Y, MAX_Y, (e.clientY - h.y) * FOLLOW);
      x(dx);
      y(dy);
      r(gsap.utils.clamp(-2.5, 2.5, dx / 6));
    };
    const onLeave = () => {
      x(0);
      y(0);
      r(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "transform" });
    };
  }, [reduce]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

function Polaroid({ className }: { className: string }) {
  return (
    <div className={`bg-[#f4f1ea] p-[0.55em] pb-[2.6em] shadow-[0_20px_40px_rgba(0,0,0,0.6)] ${className}`}>
      <div className="relative aspect-square overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_OVERLAY}
          alt={site.name}
          className="absolute top-[2%] left-[-34%] h-[150%] w-auto max-w-none contrast-125 grayscale"
        />
        <div aria-hidden className="absolute inset-0 opacity-25 mix-blend-overlay" style={{ backgroundImage: grain }} />
      </div>
      <div className="absolute inset-x-[0.7em] bottom-[0.5em] flex items-end justify-center font-script leading-none text-black">
        <span className="-rotate-3 text-[1.1em]">{copy.caption}</span>
      </div>
    </div>
  );
}

function Bio({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-[1.2em] text-[#f4f1ea] ${className}`}>
      <p>{copy.intro}</p>
      {copy.blocks.map((block) => (
        <p key={block.lead}>
          <span className="font-display text-[1.45em] leading-none uppercase">{block.lead}</span>{" "}
          {block.text}
        </p>
      ))}
    </div>
  );
}

// Grungy "about me" poster on red: a tilted polaroid that leans toward the
// cursor, and a blocky HI!! with the bio.
export function AboutPoster() {
  return (
    <section
      id="about-me"
      className="relative flex h-full min-h-svh flex-col justify-center overflow-hidden px-4 pt-20 pb-6 font-sans"
      style={{ backgroundColor: red }}
    >
      <h2 className="sr-only">
        {copy.heading}: {copy.intro}
      </h2>

      <div className="w-full">
        {/* Desktop: a poster laid out in its own coordinate space. */}
        <div
          className="@container relative mx-auto hidden aspect-[1.6] md:block"
          style={{ width: "min(94vw, calc((100svh - 14rem) * 1.6))" }}
        >
          <p className="absolute top-[3%] left-[17%] -rotate-[8deg] font-script text-[6.5cqw] leading-none text-[#f4f1ea]">
            {copy.heading}
          </p>
          <CursorFloat className="absolute top-[18%] left-[15%] z-10 w-[27%] text-[2.2cqw]">
            <Polaroid className="relative w-full -rotate-[6deg]" />
          </CursorFloat>

          <p className="absolute top-[17%] left-[53%] font-display text-[11cqw] leading-[0.8] text-[#f4f1ea]">HI!!</p>
          <p className="absolute top-[38%] left-[53%] w-[24%] text-[1.35cqw] leading-[1.25] font-medium text-[#f4f1ea]">
            {copy.intro}
          </p>
          <p className="absolute top-[52%] left-[59%] w-[24%] text-[1.35cqw] leading-[1.25] font-medium text-[#f4f1ea]">
            <span className="font-display text-[2.1cqw] leading-none uppercase">{copy.blocks[0].lead}</span>{" "}
            {copy.blocks[0].text}
          </p>
          <p className="absolute top-[70%] left-[64%] w-[22%] text-[1.35cqw] leading-[1.25] font-medium text-[#f4f1ea]">
            <span className="font-display text-[2.1cqw] leading-none uppercase">{copy.blocks[1].lead}</span>{" "}
            {copy.blocks[1].text}
          </p>
        </div>

        {/* Phones: the same pieces stacked. */}
        <div className="mx-auto flex max-w-sm flex-col items-center gap-6 md:hidden">
          <div className="relative w-[70%]">
            <Polaroid className="relative w-full -rotate-[5deg] text-[1.1rem]" />
          </div>
          <div className="w-full">
            <p className="font-display text-6xl leading-none text-[#f4f1ea]">HI!!</p>
            <Bio className="mt-3 text-[0.9rem] leading-snug" />
          </div>
        </div>
      </div>
    </section>
  );
}
