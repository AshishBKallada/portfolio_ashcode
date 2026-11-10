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

/**
 * The hero's sky: the desert panorama with its own portal painted out
 * (scripts/blender/paint_out_portal.py), on a dome round the modelled one (HeroWorld).
 * Phones take the half-size copy.
 */
export const HERO_SKY = { wide: "/images/hero/pano/desert-4k-sky.webp", narrow: "/images/hero/pano/desert-2k-sky.webp" };
export const heroSkySrc = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches ? HERO_SKY.wide : HERO_SKY.narrow;

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
