"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useSectionProgress } from "./HorizontalTrack";
import { useRef, type ReactNode } from "react";

/** How faint a word sits before the scroll reaches it. */
const DIM = 0.18;

/**
 * Body copy that reads itself in as you scroll: every word starts faint and fills
 * to full ink in turn as the line travels up the screen, scrubbed to the scroll
 * (not timed), so it runs back when you scroll up. Still for reduced motion.
 */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion() ?? false;
  // From the line's start entering near the screen's far edge to its end passing a little past
  // the middle (down the page, or across the sideways row).
  const scrollYProgress = useSectionProgress(ref, ["start 0.9", "end 0.55"]);
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      {reduce
        ? text
        : words.map((word, i) => (
            <Word key={i} p={scrollYProgress} from={i / words.length} to={(i + 1) / words.length}>
              {word}
              {i < words.length - 1 ? " " : null}
            </Word>
          ))}
    </span>
  );
}

function Word({ p, from, to, children }: { p: MotionValue<number>; from: number; to: number; children: ReactNode }) {
  // A function transform: a plain scroll-linked opacity gets handed to the browser's
  // scroll timeline, which ignores the target's offsets.
  const opacity = useTransform(p, (v) => DIM + (1 - DIM) * Math.min(1, Math.max(0, (v - from) / (to - from))));
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}
