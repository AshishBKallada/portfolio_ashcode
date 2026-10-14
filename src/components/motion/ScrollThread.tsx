"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type UseScrollOptions,
} from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

const VIEW_W = 1000;
const VIEW_H = 1600;

// One continuous hand-drawn stroke, in a 1000×1600 box stretched over the
// section: it sweeps in over the headline and threads through its letters,
// runs down the right edge, dives under the tiles with a second curl, then
// finishes as a signature flourish under the closing line. Segments marked
// `over` cross in front of the content; the rest pass behind it, so the
// thread weaves through the page instead of lying flat beneath it.
const THREAD: { d: string; over?: boolean }[] = [
  { d: "M -20 150 C 200 60, 420 40, 560 120" },
  { d: "C 640 170, 700 280, 620 300", over: true },
  { d: "C 540 320, 520 220, 600 190" },
  { d: "C 720 150, 900 220, 940 360" },
  { d: "C 980 520, 900 640, 780 700", over: true },
  { d: "C 600 780, 300 720, 160 860" },
  { d: "C 60 960, 120 1080, 220 1040" },
  { d: "C 300 1005, 260 920, 190 950", over: true },
  { d: "C 100 1000, 80 1200, 260 1300" },
  { d: "C 380 1380, 520 1370, 640 1355" },
  { d: "C 720 1345, 790 1365, 765 1395 C 740 1425, 695 1395, 740 1368" },
  { d: "C 800 1335, 900 1340, 1020 1320" },
];

/** Length of the glowing tail that trails the ember, in px. */
const TAIL = 140;

// Stretches a segment to the section's pixel box. Scaling a Bézier's
// control points scales the curve exactly, so the shape matches a stretched
// viewBox while stroke width, dash length and the ember all share one space.
function fit(d: string, width: number, height: number) {
  let i = 0;
  return d.replace(/-?\d+(\.\d+)?/g, (n) =>
    (Number(n) * (i++ % 2 === 0 ? width / VIEW_W : height / VIEW_H)).toFixed(1),
  );
}

type Geometry = {
  d: string;
  length: number;
  /** Dash pattern that shows only the segments crossing over the content. */
  overDash: string;
};

// Measures where each `over` segment starts and ends along the full path,
// by timing prefixes of it on a detached path element.
function measure(width: number, height: number): Geometry {
  const probe = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const lengthOf = (d: string) => {
    probe.setAttribute("d", d);
    return probe.getTotalLength();
  };
  const parts = THREAD.map((s) => ({ ...s, d: fit(s.d, width, height) }));
  // Gaps and dashes alternate, so open with an empty dash and then step
  // gap → over-run → gap → … along the path.
  const dash = [0];
  let prefix = "";
  let cursor = 0;
  for (const part of parts) {
    const start = prefix ? lengthOf(prefix) : 0;
    prefix = `${prefix} ${part.d}`.trim();
    if (!part.over) continue;
    const end = lengthOf(prefix);
    dash.push(start - cursor, end - start);
    cursor = end;
  }
  const length = lengthOf(prefix);
  dash.push(length - cursor + 1);
  return { d: prefix, length, overDash: dash.map((n) => n.toFixed(1)).join(" ") };
}

type Props = {
  color?: string;
  /** Classes shared by both layers (e.g. responsive visibility). */
  className?: string;
  offset?: UseScrollOptions["offset"];
};

// A scroll-scrubbed fuse that burns its way through the section: a faint
// dotted guide shows the route, the flame line traces over it, weaving in
// front of and behind the content, and a hot ember with a glowing tail rides
// the tip, flaring with scroll speed. Decorative only, so it is hidden from
// assistive tech; reduced motion gets the finished line, still woven.
export function ScrollThread({
  color = "currentColor",
  className,
  offset = ["start 0.75", "end 0.85"],
}: Props) {
  // The back layer fills its positioned parent, so its own box tracks the
  // section's scroll and size.
  const ref = useRef<HTMLDivElement>(null);
  const tailRef = useRef<SVGPathElement>(null);
  const haloRef = useRef<SVGPathElement>(null);
  const emberRef = useRef<HTMLSpanElement>(null);
  const maskId = useId();
  const reduce = useReducedMotion();
  const [geo, setGeo] = useState<Geometry | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset });
  // A little lag so the ink feels pulled, not jumped, across the page.
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  // Scroll speed flares the ember, then it settles back to a steady burn.
  const speed = useVelocity(scrollYProgress);
  const flare = useSpring(
    useTransform(speed, [-1.2, 0, 1.2], [1.9, 1, 1.9], { clamp: true }),
    { stiffness: 260, damping: 20 },
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setGeo(measure(width, height));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(progress, "change", (p) => {
    const tail = tailRef.current;
    const halo = haloRef.current;
    const ember = emberRef.current;
    if (!geo || !tail || !halo || !ember) return;
    const t = Math.min(Math.max(p, 0), 1);
    const at = t * geo.length;
    // Show only the last TAIL px behind the tip.
    const point = tail.getPointAtLength(at);
    const visible = t > 0.005 && t < 0.995 ? "1" : "0";
    for (const el of [tail, halo]) {
      el.style.strokeDashoffset = `${TAIL - at}`;
      el.style.opacity = visible;
    }
    ember.style.transform = `translate(${point.x}px, ${point.y}px)`;
    ember.style.opacity = visible;
  });

  const layer = `pointer-events-none absolute inset-0 ${className ?? ""}`;
  const drawn = reduce ? 1 : progress;

  return (
    <>
      {/* Behind the content: the guide and the whole drawn line. */}
      <div ref={ref} aria-hidden className={`-z-10 ${layer}`}>
        {geo && (
          <svg fill="none" className="size-full overflow-visible">
            <path
              d={geo.d}
              stroke={color}
              strokeOpacity={0.22}
              strokeWidth={1}
              strokeDasharray="1 7"
              strokeLinecap="round"
            />
            <motion.path
              d={geo.d}
              stroke={color}
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: drawn }}
            />
          </svg>
        )}
      </div>

      {/* In front of the content: the crossing segments, revealed only as
          far as the line has drawn, plus the ember and its tail. */}
      <div aria-hidden className={`z-20 ${layer}`}>
        {geo && (
          <svg fill="none" className="size-full overflow-visible">
            <mask id={maskId} maskUnits="userSpaceOnUse">
              <motion.path
                d={geo.d}
                stroke="#fff"
                strokeWidth={10}
                strokeLinecap="round"
                style={{ pathLength: drawn }}
              />
            </mask>
            <path
              d={geo.d}
              mask={`url(#${maskId})`}
              stroke={color}
              strokeWidth={2.25}
              strokeDasharray={geo.overDash}
            />
            {!reduce && (
              <>
                {/* Wide, soft halo with a hot cream core: the burning fuse. */}
                <path
                  ref={haloRef}
                  d={geo.d}
                  stroke={color}
                  strokeOpacity={0.35}
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeDasharray={`${TAIL} ${geo.length + TAIL}`}
                  style={{ strokeDashoffset: TAIL, opacity: 0 }}
                  className="transition-opacity duration-300"
                />
                <path
                  ref={tailRef}
                  d={geo.d}
                  stroke="var(--color-cream)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeDasharray={`${TAIL} ${geo.length + TAIL}`}
                  style={{ strokeDashoffset: TAIL, opacity: 0 }}
                  className="transition-opacity duration-300"
                />
              </>
            )}
          </svg>
        )}
        {!reduce && geo && (
          <span
            ref={emberRef}
            className="absolute top-0 left-0 opacity-0 transition-opacity duration-300"
          >
            <motion.span
              style={{
                scale: flare,
                backgroundColor: "var(--color-cream)",
                boxShadow: `0 0 6px 2px ${color}, 0 0 22px 7px ${color}, 0 0 48px 16px color-mix(in srgb, ${color} 40%, transparent)`,
              }}
              className="block size-2 -translate-1/2 rounded-full"
            />
          </span>
        )}
      </div>
    </>
  );
}
