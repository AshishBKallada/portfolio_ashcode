"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EditionButton } from "./Editions";

type Note = {
  title: string;
  body: string;
  action?: { label: string; href: string };
  /** Which side the label sits on, and its top in % of the figure's box. */
  side: "left" | "right";
  top: number;
  /** The spot on the figure the line points to, in % of the image (x, y). */
  at: [number, number];
};

const SRC = "/images/about/courier-meditate.webp";
const IMG_W = 1376;
const IMG_H = 768;

/*
 * Box geometry, in % of the box: the image is 56% wide, centred, and the box
 * is 2.4:1, so the 16:9-ish image spans 12.5% → 87.5% of its height.
 */
const IMG_LEFT = 22;
const IMG_SPAN_X = 56;
const IMG_TOP = 12.5;
const IMG_SPAN_Y = 75;
const LABEL_EDGE = { left: 20.5, right: 79.5 } as const;

const toBox = ([fx, fy]: [number, number]) => [IMG_LEFT + fx * IMG_SPAN_X, IMG_TOP + fy * IMG_SPAN_Y] as const;

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The meditating courier in the middle with the principles placed round it,
 * each joined by a hairline leader to the part of the figure it speaks to.
 * Lines draw in and labels fade up as it comes into view. Below xl there's no
 * room for the leaders, so it's the figure over a plain list.
 */
export function AnnotatedFigure({ notes }: { notes: Note[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion() ?? false;
  const shown = inView || reduce;
  const d = (s: number) => (reduce ? 0 : s);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div>
      {/* Wide: figure centred, notes round it, leaders between. */}
      <div ref={ref} className="relative hidden aspect-[2.4/1] w-full xl:block">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={shown ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: d(0.9), ease }}
          style={{ left: `${IMG_LEFT}%`, top: `${IMG_TOP}%`, width: `${IMG_SPAN_X}%` }}
          className="absolute"
        >
          <FloatingFigure still={reduce} />
        </motion.div>

        {/* Leaders, drawn in real pixels so the stroke draws in cleanly. */}
        {size ? (
          <svg
            aria-hidden
            viewBox={`0 0 ${size.w} ${size.h}`}
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            {notes.map((note, i) => {
              const [ax, ay] = toBox(note.at);
              const ex = LABEL_EDGE[note.side];
              const ly = note.top + 2.5;
              const knee = note.side === "left" ? ex + 3 : ex - 3;
              const X = (v: number) => (v / 100) * size.w;
              const Y = (v: number) => (v / 100) * size.h;
              return (
                <motion.path
                  key={note.title}
                  d={`M ${X(ex)} ${Y(ly)} L ${X(knee)} ${Y(ly)} L ${X(ax)} ${Y(ay)}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  className="text-ink/45"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={shown ? { pathLength: 1 } : undefined}
                  transition={{ duration: d(1.1), ease, delay: d(0.5 + i * 0.12) }}
                />
              );
            })}
          </svg>
        ) : null}

        {/* Dots where each leader lands on the figure. */}
        {notes.map((note, i) => {
          const [ax, ay] = toBox(note.at);
          return (
            <motion.span
              key={note.title}
              aria-hidden
              style={{ left: `${ax}%`, top: `${ay}%` }}
              initial={reduce ? false : { scale: 0 }}
              animate={shown ? { scale: 1, ...(reduce ? {} : { y: FLOAT.y }) } : undefined}
              transition={{
                scale: { duration: d(0.4), ease, delay: d(1.4 + i * 0.12) },
                y: FLOAT.transition,
              }}
              className="absolute -mt-[4px] -ml-[4px] size-2 rounded-full bg-ink ring-4 ring-background"
            />
          );
        })}

        {notes.map((note, i) => (
          <motion.div
            key={note.title}
            style={{ top: `${note.top}%`, [note.side]: 0 }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={shown ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: d(0.7), ease, delay: d(0.35 + i * 0.12) }}
            className={`absolute w-[19%] ${note.side === "right" ? "text-left" : "text-right"}`}
          >
            <NoteText note={note} />
          </motion.div>
        ))}
      </div>

      {/* Narrow: figure, then the notes as a list. */}
      <div className="xl:hidden">
        <div className="mx-auto w-full max-w-[44rem]">
          <FloatingFigure still={reduce} />
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2">
          {readingOrder(notes).map((note) => (
            <div key={note.title}>
              <NoteText note={note} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Numbered principles first, in number order, then the rest — for the stacked list. */
function readingOrder(notes: Note[]) {
  const num = (n: Note) => Number(n.title.match(/\d+/)?.[0] ?? Infinity);
  return [...notes].sort((a, b) => num(a) - num(b));
}

/** A slow bob, shared by the figure and the dots that sit on it. */
const FLOAT = {
  y: [0, -10, 0],
  transition: { duration: 5.5, ease: "easeInOut" as const, repeat: Infinity },
};

/**
 * The figure bobbing gently over a soft ground shadow a little below it; as it
 * rises the shadow tightens and fades, as it settles the shadow spreads.
 */
function FloatingFigure({ still }: { still: boolean }) {
  return (
    <div className="relative pb-[6%]">
      <motion.img
        src={SRC}
        alt="The courier seated cross-legged in meditation"
        width={IMG_W}
        height={IMG_H}
        loading="lazy"
        draggable={false}
        animate={still ? undefined : { y: FLOAT.y }}
        transition={FLOAT.transition}
        className="relative z-[1] h-auto w-full select-none will-change-transform"
      />
      {/* Ground shadow, a small gap under the robe's hem. */}
      <motion.span
        aria-hidden
        animate={still ? undefined : { scaleX: [1, 0.86, 1], opacity: [0.55, 0.32, 0.55] }}
        transition={FLOAT.transition}
        className="absolute bottom-0 left-1/2 h-[6%] w-[62%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(26,5,5,0.45),rgba(26,5,5,0.12)_60%,transparent)] blur-[2px]"
      />
    </div>
  );
}

function NoteText({ note }: { note: Note }) {
  return (
    <>
      <h4 className="mb-2 font-headline text-[16px] leading-[0.95] tracking-[-0.02em]">{note.title}</h4>
      <p className="font-narrative text-[clamp(1.05rem,1.2vw,1.2rem)] leading-[1.08] tracking-[-0.03em] text-pretty text-ink/85">
        {note.body}
      </p>
      {note.action ? (
        <div className="mt-3">
          <EditionButton {...note.action} />
        </div>
      ) : null}
    </>
  );
}

export type { Note };
