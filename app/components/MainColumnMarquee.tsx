"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const MARQUEE_TEXT =
  "Ashcode • blog • monthly notes • engineering • curiosity • build in public";

const MARQUEE_REPEAT = 8;

export default function MainColumnMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const segmentWidth = () => {
      const first = track.querySelector<HTMLElement>(":first-child");
      return first ? first.offsetWidth * 4 : 0;
    };

    let alive = true;

    const start = () => {
      if (!alive) return;
      const w = segmentWidth();
      if (w <= 0) return;
      tweenRef.current?.kill();
      gsap.set(track, { x: 0 });
      tweenRef.current = gsap.to(track, {
        x: -w,
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    };

    requestAnimationFrame(() => requestAnimationFrame(() => start()));
    const ro = new ResizeObserver(() => start());
    ro.observe(track);

    return () => {
      alive = false;
      ro.disconnect();
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[50] overflow-hidden border-t border-white/12 bg-black px-6 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] transition-colors duration-300 md:px-12 lg:px-16"
      aria-hidden
    >
      <div className="w-full overflow-hidden">
        <div ref={trackRef} className="flex w-max items-center whitespace-nowrap">
          {Array.from({ length: MARQUEE_REPEAT }).map((_, i) => (
            <span
              key={`marquee-${i}`}
              className="inline-block flex-shrink-0 px-8 font-safiro text-xs font-medium text-white/75 md:text-sm"
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
