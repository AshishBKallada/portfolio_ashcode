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
  { l: "40%", t: "16%", w: "31rem", d: 70 },
  { l: "62%", t: "2%", w: "26rem", d: 40 },
  { l: "4%", t: "34%", w: "28rem", d: 55 },
  { l: "56%", t: "50%", w: "30rem", d: 85 },
  { l: "26%", t: "70%", w: "26rem", d: 45 },
  { l: "68%", t: "80%", w: "22rem", d: 30 },
];

/** Faint blurred blanks between the cards, for depth: left, top, width, height. */
const GHOSTS = [
  ["10%", "8%", "9rem", "2.6rem"],
  ["33%", "40%", "7rem", "2.2rem"],
  ["52%", "6%", "10rem", "3rem"],
  ["88%", "30%", "8rem", "2.4rem"],
  ["2%", "64%", "11rem", "3.2rem"],
  ["47%", "86%", "8rem", "2.4rem"],
  ["70%", "40%", "6rem", "2rem"],
  ["18%", "88%", "9rem", "2.6rem"],
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
    <div data-nav-theme="light" className="relative py-[clamp(4rem,10vh,7rem)] text-ink">
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-8 md:pr-10 md:pl-[calc(var(--nav-sidebar-w)+2.5rem)]">
        <h3 className="font-headline text-[18px] leading-[1.1] tracking-[-0.02em]">{words.heading}</h3>
        <p className="mt-3 max-w-[40rem] text-[clamp(2rem,4vw,3.6rem)] leading-[0.98] text-balance">
          <DropCap>{words.lede}</DropCap>
        </p>

        <div
          ref={ref}
          onPointerLeave={() => setHovering(false)}
          className="relative mt-12 flex flex-col gap-4 md:mt-6 md:block md:h-[min(46rem,88svh)]"
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
        className={`pointer-events-none absolute -inset-5 rounded-[28px] bg-[linear-gradient(100deg,#f6a06b_0%,#e889c8_38%,#a58cf5_68%,#8fb8f7_100%)] blur-2xl transition-opacity duration-700 ${focused ? "opacity-60" : "opacity-0"}`}
      />
      <div
        className={`relative rounded-[14px] px-6 pt-5 pb-4 shadow-[0_10px_30px_rgba(40,35,20,0.08)] transition-[background-color,opacity,filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          focused ? "scale-100 bg-white opacity-100" : "scale-[0.98] bg-white/60 opacity-80 md:[filter:blur(0.4px)]"
        }`}
      >
        <blockquote
          className={`m-0 text-[clamp(1.05rem,1.35vw,1.3rem)] leading-[1.35] tracking-[-0.01em] text-pretty transition-colors duration-700 ${focused ? "text-ink" : "text-ink/30"}`}
        >
          {text}
        </blockquote>
        <figcaption className="mt-6 flex items-center justify-between">
          <span className={`flex items-center gap-2 text-[13px] transition-colors duration-700 ${focused ? "text-ink/60" : "text-ink/25"}`}>
            {via === "comment" ? <CommentIcon /> : <DmIcon />}
            {via === "comment" ? "LinkedIn comment" : "LinkedIn DM"}
          </span>
          <span
            aria-hidden
            className={`grid size-9 place-items-center rounded-full transition-colors duration-700 ${focused ? "bg-ink text-cream" : "bg-ink/8 text-ink/30"}`}
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
    <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10.5V16M8 7.8v.2M11.5 16v-3.2c0-1.4.9-2.3 2.1-2.3 1.2 0 1.9.8 1.9 2.3V16" strokeLinecap="round" />
    </svg>
  );
}

function DmIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );
}
