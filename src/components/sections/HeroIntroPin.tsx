"use client";

import { Hero } from "@/components/sections/Hero";
import { INTRO_STACK_START } from "@/components/sections/hero/heroIntroCycle";

// The hero holds still while the navbar panels slide and its figures exit
// sideways, uncovering the About-me poster behind them. The stage is sticky
// only within its own wrapper, so it releases as soon as the figures are gone
// and the page scrolls on continuously into About.
export function HeroIntroPin() {
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
