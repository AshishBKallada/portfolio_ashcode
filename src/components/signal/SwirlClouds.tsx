"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";

const SRC = "/images/work/work-swirl-cloud.webp";

/**
 * Copies of the watercolour swirl cloud over Work's painting, each
 * drifting and bobbing on its own slow loop (globals.css: swirl-drift), some
 * flipped so the copies don't read as one. Transform only; paused
 * while off screen and still under reduced motion.
 *
 * Given `rise`, they come up into place together from below the screen across
 * that stretch of a tracked intro's climb (as TrackRise), easing in.
 *
 * Two (`front`) sit at the sides, in front of the panel that scrolls over the
 * painting, reaching a little over its content's edges: render the set twice,
 * `layer="back"` with the painting and `layer="front"` over the panel. Below md,
 * where the panel runs full width, they stay behind it with the rest. Each loop
 * (swirl-drift) carries a cloud up to 7vw right, mirrored left, so the left one
 * is mirrored and drifts off towards the rail, the right one not and drifts off
 * the screen.
 */
const CLOUDS = [
  { top: "-6%", left: "-10%", w: "clamp(18rem,38vw,38rem)", flip: false, rot: -6, dur: 38, delay: 0, o: 0.85 },
  { top: "4%", left: "58%", w: "clamp(14rem,28vw,28rem)", flip: true, rot: 8, dur: 46, delay: -12, o: 0.75 },
  { top: "26%", left: "30%", w: "clamp(10rem,18vw,18rem)", flip: false, rot: 14, dur: 52, delay: -30, o: 0.55 },
  { top: "48%", left: "-8%", w: "clamp(14rem,26vw,26rem)", flip: true, rot: 4, dur: 48, delay: -22, o: 0.7, front: true },
  { top: "60%", left: "82%", w: "clamp(14rem,28vw,28rem)", flip: false, rot: -10, dur: 42, delay: -8, o: 0.65, front: true },
  { top: "78%", left: "28%", w: "clamp(12rem,22vw,22rem)", flip: true, rot: -14, dur: 56, delay: -40, o: 0.5 },
];


type Rise = { track: string; from: number; to: number };
type CloudSpec = { front?: boolean } & Omit<(typeof CLOUDS)[number], "front">;

export function SwirlClouds({
  rise,
  layer = "all",
}: {
  rise?: Rise;
  /** All of them, those behind the panel (the front two too below md), or the front two. */
  layer?: "all" | "back" | "front";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  // The stretch's progress, 0–1: in screens of the tracked intro's climb, as TrackRise.
  const stage = useTransform(scrollY, () => {
    if (!rise || typeof document === "undefined") return rise ? 0 : 1;
    const el = document.getElementById(rise.track);
    if (!el) return 1;
    const vh = window.innerHeight;
    const v = Math.min(1, Math.max(0, ((vh - el.getBoundingClientRect().top) / vh - rise.from) / (rise.to - rise.from)));
    return v * v * (3 - 2 * v);
  });

  // Only run the loops while the section is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.dataset.running = e.isIntersecting ? "true" : "false";
      if (!e.isIntersecting) return;
      // Back on the page's clock, not where it paused, so both layers (behind and in front of
      // the panel) show each cloud at the same point.
      const now = document.timeline.currentTime;
      if (typeof now !== "number") return;
      el.querySelectorAll("img").forEach((img) => img.getAnimations().forEach((a) => (a.currentTime = now)));
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-running="false" className="swirl-clouds absolute inset-0">
      {(CLOUDS as CloudSpec[]).map((c, i) =>
        layer === "front" && !c.front ? null : (
        <Cloud key={i} cloud={c} stage={stage} still={reduce || !rise} className={layer === "back" && c.front ? "md:hidden" : ""}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SRC}
            alt=""
            width={900}
            height={857}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="swirl-cloud block h-auto w-full select-none"
            style={{ animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
          />
        </Cloud>
        ),
      )}
    </div>
  );
}

/** One cloud's box, risen into place along `stage` (0 below the screen, 1 in place). */
function Cloud({
  cloud: c,
  stage,
  still,
  className = "",
  children,
}: {
  cloud: CloudSpec;
  stage: MotionValue<number>;
  still: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const y = useTransform(stage, (v) => `${(1 - v) * 115}svh`);
  // Motion mirrors before it turns, so a flipped cloud's angle is negated to sit as it did
  // under `rotate(rot) scaleX(-1)`.
  const sign = c.flip ? -1 : 1;
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{
        top: c.top,
        left: c.left,
        width: c.w,
        opacity: c.o,
        scaleX: c.flip ? -1 : 1,
        rotate: sign * c.rot,
        ...(still ? {} : { y }),
      }}
    >
      {children}
    </motion.div>
  );
}
