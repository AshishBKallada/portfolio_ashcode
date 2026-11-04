"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { HERO_FIGURE } from "@/lib/hero";
import { CARPET_FLY_DOWN_S, CARPET_FLY_IN_S, CARPET_MAT_LINE_END, CARPET_PERCH_S } from "./HeroCarpet";

/**
 * The courier's frames (scripts/courier-sequence.mjs), all on the leap's own canvas so
 * they stack exactly over it: painted keyframes with RIFE's in-betweens.
 * `raise`: floating in lotus, the free hand coming up to talk. `mouth`: it opening
 * as he speaks. `unfold`: from lotus
 * the legs drop and swing into the stride, ending on the leap itself.
 */
const frames = (name: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/images/hero/talk/${name}-${String(i + 1).padStart(2, "0")}.webp`);
const RAISE = frames("raise", 14);
/** Hand up, mouth closed to open, so he talks without snapping. */
const MOUTH = frames("mouth", 5);
const UNFOLD = frames("unfold", 44);
/** Every frame in one list; the sequence picks one index at a time. */
const ALL = [...RAISE, ...MOUTH, ...UNFOLD];
const MOUTH_INDEX = RAISE.length;
const UNFOLD_INDEX = RAISE.length + MOUTH.length;

/** His reply: hand up and talking, after the mat's line. */
const REPLY_START = CARPET_MAT_LINE_END + 0.15;
/** The unfold starts while the mat is still perched, so it can run slowly enough to show every frame. */
const UNFOLD_START = CARPET_FLY_IN_S + CARPET_PERCH_S - 0.8;
const REPLY_END = UNFOLD_START - 0.6;
/** Landing in the leap as the mat arrives under his feet: about 17 frames a second. */
const UNFOLD_S = CARPET_FLY_DOWN_S + 0.8;
/** How long the hand takes to come up (and go down). */
const ARM_S = 0.7;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
/** 0 hand down, 1 hand up; eased in and out round the reply. */
const replyAt = (k: number) => smooth(clamp01((k - REPLY_START) / ARM_S)) * (1 - smooth(clamp01((k - REPLY_END) / ARM_S)));
/** How open his mouth is (0–1): quick uneven syllables, grouped into words with short pauses. */
const mouthAt = (k: number) => (Math.sin(k * 3.1) > -0.35 ? clamp01(0.5 + 0.35 * Math.sin(k * 14) + 0.25 * Math.sin(k * 9.2)) : 0);

/** Which frame shows at entry time `k`. */
function frameAt(k: number): number {
  if (k >= UNFOLD_START) {
    // An even pace: easing would rush the middle past frames the browser can't draw in time.
    const u = clamp01((k - UNFOLD_START) / UNFOLD_S);
    return UNFOLD_INDEX + Math.round(u * (UNFOLD.length - 1));
  }
  const r = replyAt(k);
  if (r > 0.999) return MOUTH_INDEX + Math.round(mouthAt(k) * (MOUTH.length - 1));
  return Math.round(r * (RAISE.length - 1));
}

const frame = "absolute inset-0 h-full w-full object-contain object-bottom select-none [backface-visibility:hidden] [transform:translateZ(0)]";

function Frame({ src, index, current }: { src: string; index: number; current: MotionValue<number> }) {
  const opacity = useTransform(current, (c) => (c === index ? 1 : 0));
  return (
    <motion.img
      src={src}
      alt=""
      draggable={false}
      width={HERO_FIGURE.width}
      height={HERO_FIGURE.height}
      style={{ opacity }}
      className={frame}
    />
  );
}

/**
 * The courier on the hero. He opens floating cross-legged; when the mat has perched
 * and said its line, he raises a hand and answers it; then, as the mat flies down
 * under his feet, his legs unfold, frame by frame, into the leap. Everything runs
 * off the carpet's entry clock (`entry`); without it (reduced motion, phones) he's
 * the leap throughout.
 */
export function CourierTalk({ entry, active }: { entry: MotionValue<number>; active: boolean }) {
  const current = useTransform(entry, frameAt);
  const lineOpacity = useTransform(entry, (k) => smooth(clamp01((k - REPLY_START - 0.1) / 0.3)) * (1 - smooth(clamp01((k - REPLY_END + 0.1) / 0.3))));

  if (!active) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={HERO_FIGURE.src} alt="" draggable={false} width={HERO_FIGURE.width} height={HERO_FIGURE.height} className={frame} />
    );
  }

  return (
    <>
      {ALL.map((src, i) => (
        <Frame key={src} src={src} index={i} current={current} />
      ))}
      {/* His answer, set like the mat's line: the words alone in white, by his head. */}
      <motion.p
        aria-hidden
        style={{ opacity: lineOpacity }}
        className="absolute top-[2%] left-[64%] w-[9rem] font-headline text-[9px] leading-[1.25] tracking-[-0.01em] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.45)]"
      >
        Something that feels immortal. Let&rsquo;s fly.
      </motion.p>
    </>
  );
}
