"use client";

import { motion, useMotionValueEvent, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CARD_W = 340;
/** Fraction of the viewport width the card sits left of centre (--nav-card-shift). */
export const NAV_CARD_SHIFT = 0.12;

type Size = { w: number; h: number };

/** When the intro draw + fade has finished and scroll can take over the stroke. */
const DRAWN_MS = 5200;

/**
 * Construction lines round the hero nav card, after Shopify Editions' "da Vinci"
 * lines: golden-section verticals and horizontals, the centre vertical, the
 * two diagonals, a golden spiral off two opposite corners and two wide arcs
 * above and below. Shapes are in the reference's own space (a 1440×880 frame
 * with the 340×464 card at 550,208), placed on the card in real pixels so they
 * stay locked to it at any viewport size. They all draw in at once when
 * `active` flips, bright, then settle to a faint hairline. Once drawn,
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

  return (
    <motion.svg
      ref={ref}
      aria-hidden
      style={{ "--erase": erase } as never}
      data-active={active ? "true" : "false"}
      data-drawn={drawn ? "true" : "false"}
      viewBox={size ? `0 0 ${size.w} ${size.h}` : undefined}
      className="hero-lines pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    >
      {size ? (
        <g transform={placeOnCard(size)}>
          {PATHS.map((d) => (
            <path key={d} d={d} pathLength={1} />
          ))}
          {CIRCLES.map(({ cx, cy, r, turn }) => (
            <circle key={`${cx},${cy}`} cx={cx} cy={cy} r={r} transform={`rotate(${turn} ${cx} ${cy})`} pathLength={1} />
          ))}
        </g>
      ) : null}
    </motion.svg>
  );
}

/** The reference's card centre, in its own space. */
const REF_CX = 720;
const REF_CY = 440;

/** Maps the reference's space onto the card: centred on it, scaled with it on narrow phones. */
function placeOnCard({ w, h }: Size) {
  // Phones keep the card dead centre; the shift only applies from md up.
  const cx = w / 2 - (w >= 768 ? w * NAV_CARD_SHIFT : 0);
  const cy = h / 2;
  const k = Math.min(CARD_W, w - 24) / CARD_W;
  return `translate(${cx} ${cy}) scale(${k}) translate(${-REF_CX} ${-REF_CY})`;
}

// Each path runs the way the reference draws it.
const PATHS = [
  // Golden-section horizontals: one out to the left at the upper section, one out to the right at the lower.
  "M-1840 336.13h2390.03",
  "M889.97 543.87h2390.03",
  // The centre vertical and the golden-section verticals (the card's sides).
  "M720 -1000v2880",
  "M550.03 -1000v2880",
  "M889.97 -1000v2880",
  // The diagonals through the card's centre.
  "M-1636.36 -1000L3076.36 1880",
  "M3076.36 -1000L-1636.36 1880",
  // Golden spiral off the top-left corner, squaring in.
  "M339.94 -1000v1336.13",
  "M339.94 207.74h210.09",
  "M420.19 207.74v128.39",
  "M339.94 256.78h80.25",
  "M389.53 256.78v-49.04",
  "M389.53 238.05h30.65",
  // And off the bottom-right corner.
  "M1100.06 543.87v1336.13",
  "M889.97 672.26h210.09",
  "M1019.81 672.26v-128.39",
  "M1019.81 623.22h80.25",
  "M1050.47 623.22v49.04",
  "M1050.47 641.95h-30.65",
];

// Arcs grazing the card from above and below; the turn sets where each starts drawing.
const CIRCLES = [
  { cx: 720, cy: 15, r: 425, turn: -45 },
  { cx: 720, cy: 865, r: 425, turn: 45 },
];
