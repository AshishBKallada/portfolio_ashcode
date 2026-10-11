"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { Hero } from "@/components/sections/Hero";
import {
  HERO_EXIT_START,
  INTRO_STACK_START,
} from "@/components/sections/hero/heroIntroCycle";

/** Past this share of the exit, a pause completes it; before it, it rewinds. */
const SNAP_FORWARD_AT = 0.15;
/** How long the scroll has to be quiet before the exit auto-completes. */
const SETTLE_MS = 140;

// The hero holds still while the navbar panels slide and its figures exit
// sideways, uncovering the About-me poster behind them. The stage is sticky
// only within its own wrapper, so it releases as soon as the figures are gone
// and the page scrolls on continuously into About.
export function HeroIntroPin() {
  const snapping = useRef(false);
  const timer = useRef(0);

  // Never leave the hero half-exited: once scrolling settles inside the exit
  // window, Lenis carries the page on to the About-me poster (or back to the
  // top if the exit had barely begun). A wheel or touch mid-snap hands
  // control straight back to the user.
  useLenis((lenis) => {
    if (snapping.current) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const vh = window.innerHeight;
      const start = vh * HERO_EXIT_START;
      const end = vh * (HERO_EXIT_START + 1);
      const s = lenis.scroll;
      if (s <= start + 1 || s >= end - 1) return;
      const progress = (s - start) / (end - start);
      const target = progress >= SNAP_FORWARD_AT ? end : start;
      snapping.current = true;
      lenis.scrollTo(target, {
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
          snapping.current = false;
        },
      });
    }, SETTLE_MS);
  });

  useEffect(() => {
    const release = () => {
      snapping.current = false;
    };
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    return () => {
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="relative">
      <div className="hero-stage sticky top-0 z-10 h-dvh min-h-svh overflow-hidden bg-transparent">
        <div className="absolute inset-0 z-0">
          <Hero />
        </div>
      </div>
      <div style={{ height: `${INTRO_STACK_START * 100}dvh` }} aria-hidden />
    </div>
  );
}
