/** Shown in the loader intro sequence only (not the hero frame). */
export const HERO_INTRO_CYCLE = ["/images/hero/hero-overlay.png"] as const;

/** Hero background image after intro zoom. */
export const HERO_INTRO_FRAME = "/images/hero/hero-bg.png";

/** Transparent cutout layered above the hero background. */
export const HERO_OVERLAY = "/images/hero/hero-overlay.png";

/** Secondary cutout floating to the right of the figure (3/4 across). */
export const HERO_SIDE = "/images/hero/float-guitar.png";

/** Cloud cutout the figure floats above, drawn behind its feet. */
export const HERO_CLOUD = "/images/hero/cloud.png";

export const HERO_INTRO_STEP_MS = 320;

export const heroIntroSequenceMs =
  (HERO_INTRO_CYCLE.length - 1) * HERO_INTRO_STEP_MS;

/**
 * Viewport-heights of scroll the hero holds still before its figures start
 * sliding away. Zero: the exit begins with the first scroll.
 */
export const HERO_HOLD_SCREENS = 0;

/**
 * Scroll timeline (in viewport heights) after the hold: the hero figures
 * exit sideways over one screen, revealing the centered line behind them,
 * and only then does the next section stack up over the hero.
 */
export const HERO_EXIT_START = HERO_HOLD_SCREENS;
export const INTRO_STACK_START = HERO_EXIT_START + 1;
