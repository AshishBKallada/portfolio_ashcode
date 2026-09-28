/** Shown in the loader intro sequence only (not the hero frame). */
export const HERO_INTRO_CYCLE = ["/images/hero/hero-overlay.png"] as const;

/** Hero background image after intro zoom. */
export const HERO_INTRO_FRAME = "/images/hero/hero-bg.png";

/** Transparent cutout layered above the hero background. */
export const HERO_OVERLAY = "/images/hero/hero-overlay.png";

/** Secondary cutout floating to the right of the figure (3/4 across). */
export const HERO_SIDE = "/images/hero/hero-side.png";

export const HERO_INTRO_STEP_MS = 320;

export const heroIntroSequenceMs =
  (HERO_INTRO_CYCLE.length - 1) * HERO_INTRO_STEP_MS;
