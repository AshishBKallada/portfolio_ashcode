"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  type UseScrollOptions,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const VIEW_W = 1000;
const VIEW_H = 1600;

// One continuous hand-drawn stroke, in a 1000×1600 box stretched over the
// section: it sweeps in over the headline and curls around it, runs down
// the right edge, crosses back behind the tiles with a second curl, then
// finishes as a signature flourish under the closing line.
const THREAD =
  "M -20 150 C 200 60, 420 40, 560 120 " +
  "C 640 170, 700 280, 620 300 C 540 320, 520 220, 600 190 " +
  "C 720 150, 900 220, 940 360 " +
  "C 980 520, 900 640, 780 700 " +
  "C 600 780, 300 720, 160 860 " +
  "C 60 960, 120 1080, 220 1040 C 300 1005, 260 920, 190 950 " +
  "C 100 1000, 80 1200, 260 1300 " +
  "C 380 1380, 520 1370, 640 1355 " +
  "C 720 1345, 790 1365, 765 1395 C 740 1425, 695 1395, 740 1368 " +
  "C 800 1335, 900 1340, 1020 1320";

// Stretches the thread to the section's pixel box. Scaling a Bézier's
// control points scales the curve exactly, so the shape matches a stretched
// viewBox while stroke width, dash length and the ember all share one space.
function fitThread(width: number, height: number) {
  let i = 0;
  return THREAD.replace(/-?\d+(\.\d+)?/g, (n) =>
    (Number(n) * (i++ % 2 === 0 ? width / VIEW_W : height / VIEW_H)).toFixed(1),
  );
}

type Props = {
  color?: string;
  className?: string;
  offset?: UseScrollOptions["offset"];
};

// A scroll-scrubbed ink thread with a glowing ember riding its tip. A faint
// dotted guide shows the whole route; the stroke traces over it as the
// section passes. Decorative only, so it is hidden from assistive tech, and
// reduced motion gets the finished line without the ember.
export function ScrollThread({
  color = "currentColor",
  className,
  offset = ["start 0.75", "end 0.85"],
}: Props) {
  // Fills its positioned parent, so its own box tracks the section's scroll.
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const emberRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  // A little lag so the ink feels pulled, not jumped, across the page.
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(progress, "change", (p) => {
    const path = pathRef.current;
    const ember = emberRef.current;
    if (!path || !ember) return;
    const t = Math.min(Math.max(p, 0), 1);
    const point = path.getPointAtLength(t * path.getTotalLength());
    ember.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;
    ember.style.opacity = t > 0.005 && t < 0.995 ? "1" : "0";
  });

  const d = size ? fitThread(size.w, size.h) : undefined;

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      {d && (
        <svg fill="none" className="size-full overflow-visible">
          {/* Pencil guide: the whole route, faint and dotted. */}
          <path
            d={d}
            stroke={color}
            strokeOpacity={0.22}
            strokeWidth={1}
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
          <motion.path
            ref={pathRef}
            d={d}
            stroke={color}
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: reduce ? 1 : progress }}
          />
        </svg>
      )}
      {!reduce && d && (
        <span
          ref={emberRef}
          className="absolute top-0 left-0 size-2.5 rounded-full opacity-0 transition-opacity duration-300"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px 2px ${color}, 0 0 28px 8px color-mix(in srgb, ${color} 45%, transparent)`,
          }}
        />
      )}
    </div>
  );
}
