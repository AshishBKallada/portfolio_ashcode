"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";

type RefPair = {
  counterRef: RefObject<HTMLSpanElement>;
  progressRef: RefObject<HTMLDivElement>;
  discRef: RefObject<HTMLDivElement>;
};

function LoaderContent({ counterRef, progressRef, discRef }: RefPair) {
  return (
    <>
      {/* Faint vertical grid — paper feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1.5px), rgba(255,255,255,0.022) calc(8.333333% - 0.75px), transparent 8.333333%)",
        }}
      />

      {/* Top-left — bilingual */}
      <div className="absolute top-6 left-6 md:top-10 md:left-12 font-body text-[10px] uppercase tracking-[0.35em] text-[#E1E0CC]/75 leading-relaxed">
        Ashish B Kallada
        <br />
        <span className="opacity-55 tracking-[0.25em]">フルスタック・エンジニア</span>
      </div>

      {/* Top-right — date */}
      <div className="absolute top-6 right-6 md:top-10 md:right-12 text-right font-body text-[10px] uppercase tracking-[0.35em] text-[#E1E0CC]/75 leading-relaxed">
        令和八年 · 2026
        <br />
        <span className="opacity-55">Kerala · India</span>
      </div>

      {/* Hinomaru disc + counter overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={discRef}
          className="absolute rounded-full bg-[#bc002d] shadow-[0_0_140px_rgba(188,0,45,0.45)] will-change-transform"
          style={{ width: "48vmin", height: "48vmin" }}
        />
        <span
          ref={counterRef}
          className="relative font-headline italic text-[#E1E0CC] tabular-nums tracking-[-0.04em] leading-[0.85] drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]"
          style={{ fontSize: "clamp(7rem, 28vh, 20rem)" }}
        >
          00
        </span>
      </div>

      {/* Vertical kanji column — right side: 侍 · 魂 · 道 (Samurai · Soul · Way) */}
      <div
        aria-hidden
        className="absolute top-1/2 right-6 md:right-12 -translate-y-1/2 flex flex-col items-center gap-5 font-headline text-[#E1E0CC]/65 text-2xl md:text-[28px] pointer-events-none leading-none"
      >
        <span>侍</span>
        <span className="w-px h-4 bg-[#E1E0CC]/25" />
        <span>魂</span>
        <span className="w-px h-4 bg-[#E1E0CC]/25" />
        <span>道</span>
      </div>

      {/* Vertical English — left side */}
      <div
        aria-hidden
        className="absolute top-1/2 left-6 md:left-12 -translate-y-1/2 font-body text-[10px] uppercase tracking-[0.55em] text-[#E1E0CC]/55 pointer-events-none"
        style={{ writingMode: "vertical-rl" }}
      >
        Obsession beats talent
      </div>

      {/* Bottom-left status */}
      <div className="absolute bottom-10 left-6 md:bottom-14 md:left-12 flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.35em] text-[#E1E0CC]/70">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff1a1a] animate-pulse" />
        起動中 · Booting Portfolio
      </div>

      {/* Bottom-right tag */}
      <div className="absolute bottom-10 right-6 md:bottom-14 md:right-12 font-body text-[10px] uppercase tracking-[0.35em] text-[#E1E0CC]/70">
        ashcode &nbsp;/&nbsp; v.26
      </div>

      {/* Progress bar — red brush */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E1E0CC]/10">
        <div
          ref={progressRef}
          className="h-full bg-[#bc002d] origin-left scale-x-0 will-change-transform shadow-[0_0_12px_rgba(188,0,45,0.6)]"
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
  const discTopRef = useRef<HTMLDivElement>(null);
  const discBottomRef = useRef<HTMLDivElement>(null);
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

    // Hinomaru disc grows in alongside the count
    if (discTopRef.current && discBottomRef.current) {
      gsap.set([discTopRef.current, discBottomRef.current], {
        scale: 0.6,
        opacity: 0,
      });
      tl.to(
        [discTopRef.current, discBottomRef.current],
        { scale: 1, opacity: 1, duration: 1.4, ease: "power3.out" },
        0
      );
    }

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
    tl.to({}, { duration: 0.25 });

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
        className="absolute inset-0 bg-[#0a0a0a] text-[#E1E0CC] will-change-transform"
        style={{ clipPath: "inset(0 0 50% 0)" }}
      >
        <LoaderContent
          counterRef={counterTopRef}
          progressRef={progressTopRef}
          discRef={discTopRef}
        />
      </div>

      {/* Bottom half — clipped to bottom 50% */}
      <div
        ref={bottomHalfRef}
        className="absolute inset-0 bg-[#0a0a0a] text-[#E1E0CC] will-change-transform"
        style={{ clipPath: "inset(50% 0 0 0)" }}
      >
        <LoaderContent
          counterRef={counterBottomRef}
          progressRef={progressBottomRef}
          discRef={discBottomRef}
        />
      </div>
    </div>
  );
}
