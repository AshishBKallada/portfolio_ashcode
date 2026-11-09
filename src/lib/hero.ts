import { optimizedSrc } from "@/lib/images";

// Hero art and the scroll timeline shared by the hero, navbar and loader.

/** Full-bleed photograph behind the home hero (SkyHero). */
export const HERO_BG = { src: "/images/hero/hero-dunes.webp", width: 1352, height: 784 };

/** Transparent cutout above the cumulus — the Winged Courier as a marble statue (Photoroom export), as a WebP with lossless alpha. */
export const HERO_FIGURE = {
  src: "/images/hero/hero-figure-marble.webp",
  width: 1024,
  height: 1024,
};

/** The hero's courier, in colour: black robes, a red cape with gold trim, the case whole. */
export const HERO_COURIER = { src: "/images/hero/hero-courier-cape.webp", width: 1000, height: 744 };

/** The courier as he was, in black, sized and placed to sit exactly under HERO_FIGURE: the pixel reveal's underlayer. */
export const HERO_FIGURE_UNDER = "/images/hero/hero-figure-courier-under.webp";

/** Harp cutout, used in the résumé page's header. */
export const HERO_HARP = { src: "/images/hero/float-harp.png", width: 941, height: 1672 };

/** Image quality for cloud art; must be listed in next.config `qualities`. */
export const CLOUD_QUALITY = 90;

/** White cumulus the figure floats above, drawn behind its feet. */
export const HERO_SEAT_CLOUD = { src: "/images/clouds/cumulus.png", width: 1000, height: 563 };

/** Viewport heights while the hero is pinned: flip, hold on About, then cloud/figure reveal. */
export const CARD_FLIP_VH = 0.42;
/** Centred card stays on About before the rail morph and reveal begin. */
export const CARD_ABOUT_HOLD_VH = 0.45;
export const REVEAL_VH = 1.1;
export const HERO_PIN_VH = CARD_FLIP_VH + CARD_ABOUT_HOLD_VH + REVEAL_VH;
/**
 * The exit to Work starts halfway through the reveal, not after it: the hero is
 * let go there and, over the next HERO_EXIT_VH as it scrolls away, drifts slower
 * than the page and dims (the reveal finishing as it goes), while Work rises
 * under a curved edge (EditionWork).
 */
export const HERO_EXIT_AT = CARD_FLIP_VH + CARD_ABOUT_HOLD_VH + REVEAL_VH * 0.5;
export const HERO_EXIT_VH = 1;
/** How long HeroStage holds the hero pinned, in viewport heights. */
export const HERO_STAGE_PIN_VH = HERO_EXIT_AT;

/**
 * Optimized URLs for the hero art drawn outside <Image> (plain img, canvas).
 * The loader preloads these same URLs, so the hero paints from cache.
 */
/** The pre-encoded WebP as is: its alpha is lossless, so the cutout's edge stays clean. */
export const HERO_FIGURE_URL = HERO_FIGURE.src;
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
