"use client";

import { motion, useMotionValueEvent, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CARD_W = 340;
const CARD_H = 464;
/** Fraction of the viewport width the card sits left of centre (--nav-card-shift). */
export const NAV_CARD_SHIFT = 0.12;

type Size = { w: number; h: number };

/** When the intro draw + fade has finished and scroll can take over the stroke. */
const DRAWN_MS = 5200;

/**
 * Construction lines laid out around the hero nav card, in real pixels so
 * they stay locked to it at any viewport size: the card's circumcircle, two
 * vesica arcs through its centre, wide arcs grazing its top and bottom, the
 * viewport diagonals, and the card's edges run out to the screen. They draw
 * in bright once `active` flips, then settle to a faint hairline. Once drawn,
 * `erase` (0 → 1, from scroll) winds them back off the way they came.
 */
export function HeroLines({ active, erase }: { active: boolean; erase: MotionValue<number> }) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [drawn, setDrawn] = useState(false);

  // Hand over from the intro animation to scroll once it has played, or as
  // soon as scrolling starts erasing.
  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => setDrawn(true), DRAWN_MS);
    return () => window.clearTimeout(t);
  }, [active]);
  useMotionValueEvent(erase, "change", (v) => {
    if (v > 0 && !drawn) setDrawn(true);
  });

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

  const shapes = size ? geometry(size) : [];

  return (
    <motion.svg
      ref={ref}
      aria-hidden
      style={{ "--erase": erase } as never}
      data-active={active ? "true" : "false"}
      data-drawn={drawn ? "true" : "false"}
      viewBox={size ? `0 0 ${size.w} ${size.h}` : undefined}
      className="hero-lines pointer-events-none absolute inset-0 h-full w-full"
    >
      {shapes.map((s, i) =>
        s.kind === "circle" ? (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} pathLength={1} style={{ "--i": s.order } as React.CSSProperties} />
        ) : (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} pathLength={1} style={{ "--i": s.order } as React.CSSProperties} />
        ),
      )}
    </motion.svg>
  );
}

type Shape =
  | { kind: "circle"; cx: number; cy: number; r: number; order: number }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number; order: number };

function geometry({ w, h }: Size): Shape[] {
  // Phones keep the card dead centre; the shift only applies from md up.
  const cx = w / 2 - (w >= 768 ? w * NAV_CARD_SHIFT : 0);
  const cy = h / 2;
  const cw = Math.min(CARD_W, w - 24);
  const ch = (cw / CARD_W) * CARD_H;
  const left = cx - cw / 2;
  const right = cx + cw / 2;
  const top = cy - ch / 2;
  const bottom = cy + ch / 2;
  const diag = Math.hypot(cw, ch) / 2;
  const far = Math.hypot(w, h);

  return [
    // The card's edges, run out to the screen.
    { kind: "line", x1: left, y1: 0, x2: left, y2: h, order: 0 },
    { kind: "line", x1: right, y1: 0, x2: right, y2: h, order: 0 },
    { kind: "line", x1: 0, y1: top, x2: w, y2: top, order: 1 },
    { kind: "line", x1: 0, y1: bottom, x2: w, y2: bottom, order: 1 },
    // Diagonals crossing at the card's centre, run out to the screen's edges.
    { kind: "line", x1: cx - h / 2, y1: 0, x2: cx + h / 2, y2: h, order: 2 },
    { kind: "line", x1: cx + h / 2, y1: 0, x2: cx - h / 2, y2: h, order: 2 },
    // Circumcircle through the card's corners, and a ring twice as wide.
    { kind: "circle", cx, cy, r: diag, order: 3 },
    { kind: "circle", cx, cy, r: diag * 1.62, order: 4 },
    // Vesica: two circles the card's height, each through the other's centre.
    { kind: "circle", cx, cy: top, r: ch / 2, order: 5 },
    { kind: "circle", cx, cy: bottom, r: ch / 2, order: 5 },
    // Wide arcs grazing the card's top and bottom from far above and below.
    { kind: "circle", cx, cy: top - far * 0.5, r: far * 0.5, order: 6 },
    { kind: "circle", cx, cy: bottom + far * 0.5, r: far * 0.5, order: 6 },
    // Corner circles reaching in to touch the card's corners.
    { kind: "circle", cx: 0, cy: 0, r: Math.hypot(left, top), order: 7 },
    { kind: "circle", cx: w, cy: h, r: Math.hypot(w - right, h - bottom), order: 7 },
    { kind: "circle", cx: w, cy: 0, r: Math.hypot(w - right, top), order: 7 },
    { kind: "circle", cx: 0, cy: h, r: Math.hypot(left, h - bottom), order: 7 },
  ];
}
