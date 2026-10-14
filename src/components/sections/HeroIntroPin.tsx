import { Hero } from "@/components/sections/Hero";
import { FEED, INTRO_STACK_START } from "@/components/sections/hero/heroIntroCycle";

// The hero holds still while the laptop glides in and plays the About pages
// on its screen, then zooms its display out to fill the stage. The stage is
// sticky only within its own wrapper, so it releases as soon as that is
// done and the page scrolls on continuously into Projects. Everything
// follows the scroll exactly; nothing completes it on the user's behalf.
// The run's length depends on the About gallery's width, so the hero sets
// --feed-extra (px) once it has measured it.
export function HeroIntroPin() {
  return (
    // A deeper red than the hero behind the stage, so its opening window
    // reads as a window rather than blending into the page.
    <div className="relative bg-[#260707]">
      <div className="hero-stage sticky top-0 z-10 h-dvh min-h-svh overflow-hidden bg-transparent">
        <div className="absolute inset-0 z-0">
          <Hero />
        </div>
        {/* The beam of light the hero's gates open from (driven by Hero). */}
        <div
          data-hero-beam
          aria-hidden
          className="pointer-events-none invisible absolute inset-y-0 left-1/2 z-[1] w-0.5 origin-top -translate-x-1/2 bg-cream opacity-0 shadow-[0_0_28px_8px_rgba(244,241,234,0.55)]"
        />
      </div>
      <div
        style={{ height: `calc(${INTRO_STACK_START * 100}dvh + var(--feed-extra, 0px))` }}
        className="relative"
        aria-hidden
      >
        {/* Where the About section sits on the laptop's screen, for /#about. */}
        <span
          id="about"
          style={{ top: `${(INTRO_STACK_START + FEED.hold + FEED.rise - 1) * 100}dvh` }}
          className="absolute left-0"
        />
      </div>
    </div>
  );
}
