/**
 * The awakening's score: where each pose of the Cursed King holds on the scroll, and the
 * curves the background, energy and camera follow. Everything reads one number, p, from
 * 0 (top of the page) to 1 (end of the hero's travel).
 */

/** The hero pins for this long; the sheet starts rising two screens before the end, just as the travel ends. */
export const AWAKENING_RUNWAY_SVH = 580;
/** Of that, the screens the awakening plays across. */
export const AWAKENING_TRAVEL_SVH = 380;

/** Where the palms meet. */
export const CLAP = 0.68;

/** The cutouts share one canvas (scripts/art/cutout_cursed_king.py), so poses stay registered. */
export const FRAME_W = 816;
export const FRAME_H = 551;

type Frame = {
  src: string;
  /** p at which this pose has fully taken over from the one before. */
  at: number;
  /** How much scroll the hand-over takes; anime cuts fast, so these are short. */
  blend: number;
  /** Strength of the red glow behind this pose. */
  glow: number;
};

export const FRAMES: Frame[] = [
  { src: "/images/awakening/01-clasp.webp", at: 0, blend: 0, glow: 0 },
  { src: "/images/awakening/02-part.webp", at: 0.13, blend: 0.03, glow: 0 },
  { src: "/images/awakening/03-open.webp", at: 0.27, blend: 0.035, glow: 0.15 },
  { src: "/images/awakening/04-wide.webp", at: 0.43, blend: 0.035, glow: 0.35 },
  { src: "/images/awakening/05-swing.webp", at: 0.655, blend: 0.012, glow: 0.55 },
  { src: "/images/awakening/06-clap.webp", at: CLAP, blend: 0.006, glow: 0.8 },
  { src: "/images/awakening/06b-clap-lit.webp", at: 0.705, blend: 0.012, glow: 1 },
  { src: "/images/awakening/07-final.webp", at: 0.83, blend: 0.04, glow: 1 },
];

/** Points on the figure in frame space (0 to 1): energy gathers at the hands, bursts from the clap. */
export const POINTS = {
  face: { x: 0.5, y: 0.2 },
  wideHands: [
    { x: 0.07, y: 0.48 },
    { x: 0.93, y: 0.48 },
  ],
  clap: { x: 0.5, y: 0.44 },
} as const;

export const STAGES = [
  { from: 0, label: "Calm" },
  { from: 0.2, label: "Tension" },
  { from: 0.45, label: "Gathering" },
  { from: CLAP - 0.01, label: "Impact" },
  { from: 0.75, label: "Domain" },
] as const;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 0 before a, 1 after b, eased between. */
export const ramp = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Opacity of every pose at p. Each pose fades in over its blend; the pose beneath it holds
 * until the new one is half in, then fades, so the body never thins while the arms change.
 */
export function frameOpacities(p: number, out: number[]) {
  for (let i = 0; i < FRAMES.length; i++) {
    const f = FRAMES[i];
    const shown = i === 0 ? 1 : f.blend ? clamp01((p - (f.at - f.blend)) / f.blend) : p >= f.at ? 1 : 0;
    out[i] = shown;
  }
  for (let i = 0; i < FRAMES.length - 1; i++) out[i] *= 1 - clamp01((out[i + 1] - 0.5) * 2);
  return out;
}

/** How charged the scene is: a trickle at rest, building to the clap, full after. */
export const charge = (p: number) =>
  p < CLAP ? lerp(0.04, 0.75, ramp(p, 0.12, CLAP)) : lerp(1, 0.8, ramp(p, CLAP, 1));

/** 0 while the page is white, 1 once the clap has turned it crimson and black. The dark spreads
 *  out from his hands as a circle (see AwakeningHero), so this is how far it has reached. */
export const darkness = (p: number) => ramp(p, CLAP - 0.002, CLAP + 0.035);

/** Camera: a slow push-in to the clap, a jolt back on impact, then settling on the final pose. */
export function camera(p: number) {
  if (p < CLAP) {
    const push = ramp(p, 0.08, CLAP);
    return { scale: lerp(1, 1.16, push), lift: lerp(0, 0.03, push) };
  }
  const settle = ramp(p, CLAP, 0.9);
  return { scale: lerp(1.04, 1.08, settle), lift: lerp(0.01, 0.015, settle) };
}

/**
 * On a phone the figure is sized so his spread arms fit, which leaves him small when they're
 * closed. So the camera cuts in close on the closed poses and pulls back for the open ones,
 * with a punch-in on the clap.
 */
export function phoneZoom(p: number) {
  const open = ramp(p, 0.2, 0.3) * (1 - ramp(p, 0.64, 0.68)) + ramp(p, 0.79, 0.85);
  return lerp(1.45, 1, open);
}
