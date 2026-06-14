"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";

type RefPair = {
  counterRef: RefObject<HTMLSpanElement>;
  progressRef: RefObject<HTMLDivElement>;
};

function LoaderContent({ counterRef, progressRef }: RefPair) {
  return (
    <>
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1.5px), rgba(255,255,255,0.022) calc(8.333333% - 0.75px), transparent 8.333333%)",
        }}
      />

      {/* Top-left */}
      <div className="absolute top-6 left-6 md:top-10 md:left-12 font-body text-[10px] uppercase tracking-[0.35em] text-white/75 leading-relaxed">
        Ashish B Kallada
        <br />
        <span className="opacity-55">Full Stack Engineer</span>
      </div>

      {/* Top-right */}
      <div className="absolute top-6 right-6 md:top-10 md:right-12 text-right font-body text-[10px] uppercase tracking-[0.35em] text-white/75 leading-relaxed">
        © 2026
        <br />
        <span className="opacity-55">Kerala · India</span>
      </div>

      {/* Center counter */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          ref={counterRef}
          className="font-headline italic text-white tabular-nums tracking-[-0.04em] leading-[0.85]"
          style={{ fontSize: "clamp(8rem, 32vh, 22rem)" }}
        >
          00
        </span>
      </div>

      {/* Bottom-left status */}
      <div className="absolute bottom-10 left-6 md:bottom-14 md:left-12 flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.35em] text-white/65">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3fd75e] animate-pulse" />
        Booting Portfolio
      </div>

      {/* Bottom-right tag */}
      <div className="absolute bottom-10 right-6 md:bottom-14 md:right-12 font-body text-[10px] uppercase tracking-[0.35em] text-white/65">
        ashcode &nbsp;/&nbsp; v.26
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <div
          ref={progressRef}
          className="h-full bg-white origin-left scale-x-0 will-change-transform"
        />
      </div>
    </>
  );
}

export default function LoadingScreen() {
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const counterTopRef = useRef<HTMLSpanElement>(null);
  const counterBottomRef = useRef<HTMLSpanElement>(null);
  const progressTopRef = useRef<HTMLDivElement>(null);
  const progressBottomRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!topHalfRef.current || !bottomHalfRef.current) return;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = prevOverflow;
        setHidden(true);
        window.dispatchEvent(new CustomEvent("loader:done"));
      },
    });

    // Counter ticks 00 → 100 (updates both copies)
    const counter = { value: 0 };
    tl.to(
      counter,
      {
        value: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = String(Math.floor(counter.value)).padStart(2, "0");
          if (counterTopRef.current) counterTopRef.current.textContent = v;
          if (counterBottomRef.current) counterBottomRef.current.textContent = v;
        },
      },
      0
    );

    // Progress bar fills in both halves
    tl.to(
      [progressTopRef.current, progressBottomRef.current],
      { scaleX: 1, duration: 1.6, ease: "power2.inOut" },
      0
    );

    // Brief hold at 100
    tl.to({}, { duration: 0.2 });

    // Split exit — top half slides up, bottom half slides down
    tl.to(
      topHalfRef.current,
      { yPercent: -100, duration: 1, ease: "expo.inOut" },
      ">"
    ).to(
      bottomHalfRef.current,
      { yPercent: 100, duration: 1, ease: "expo.inOut" },
      "<"
    );

    return () => {
      tl.kill();
      document.documentElement.style.overflow = prevOverflow;
    };
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden pointer-events-auto">
      {/* Top half — clipped to top 50% */}
      <div
        ref={topHalfRef}
        className="absolute inset-0 bg-black text-white will-change-transform"
        style={{ clipPath: "inset(0 0 50% 0)" }}
      >
        <LoaderContent counterRef={counterTopRef} progressRef={progressTopRef} />
      </div>

      {/* Bottom half — clipped to bottom 50% */}
      <div
        ref={bottomHalfRef}
        className="absolute inset-0 bg-black text-white will-change-transform"
        style={{ clipPath: "inset(50% 0 0 0)" }}
      >
        <LoaderContent counterRef={counterBottomRef} progressRef={progressBottomRef} />
      </div>
    </div>
  );
}
