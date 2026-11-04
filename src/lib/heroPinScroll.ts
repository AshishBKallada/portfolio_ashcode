import { CARD_ABOUT_HOLD_VH, CARD_FLIP_VH, HERO_PIN_VH } from "@/lib/hero";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Scroll phases while the home hero is pinned: flip, hold About on the card, then reveal. */
export function heroPinPhases(scrollY: number, vh = typeof window !== "undefined" ? window.innerHeight : 800) {
  const flipEnd = vh * CARD_FLIP_VH;
  const holdEnd = flipEnd + vh * CARD_ABOUT_HOLD_VH;
  const pinEnd = vh * HERO_PIN_VH;
  const flip = flipEnd <= 0 ? 1 : clamp01(scrollY / flipEnd);
  const revealSpan = pinEnd - holdEnd;
  const reveal = revealSpan <= 0 ? 0 : clamp01((scrollY - holdEnd) / revealSpan);
  return { flip, reveal, flipEnd, holdEnd, pinEnd };
}

/** Scroll past this before the nav card morphs into the rail (after the About hold). */
export const navMorphScrollY = (vh = typeof window !== "undefined" ? window.innerHeight : 800) =>
  vh * (CARD_FLIP_VH + CARD_ABOUT_HOLD_VH);
