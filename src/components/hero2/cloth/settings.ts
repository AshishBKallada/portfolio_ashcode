/** The cloth's look and feel. Lengths are in screen units: 1.0 = the hero's height. */
export const CLOTH = {
  /** Cloth height as a share of the hero's height. */
  size: 0.9,
  /** Width over height. */
  aspect: 1.12,
  /** How far apart the pins sit, as a share of the cloth's width. */
  spread: 0.98,
  /** Degrees the line between the pins leans: the left pin sits higher. */
  pinRoll: 5.5,
  flutter: 0.35,
  damping: 0.3,
  stiffness: 0.6,
  crumple: 0.55,
  /** Pick radius, as a share of the hero's height. */
  grabRadius: 0.12,
  /** How much of the cloth around the grabbed point is carried, as a share of its height. */
  carryRadius: 0.2,
  gravity: 2.6,
  /** Camera, in degrees. */
  tilt: -10,
  turn: -12,
  /** 0 = nearly flat, 1 = strong perspective. */
  perspective: 0.45,
  maxSpeed: 12,
  steps: 8,
} as const;

export const COLS = 46;
export const ROWS = 42;
export const CH = CLOTH.size;
export const CW = CLOTH.size * CLOTH.aspect;

/** The cloth print: 1024×1024 (power of two, for mipmaps), from public/. */
export const CLOTH_IMAGE = "/images/hero/cloth-immortal.jpg";
