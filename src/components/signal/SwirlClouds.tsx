"use client";

import { useEffect, useRef } from "react";

const SRC = "/images/work/work-swirl-cloud.webp";

/**
 * Copies of the watercolour swirl cloud over Work's painting, each
 * drifting and bobbing on its own slow loop (globals.css: swirl-drift), some
 * flipped so the copies don't read as one. Transform only; paused
 * while off screen and still under reduced motion.
 */
const CLOUDS = [
  { top: "-6%", left: "-10%", w: "clamp(18rem,38vw,38rem)", flip: false, rot: -6, dur: 38, delay: 0, o: 0.85 },
  { top: "4%", left: "58%", w: "clamp(14rem,28vw,28rem)", flip: true, rot: 8, dur: 46, delay: -12, o: 0.75 },
  { top: "26%", left: "30%", w: "clamp(10rem,18vw,18rem)", flip: false, rot: 14, dur: 52, delay: -30, o: 0.55 },
  { top: "48%", left: "-8%", w: "clamp(14rem,26vw,26rem)", flip: true, rot: 4, dur: 48, delay: -22, o: 0.7 },
  { top: "60%", left: "70%", w: "clamp(14rem,28vw,28rem)", flip: false, rot: -10, dur: 42, delay: -8, o: 0.65 },
  { top: "78%", left: "28%", w: "clamp(12rem,22vw,22rem)", flip: true, rot: -14, dur: 56, delay: -40, o: 0.5 },
];

export function SwirlClouds() {
  const ref = useRef<HTMLDivElement>(null);

  // Only run the loops while the section is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.dataset.running = e.isIntersecting ? "true" : "false";
      if (!e.isIntersecting) return;
      // Back on the page's clock, not where it paused, so every copy (Work's and the Index's)
      // shows each cloud at the same point and they meet without a jump.
      const now = document.timeline.currentTime;
      if (typeof now !== "number") return;
      el.querySelectorAll("img").forEach((img) => img.getAnimations().forEach((a) => (a.currentTime = now)));
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-running="false" className="swirl-clouds absolute inset-0">
      {/* Dims the painting under them a touch, so the pale clouds stand off it. */}
      <div className="absolute inset-0 bg-night/30" />
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{ top: c.top, left: c.left, width: c.w, opacity: c.o, transform: `rotate(${c.rot}deg) scaleX(${c.flip ? -1 : 1})` }}
        >
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
        </div>
      ))}
    </div>
  );
}
