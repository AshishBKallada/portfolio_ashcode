"use client";

import { motion, useReducedMotion } from "motion/react";
import { HERO_OVERLAY } from "@/components/sections/hero/heroIntroCycle";
import { site } from "@/data/site";

const copy = site.aboutPoster;
const red = site.navbar.bg;
const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/** Cream marker stroke that draws itself in when the poster comes into view. */
function Stroke({ d, width = 5 }: { d: string; width?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="#f4f1ea"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduce ? false : { pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
    />
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

function Badge({ className }: { className: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 200 200" className="size-full motion-safe:animate-[spin_22s_linear_infinite]" aria-hidden>
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fill="#f4f1ea" style={{ fontFamily: "var(--font-display)", fontSize: 25 }}>
          <textPath href="#badge-circle" textLength="488" lengthAdjust="spacingAndGlyphs">
            {copy.badge}
          </textPath>
        </text>
      </svg>
      <svg viewBox="0 0 100 100" className="absolute inset-[30%]" aria-hidden>
        <Stroke d="M50 12 C78 10 92 36 86 60 C80 84 46 94 26 80 C8 66 10 32 34 18 C44 12 58 14 66 20" width={6} />
        <Stroke d="M40 64 L62 34" width={6} />
      </svg>
    </div>
  );
}

function Starburst({ className }: { className: string }) {
  const points = Array.from({ length: 24 }, (_, i) => {
    const r = i % 2 ? 22 : 50;
    const a = (i / 24) * Math.PI * 2;
    return `${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points={points} fill="#f4f1ea" />
    </svg>
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

function ContactPills({ className = "" }: { className?: string }) {
  const github = site.socials.find((s) => s.label === "GitHub");
  const items = [
    { label: site.email, href: `mailto:${site.email}` },
    { label: site.location, href: null },
    ...(github ? [{ label: github.href.replace("https://", ""), href: github.href }] : []),
  ];
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[#f4f1ea] ${className}`}>
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-5">
          {i > 0 && <span aria-hidden className="hidden text-[0.9em] sm:inline">✷</span>}
          {item.href ? (
            <a
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="rounded-full border border-[#f4f1ea]/80 px-3 py-0.5 transition-colors hover:bg-[#f4f1ea] hover:text-[#6b1414]"
            >
              {item.label}
            </a>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

// Grungy "about me" poster on red: a tilted polaroid with captions and
// stickers, a spinning role badge, red marker strokes, a blocky HI!! with the
// bio, and contact pills underneath.
export function AboutPoster() {
  return (
    <section
      id="about-me"
      className="relative flex h-full min-h-svh flex-col overflow-hidden px-4 pt-20 pb-6 font-sans"
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
          <Badge className="absolute top-[36%] left-[1%] w-[15%] -rotate-12 aspect-square" />
          <Polaroid className="absolute top-[18%] left-[15%] w-[27%] -rotate-[6deg] text-[2.2cqw]" />
          <Starburst className="absolute top-[40%] left-[38%] w-[9%]" />

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
            <Starburst className="absolute -bottom-5 -left-6 w-16" />
          </div>
          <div className="w-full">
            <p className="font-display text-6xl leading-none text-[#f4f1ea]">HI!!</p>
            <Bio className="mt-3 text-[0.9rem] leading-snug" />
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-4">
          <p className="font-display text-xl leading-none tracking-wide text-[#f4f1ea] uppercase">{site.name}</p>
          <ContactPills className="text-[12px] sm:text-[13px]" />
        </div>
      </div>
    </section>
  );
}
