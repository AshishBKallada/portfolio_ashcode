import { optimizedSrc } from "@/lib/images";

// Hero art and the scroll timeline shared by the hero, navbar and loader.

/** Full-bleed photograph behind the home hero (SkyHero). */
export const HERO_BG = { src: "/images/hero/hero-bg.png", width: 1376, height: 768 };

/** Transparent cutout above the cumulus — Winged Courier (latest Photoroom export). */
export const HERO_FIGURE = {
  src: "/images/hero/hero-figure-winged-courier.png",
  width: 1303,
  height: 1207,
};

/** Marble twin of the figure, revealed under the cursor (same size). */
export const HERO_MARBLE = { src: "/images/hero/hero-marble.png", width: 1445, height: 1089 };

/** Harp cutout, used in the résumé page's header. */
export const HERO_HARP = { src: "/images/hero/float-harp.png", width: 941, height: 1672 };

/** Sunset cloud cutout, used in the hero's drifting sky. */
export const HERO_CLOUD = { src: "/images/hero/cloud.png", width: 1024, height: 1024 };

/** Image quality for cloud art; must be listed in next.config `qualities`. */
export const CLOUD_QUALITY = 90;

/** White cumulus the figure floats above, drawn behind its feet. */
export const HERO_SEAT_CLOUD = { src: "/images/clouds/cumulus.png", width: 1000, height: 563 };

/** Cursor-driven head-turn sequence on the home hero (SkyHero / HeadFollow). */
export const HERO_HEAD_COUNT = 25;
export const HEAD_FRAME_SIZE = { width: 3840, height: 3344 };
/** Bump when replacing public/images/hero/head/*.webp so browsers skip stale cache. */
export const HERO_HEAD_ASSET_VERSION = "4k-2026-10-18";

export const heroHeadFrameSrc = (index: number) =>
  `/images/hero/head/head-${String(index).padStart(2, "0")}.webp?v=${HERO_HEAD_ASSET_VERSION}`;

export const HERO_HEAD_FRAME_URLS = Array.from({ length: HERO_HEAD_COUNT }, (_, i) =>
  heroHeadFrameSrc(i),
);

/**
 * Optimized URLs for the hero art drawn outside <Image> (plain img, canvas).
 * The loader preloads these same URLs, so the hero paints from cache.
 */
/** Raw PNG keeps alpha clean on the hero cutout (no optimizer cache). */
export const HERO_FIGURE_URL = HERO_FIGURE.src;
export const HERO_MARBLE_URL = optimizedSrc(HERO_MARBLE);
export const HERO_SEAT_CLOUD_URL = optimizedSrc(HERO_SEAT_CLOUD, CLOUD_QUALITY);

/**
 * Height of the hero figure as a fraction of the hero. The img is
 * object-contain + bottom-aligned, so change it here only.
 */
export const HERO_FIGURE_HEIGHT = 0.6;

/**
 * How far the figure's feet sit above the hero's bottom edge, as a fraction
 * of the hero. Set as the `--hero-lift` CSS variable on the figure wrapper:
 * phones lift the figure clear of the headline and CTA below it.
 */
export const HERO_FIGURE_LIFT_CLASS = "[--hero-lift:0.07] max-md:[--hero-lift:0.32]";

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
 * Beats of the exit, as shares of it: one camera push into the laptop. The
 * laptop turns to face the viewer and glides in until it is framed large in
 * the centre, its screen showing the About-me poster, while the figure eases
 * back a little behind it and his cloud drifts aside.
 */
export const EXIT_FIGURES = [0.04, 0.7] as const;
export const EXIT_LAPTOP = [0.04, 1] as const;

/**
 * After the exit the laptop holds its frame while the screen plays the
 * About pages, in viewport heights of scroll: a beat on the poster, the
 * screen scrolling up to the About section, then (for as many px as the
 * gallery travels) its photos sliding by, and finally the display zooming
 * out to fill the stage before the page carries on into Projects.
 */
export const FEED = { hold: 0.35, rise: 1, spill: 0.6 } as const;

/** Scroll position (px) `t` of the way through the hero's exit. */
export const exitAt = (t: number) =>
  window.innerHeight * (HERO_EXIT_START + t * HERO_EXIT_SCREENS);
