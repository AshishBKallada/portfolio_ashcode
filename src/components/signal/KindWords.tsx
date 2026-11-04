"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { TextReveal } from "@/components/motion/TextReveal";
import { RevealItem } from "@/components/motion/Reveal";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { site } from "@/data/site";
import { DropCap } from "./Editions";

const words = site.signal.linkedin.kindWords;
const linkedinUrl =
  site.socials.find((s) => s.label === "LinkedIn")?.href ?? "";

/** Avatar tints, picked per commenter from their name so each keeps the same one. */
const TINTS = [
  "#d9782f",
  "#3558a8",
  "#2e7c78",
  "#a8457a",
  "#7a6a2e",
  "#5b4ba8",
] as const;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((part) => /^[A-Za-z]/.test(part))
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const tint = (name: string) =>
  TINTS[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % TINTS.length];

/**
 * Where each comment floats in the cloud (desktop): left and top of the field in %,
 * and its depth, 0 far to 2 near. Nearer cards sit larger and shift further with the
 * pointer. Each bobs on its own slow loop (dur, delay in seconds).
 */
const SPOTS = [
  { l: 0, t: 6, z: 1, dur: 7.2, delay: 0 },
  { l: 24, t: 0, z: 2, dur: 6.4, delay: -1.8 },
  { l: 50, t: 10, z: 0, dur: 8.1, delay: -3.1 },
  { l: 75, t: 2, z: 1, dur: 6.9, delay: -0.9 },
  { l: 5, t: 54, z: 2, dur: 7.6, delay: -2.4 },
  { l: 31, t: 46, z: 0, dur: 8.4, delay: -4.2 },
  { l: 55, t: 56, z: 2, dur: 6.6, delay: -1.2 },
  { l: 79, t: 46, z: 0, dur: 7.9, delay: -3.6 },
  { l: 63, t: 30, z: 0, dur: 8.8, delay: -5.0 },
] as const;
const DEPTH_SCALE = [0.84, 0.92, 1] as const;
/** How far a card shifts against the pointer, by depth (px at the field's edge). */
const DEPTH_SHIFT = [14, 26, 42] as const;

/**
 * Kind words from LinkedIn, laid out as the comments they were: each card signed
 * with the commenter's initials and name and where it was left. On desktop they
 * float in a cloud at three depths, the layers shifting with the pointer, and the
 * comment nearest it comes forward (full strength, larger, its glow on). Below md
 * they sit in a compact masonry. Each heart can be liked (a little burst).
 */
export function KindWords() {
  return (
    <div className="relative pt-4 pb-16 md:pt-6 md:pb-20">
      <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <TextReveal
              as="h3"
              text={words.heading}
              className="block font-headline text-[18px] leading-[1.1] tracking-[-0.02em]"
            />
            <RevealItem delay={0.1}>
              <p className="mt-2 max-w-[34rem] text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1] text-balance">
                <DropCap scrub>{words.lede}</DropCap>
              </p>
            </RevealItem>
          </div>
          <RevealItem delay={0.2}>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link inline-flex items-center gap-2 font-headline text-[15px] tracking-[-0.02em] text-cream/80 hover:text-cream"
            >
              <CommentIcon />
              Read the threads
              <span aria-hidden>↗</span>
            </a>
          </RevealItem>
        </div>

        <Cloud />

        {/* Phones and tablets: the comments in a compact masonry. */}
        <ul className="mt-6 columns-1 gap-3 sm:columns-2 md:hidden">
          {words.items.map((item, i) => (
            <li key={item.name} className="mb-3 break-inside-avoid">
              <RevealItem delay={(i % 4) * 0.06 + Math.floor(i / 4) * 0.04}>
                <WordCard text={item.text} name={item.name} via={item.via} />
              </RevealItem>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** The desktop cloud: the comments floating at three depths around the pointer. */
function Cloud() {
  const ref = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const reduce = useReducedMotion() ?? false;
  const [focus, setFocus] = useState(1);
  // The pointer across the field, −0.5…0.5 each way, eased.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });

  // The bob pauses while the field is off screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.dataset.paused = e.isIntersecting ? "false" : "true";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
    // The card whose centre is nearest the pointer comes forward.
    let nearest = focus;
    let best = Infinity;
    cards.current.forEach((card, i) => {
      if (!card) return;
      const b = card.getBoundingClientRect();
      const d = Math.hypot(
        e.clientX - (b.left + b.width / 2),
        e.clientY - (b.top + b.height / 2),
      );
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    if (nearest !== focus) setFocus(nearest);
  };

  return (
    <div
      ref={ref}
      data-paused="true"
      onPointerMove={reduce ? undefined : onPointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="kw-cloud relative mt-6 hidden h-[min(22rem,52svh)] md:block"
    >
      {words.items.map((item, i) => {
        const spot = SPOTS[i % SPOTS.length];
        return (
          <CloudCard
            key={item.name}
            refCallback={(el) => {
              cards.current[i] = el;
            }}
            spot={spot}
            sx={sx}
            sy={sy}
            focused={i === focus}
            still={reduce}
            delay={i * 0.05}
          >
            <WordCard
              text={item.text}
              name={item.name}
              via={item.via}
              focused={i === focus}
            />
          </CloudCard>
        );
      })}
    </div>
  );
}

function CloudCard({
  refCallback,
  spot,
  sx,
  sy,
  focused,
  still,
  delay,
  children,
}: {
  refCallback: (el: HTMLDivElement | null) => void;
  spot: (typeof SPOTS)[number];
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  focused: boolean;
  still: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  const shift = DEPTH_SHIFT[spot.z];
  const x = useTransform(sx, (v) => -v * shift * 2);
  const y = useTransform(sy, (v) => -v * shift * 1.2);
  const scale = focused ? 1.04 : DEPTH_SCALE[spot.z];
  return (
    <motion.div
      ref={refCallback}
      style={{
        left: `${spot.l}%`,
        top: `${spot.t}%`,
        zIndex: focused ? 10 : spot.z + 1,
        ...(still ? {} : { x, y }),
      }}
      className="absolute w-[min(17rem,22%)]"
    >
      {/* The entrance, on its own layer so it never fights the pointer shift. */}
      <motion.div
        initial={still ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* The bob, on its own layer too. */}
        <div
          style={
            {
              "--dur": `${spot.dur}s`,
              "--delay": `${spot.delay}s`,
            } as CSSProperties
          }
          className={still ? "" : "kw-float"}
        >
          <div
            className={`transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${focused ? "opacity-100" : "opacity-85"}`}
            style={{ transform: `scale(${scale})` }}
          >
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function WordCard({
  text,
  name,
  via,
  focused = false,
}: {
  text: string;
  name: string;
  via: "comment" | "dm";
  /** Brought forward in the cloud: its glow on. */
  focused?: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const [liked, setLiked] = useState(false);

  return (
    <figure className="group relative m-0">
      {/* Under the pointer: a soft glow, warm to violet, and the card lifts. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-2 rounded-[20px] bg-[linear-gradient(100deg,#f6a06b_0%,#e889c8_38%,#a58cf5_68%,#8fb8f7_100%)] blur-2xl transition-opacity duration-500 group-hover:opacity-50 ${focused ? "opacity-50" : "opacity-0"}`}
      />
      <div className="keep-ink relative rounded-[12px] bg-white/90 p-3 text-ink shadow-[0_10px_30px_rgba(40,35,20,0.07)] transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:bg-white">
        <figcaption className="flex items-center gap-2.5">
          <span
            aria-hidden
            style={{ backgroundColor: tint(name) }}
            className="grid size-7 shrink-0 place-items-center rounded-full font-headline text-[11px] tracking-[-0.01em] text-cream"
          >
            {initials(name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-headline text-[14px] leading-tight tracking-[-0.02em]">
              {name}
            </span>
            <span className="flex items-center gap-1 text-[11px] leading-tight text-ink/50">
              {via === "comment" ? <CommentIcon /> : <DmIcon />}
              {via === "comment" ? "Commented on a post" : "Sent a message"}
            </span>
          </span>
          <button
            type="button"
            aria-pressed={liked}
            aria-label={
              liked ? `Unlike ${name}'s comment` : `Like ${name}'s comment`
            }
            onClick={() => setLiked((v) => !v)}
            className={`relative grid size-8 shrink-0 place-items-center rounded-full transition-colors ${
              liked
                ? "bg-ink text-cream"
                : "bg-ink/6 text-ink/60 hover:bg-ink/10 hover:text-ink"
            }`}
          >
            <motion.span
              key={String(liked)}
              initial={reduce ? false : { scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="inline-flex"
            >
              <HeartIcon filled={liked} />
            </motion.span>
            <AnimatePresence>
              {liked && !reduce ? <Burst /> : null}
            </AnimatePresence>
          </button>
        </figcaption>

        <blockquote className="m-0 mt-2 text-[15px] leading-[1.35] tracking-[-0.01em] text-pretty text-ink/85">
          {text}
        </blockquote>
      </div>
    </figure>
  );
}

/** A one-off burst of reactions off the heart when a card is liked. */
const BURST = [
  { e: "❤️", x: -26, y: -42 },
  { e: "😊", x: 6, y: -56 },
  { e: "🔥", x: 30, y: -40 },
  { e: "👏", x: -10, y: -30 },
  { e: "🙌", x: 20, y: -64 },
];

function Burst() {
  return (
    <span aria-hidden className="pointer-events-none absolute top-0 left-4">
      {BURST.map((b, i) => (
        <motion.span
          key={b.e}
          className="absolute text-[16px] leading-none"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 0],
            x: b.x,
            y: b.y,
            scale: [0.4, 1.1, 0.9],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, delay: i * 0.04, ease: "easeOut" }}
        >
          {b.e}
        </motion.span>
      ))}
    </span>
  );
}

function CommentIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path
        d="M8 10.5V16M8 7.8v.2M11.5 16v-3.2c0-1.4.9-2.3 2.1-2.3 1.2 0 1.9.8 1.9 2.3V16"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DmIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-3.5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
