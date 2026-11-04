"use client";

import { motion, useReducedMotion } from "motion/react";

/*
 * Construction lines for a section, after the hero's (HeroLines, HeroWireDecor) but
 * much fainter: the centre vertical, golden-section verticals and horizontals, the two
 * diagonals, a circle with a dashed ring outside it, and an offset square, all framing
 * the middle of the section. Drawn in once as it scrolls into view. Laid out in a
 * 1440×800 frame that covers the section (cropped, never stretched).
 */

const CX = 720;
const CY = 420;

const LINES = [
  // The centre vertical and the golden-section verticals either side of it.
  `M${CX} -200v1200`,
  "M550 -200v1200",
  "M890 -200v1200",
  // Golden-section horizontals: one out to the left, one out to the right.
  "M-200 300H890",
  "M550 560H1640",
  // The diagonals through the centre.
  `M${CX - 900} ${CY - 560}L${CX + 900} ${CY + 560}`,
  `M${CX + 900} ${CY - 560}L${CX - 900} ${CY + 560}`,
];

export function SectionLines({ className = "" }: { className?: string }) {
  const still = useReducedMotion() ?? false;
  const draw = (i: number) =>
    still
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 2.4, delay: i * 0.08, ease: [0.34, 0.22, 0.47, 0.84] as const },
        };

  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-hidden text-cream ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      <g strokeOpacity={0.2}>
        {LINES.map((d, i) => (
          <motion.path key={d} d={d} vectorEffect="non-scaling-stroke" {...draw(i)} />
        ))}
        <motion.circle cx={CX} cy={CY} r={300} vectorEffect="non-scaling-stroke" {...draw(LINES.length)} />
        <motion.rect x={860} y={250} width={300} height={300} vectorEffect="non-scaling-stroke" {...draw(LINES.length + 1)} />
      </g>
      <motion.circle
        cx={CX}
        cy={CY}
        r={322}
        strokeOpacity={0.26}
        strokeDasharray="5 6"
        vectorEffect="non-scaling-stroke"
        {...(still ? {} : { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 1.6, delay: 0.8 } })}
      />
    </svg>
  );
}
