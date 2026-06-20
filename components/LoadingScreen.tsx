"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const LABELS = ["Ashcode", "アッシュコード"] as const;
const CYCLES = 3;
const STEP_DURATION = 0.9;

export default function LoadingScreen() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!hidden) return;

    // Wait for overlay to unmount before hero entrance starts
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent("loader:done"));
      });
    });

    return () => window.cancelAnimationFrame(id);
  }, [hidden]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const text = textRef.current;
    const percent = percentRef.current;
    if (!overlay || !text) return;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    text.textContent = LABELS[0];
    if (percent) percent.textContent = "0%";

    const counter = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = prevOverflow;
        setHidden(true);
      },
    });

    const addSyncedStep = (nextLabel: string, endPercent: number, position: string | number = ">") => {
      tl.to(
        counter,
        {
          value: endPercent,
          duration: STEP_DURATION,
          ease: "power2.inOut",
          onUpdate: () => {
            if (percent) {
              percent.textContent = `${Math.round(counter.value)}%`;
            }
          },
        },
        position
      );

      tl.to(
        text,
        {
          y: -10,
          opacity: 0,
          duration: STEP_DURATION * 0.4,
          ease: "power2.in",
          onComplete: () => {
            text.textContent = nextLabel;
          },
        },
        position
      );

      tl.to(
        text,
        {
          y: 0,
          opacity: 1,
          duration: STEP_DURATION * 0.6,
          ease: "power2.out",
        },
        `${position}+=${STEP_DURATION * 0.4}`
      );
    };

    for (let i = 0; i < CYCLES; i++) {
      const nextLabel = LABELS[(i + 1) % LABELS.length];
      const endPercent = Math.round(((i + 1) / CYCLES) * 100);
      addSyncedStep(nextLabel, endPercent, i === 0 ? 0 : ">");
    }

    tl.to({}, { duration: 0.2 });

    tl.to(overlay, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
      document.documentElement.style.overflow = prevOverflow;
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black text-[#E1E0CC] pointer-events-auto"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
    >
      <span
        ref={textRef}
        className="font-headline text-2xl md:text-3xl italic tracking-[-0.02em] will-change-transform"
      >
        Ashcode
      </span>

      <span
        ref={percentRef}
        className="absolute bottom-4 right-4 md:bottom-8 md:right-10 font-headline italic tabular-nums tracking-[-0.04em] leading-none text-[#E1E0CC]/80"
        style={{ fontSize: "clamp(4rem, 18vw, 12rem)" }}
        aria-hidden
      >
        0%
      </span>
    </div>
  );
}
