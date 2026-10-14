/** Shown in the loader intro sequence only (not the hero frame). */
export const HERO_INTRO_CYCLE = ["/images/hero/hero-figure.png"] as const;

/** Hero background image after intro zoom. */
export const HERO_INTRO_FRAME = "/images/hero/hero-bg.png";

/** Transparent cutout layered above the hero background. */
export const HERO_OVERLAY = "/images/hero/hero-figure.png";

/** Secondary cutout floating to the right of the figure (3/4 across). */
export const HERO_SIDE = "/images/hero/float-harp.png";

/** Sunset cloud cutout, used in the hero's drifting sky. */
export const HERO_CLOUD = "/images/hero/cloud.png";

/** White cumulus the figure floats above, drawn behind its feet (1000×563). */
export const HERO_SEAT_CLOUD = "/images/clouds/cumulus.png";

/**
 * Height of the hero figure as a fraction of the hero. The img is
 * object-contain + bottom-aligned, and the loader handoff derives its drawn
 * rect from this same number, so change it here only.
 */
export const HERO_FIGURE_HEIGHT = 0.66;

/**
 * How far the figure's feet sit above the hero's bottom edge, as a fraction
 * of the hero. Set as the `--hero-lift` CSS variable on the figure wrapper:
 * phones lift the figure clear of the headline and CTA below it, and the
 * loader handoff reads the live value back so both stay in step.
 */
export const HERO_FIGURE_LIFT_CLASS = "[--hero-lift:0.07] max-md:[--hero-lift:0.32]";

export const HERO_INTRO_STEP_MS = 320;

/**
 * Viewport-heights of scroll the hero holds still before its figures start
 * sliding away. Zero: the exit begins with the first scroll.
 */
export const HERO_HOLD_SCREENS = 0;

/**
 * Scroll timeline (in viewport heights) after the hold: the hero's exit runs
 * over HERO_EXIT_SCREENS, and only then does the next section stack up over
 * the hero.
 */
export const HERO_EXIT_START = HERO_HOLD_SCREENS;
export const HERO_EXIT_SCREENS = 1.1;
export const INTRO_STACK_START = HERO_EXIT_START + HERO_EXIT_SCREENS;

/**
 * Beats of the exit, as shares of it. From the first scroll the figures
 * drift apart left and right, and between them the About-me poster opens
 * from a small rounded window in the centre until it fills the screen.
 */
export const EXIT_FIGURES = [0, 0.6] as const;
export const EXIT_REVEAL = [0.08, 0.9] as const;

/** Scroll position (px) `t` of the way through the hero's exit. */
export const exitAt = (t: number) =>
  window.innerHeight * (HERO_EXIT_START + t * HERO_EXIT_SCREENS);
