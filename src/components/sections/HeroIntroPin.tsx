import { Hero } from "@/components/sections/Hero";
import { INTRO_STACK_START } from "@/components/sections/hero/heroIntroCycle";

// The hero holds still while the navbar panels slide, its figures exit
// sideways and clouds close over the screen and part on the About-me poster.
// The stage is sticky only within its own wrapper, so it releases as soon as
// the exit is done and the page scrolls on continuously into About. The exit
// follows the scroll exactly; nothing completes it on the user's behalf.
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
