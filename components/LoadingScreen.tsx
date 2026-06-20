"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { BRAND, LOADER_CYCLES, LOADER_LABELS, LOADER_STEP_DURATION } from "@/lib/constants";
import { colors, themeClasses } from "@/lib/theme";

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

    text.textContent = LOADER_LABELS[0];
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
          duration: LOADER_STEP_DURATION,
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
          duration: LOADER_STEP_DURATION * 0.4,
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
          duration: LOADER_STEP_DURATION * 0.6,
          ease: "power2.out",
        },
        `${position}+=${LOADER_STEP_DURATION * 0.4}`
      );
    };

    for (let i = 0; i < LOADER_CYCLES; i++) {
      const nextLabel = LOADER_LABELS[(i + 1) % LOADER_LABELS.length];
      const endPercent = Math.round(((i + 1) / LOADER_CYCLES) * 100);
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
      className={themeClasses.loader.overlay}
      style={{ backgroundColor: colors.loader.bg, color: colors.loader.text }}
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
    >
      <span
        ref={textRef}
        className="font-headline text-2xl md:text-3xl italic tracking-[-0.02em] will-change-transform"
      >
        {BRAND.name}
      </span>

      <span
        ref={percentRef}
        className={themeClasses.loader.percent}
        style={{ fontSize: "clamp(4rem, 18vw, 12rem)", color: `${colors.loader.text}cc` }}
        aria-hidden
      >
        0%
      </span>
    </div>
  );
}
