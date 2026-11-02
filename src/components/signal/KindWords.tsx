"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/data/site";
import { DropCap } from "./Editions";

const words = site.signal.linkedin.kindWords;

/**
 * Where each card sits in the scatter (desktop), as the reference's floating
 * prompt cards: left and top of the field, card width, and how far it drifts
 * on scroll (nearer cards further). A card never runs past the field's right
 * edge. Below md they stack.
 */
const SPOTS = [
  { l: "38%", t: "14%", w: "24rem", d: 45 },
  { l: "66%", t: "0%", w: "21rem", d: 25 },
  { l: "4%", t: "30%", w: "22rem", d: 35 },
  { l: "58%", t: "46%", w: "23rem", d: 55 },
  { l: "26%", t: "66%", w: "21rem", d: 30 },
  { l: "72%", t: "76%", w: "19rem", d: 20 },
];

/** Faint blurred blanks between the cards, for depth: left, top, width, height. */
const GHOSTS = [
  ["10%", "8%", "7rem", "2rem"],
  ["33%", "40%", "5.5rem", "1.7rem"],
  ["52%", "6%", "8rem", "2.3rem"],
  ["88%", "30%", "6rem", "1.8rem"],
  ["2%", "64%", "8.5rem", "2.4rem"],
  ["47%", "86%", "6rem", "1.8rem"],
  ["70%", "40%", "4.5rem", "1.5rem"],
  ["18%", "88%", "7rem", "2rem"],
] as const;

/** How long each card holds the focus before the next takes it. */
const HOLD_MS = 3200;

/**
 * Kind words from LinkedIn comments and DMs, after the reference's floating
 * prompt cards: a field of them on the cream, one in focus at a time (full
 * strength, a soft glow under it), the rest faded back. The focus moves on by
 * itself while the field is on screen, and to whichever card is hovered.
 */
export function KindWords() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || hovering || !onScreen) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % words.items.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, [reduce, hovering, onScreen]);

  return (
    <div data-nav-theme="light" className="relative pt-4 pb-[clamp(2.5rem,6vh,4rem)] text-ink">
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-8 md:pr-10 md:pl-[calc(var(--nav-sidebar-w)+2.5rem)]">
        <h3 className="font-headline text-[18px] leading-[1.1] tracking-[-0.02em]">{words.heading}</h3>
        <p className="mt-2 max-w-[34rem] text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1] text-balance">
          <DropCap>{words.lede}</DropCap>
        </p>

        <div
          ref={ref}
          onPointerLeave={() => setHovering(false)}
          className="relative mt-8 flex flex-col gap-3 md:mt-4 md:block md:h-[min(30rem,62svh)]"
        >
          {GHOSTS.map(([l, t, w, h], i) => (
            <div
              key={i}
              aria-hidden
              style={{ left: l, top: t, width: w, height: h }}
              className="absolute hidden rounded-[10px] bg-white/45 blur-[3px] md:block"
            />
          ))}
          {words.items.map((item, i) => (
            <WordCard
              key={i}
              text={item.text}
              via={item.via}
              spot={SPOTS[i % SPOTS.length]}
              focused={i === active}
              p={p}
              still={reduce}
              onFocus={() => {
                setHovering(true);
                setActive(i);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WordCard({
  text,
  via,
  spot,
  focused,
  p,
  still,
  onFocus,
}: {
  text: string;
  via: "comment" | "dm";
  spot: (typeof SPOTS)[number];
  focused: boolean;
  p: MotionValue<number>;
  still: boolean;
  onFocus: () => void;
}) {
  // Drifts up as the field scrolls past, the nearer cards further, so the field has depth.
  const y = useTransform(p, [0, 1], [spot.d, -spot.d]);
  return (
    <motion.figure
      onPointerEnter={onFocus}
      style={{ "--l": spot.l, "--t": spot.t, "--w": spot.w, ...(still ? {} : { y }) } as CSSProperties}
      className={`relative m-0 md:absolute md:top-[var(--t)] md:left-[var(--l)] md:w-[min(var(--w),calc(100%-var(--l)))] ${focused ? "z-10" : "z-0"}`}
    >
      {/* The focused card's glow: warm to violet, soft, under it. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-3 rounded-[22px] bg-[linear-gradient(100deg,#f6a06b_0%,#e889c8_38%,#a58cf5_68%,#8fb8f7_100%)] blur-2xl transition-opacity duration-700 ${focused ? "opacity-60" : "opacity-0"}`}
      />
      <div
        className={`relative rounded-[12px] px-4 pt-3.5 pb-3 shadow-[0_10px_30px_rgba(40,35,20,0.08)] transition-[background-color,opacity,filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          focused ? "scale-100 bg-white opacity-100" : "scale-[0.98] bg-white/60 opacity-80 md:[filter:blur(0.4px)]"
        }`}
      >
        <blockquote
          className={`m-0 text-[clamp(0.92rem,1.05vw,1.05rem)] leading-[1.35] tracking-[-0.01em] text-pretty transition-colors duration-700 ${focused ? "text-ink" : "text-ink/30"}`}
        >
          {text}
        </blockquote>
        <figcaption className="mt-3 flex items-center justify-between">
          <span className={`flex items-center gap-1.5 text-[12px] transition-colors duration-700 ${focused ? "text-ink/60" : "text-ink/25"}`}>
            {via === "comment" ? <CommentIcon /> : <DmIcon />}
            {via === "comment" ? "LinkedIn comment" : "LinkedIn DM"}
          </span>
          <span
            aria-hidden
            className={`grid size-7 place-items-center rounded-full transition-colors duration-700 ${focused ? "bg-ink text-cream" : "bg-ink/8 text-ink/30"}`}
          >
            <HeartIcon />
          </span>
        </figcaption>
      </div>
    </motion.figure>
  );
}

function CommentIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10.5V16M8 7.8v.2M11.5 16v-3.2c0-1.4.9-2.3 2.1-2.3 1.2 0 1.9.8 1.9 2.3V16" strokeLinecap="round" />
    </svg>
  );
}

function DmIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );
}
