"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { Hero } from "@/components/sections/Hero";
import {
  HERO_EXIT_START,
  INTRO_STACK_START,
} from "@/components/sections/hero/heroIntroCycle";

/**
 * How far into the exit (in the direction you are scrolling) a pause has to
 * be before it completes that way; short of it, the hero settles back.
 */
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
  // Last direction the user actually scrolled: 1 down, -1 up.
  const direction = useRef(1);

  // Never leave the hero half-exited: once scrolling settles inside the exit
  // window, Lenis finishes the move the user was making — on to the About-me
  // poster when heading down, back to the hero when heading up — unless they
  // had barely started it. A wheel or touch mid-snap hands control straight
  // back to the user.
  useLenis((lenis) => {
    if (snapping.current) return;
    if (lenis.direction) direction.current = lenis.direction;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const vh = window.innerHeight;
      const start = vh * HERO_EXIT_START;
      const end = vh * (HERO_EXIT_START + 1);
      const s = lenis.scroll;
      if (s <= start + 1 || s >= end - 1) return;
      const progress = (s - start) / (end - start);
      const target =
        direction.current < 0
          ? progress <= 1 - SNAP_FORWARD_AT
            ? start
            : end
          : progress >= SNAP_FORWARD_AT
            ? end
            : start;
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
