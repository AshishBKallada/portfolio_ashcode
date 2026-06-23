"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { colors } from "@/lib/theme/colors";
import { SITE } from "@/lib/constants/site";

const COUNTER_DURATION = 1.6;
const FADE_DURATION = 0.5;

export default function LoadingScreen() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!hidden) return;
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent("loader:done"));
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [hidden]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const percent = percentRef.current;
    const bar = barRef.current;
    if (!overlay) return;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = prevOverflow;
        setHidden(true);
      },
    });

    tl.to(counter, {
      value: 100,
      duration: COUNTER_DURATION,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(counter.value);
        if (percent) percent.textContent = v.toString().padStart(3, "0");
        if (bar) bar.style.transform = `scaleX(${counter.value / 100})`;
      },
    });

    tl.to(overlay, {
      opacity: 0,
      duration: FADE_DURATION,
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
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center pointer-events-auto"
      style={{ backgroundColor: colors.loader.bg, color: colors.loader.fg }}
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="font-main not-italic leading-none tracking-tight text-[clamp(3.5rem,12vw,9rem)]">
        {SITE.brand}.
      </span>
      <div className="mt-8 md:mt-10 flex items-center gap-4">
        <span
          aria-hidden
          ref={barRef}
          className="block h-px w-32 md:w-44 origin-left bg-current opacity-60"
          style={{ transform: "scaleX(0)" }}
        />
        <span
          ref={percentRef}
          className="font-body text-[10px] uppercase tracking-[0.32em] tabular-nums opacity-60"
        >
          000
        </span>
      </div>
    </div>
  );
}
