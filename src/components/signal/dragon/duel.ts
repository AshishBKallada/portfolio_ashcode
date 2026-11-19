import { Vector3 } from "three";
import { key, smooth, Track } from "./film";

/**
 * The fight in the hero's sky, on the film clock (film.ts): the two dragons, the red one
 * from the left and the long white glassy one from the right. The sky darkens into a storm around them.
 *
 *  9–11      The air tightens before they show: pressure, dust hanging, a rising hum.
 *  11–12.9   They rocket in from the edges, head first.
 *  12.9–14   They meet: brake, square off across the sky, and the red one roars.
 *  14–15.3   The red one breaks away: it flies to the middle of the frame and climbs out
 *            of the top of it.
 *  15.3–16.3 The white one holds alone, turned to the lower left, waiting.
 *  16.3–     Just before the red one shows, the white one fires: a beam of light down to the
 *            lower left, where it is coming from.
 *  16.1–16.8 Out of that corner the red one rises back, right in front of us: only its huge
 *            head and neck in frame, the body trailing away below, facing up at the other.
 *  16.85–    It fires back, a beam of fire; the two beams lock and push at a white-hot seam.
 *  17.4      Impact at the seam. One frozen beat, then the flash, the shock ring and the blast.
 *  17.5–19   Thrown apart; the red one sails back up into the sky.
 *  18.6–     They float, hovering face to face, each on its own side, bobbing, swaying in and
 *            out and slowly climbing, till the loop ends. They never touch.
 */
export const D_IN = 11;
/** The red one breaks away and climbs out of the top of the frame. */
export const D_EXIT = [14.0, 15.3] as const;
/** the white one's beam, then the red one's answer from the corner: both end at the impact. */
export const D_FIRE_X = [16.3, 17.4] as const;
export const D_FIRE_C = [16.85, 17.4] as const;
export const D_HIT = 17.4;
/** The frozen beat on impact, before the flash. */
export const D_HOLD = 0.14;
export const D_BOOM = D_HIT + D_HOLD;
/** The float after the clash: how far apart they hold, how fast they sway, how fast they climb. */
const FLOAT_FROM = 18.6;
const FLOAT_R = 7.5;
const FLOAT_W = 0.7;
const FLOAT_RISE = 0.3;
/** When the blast wind reaches the courier, after the boom. */
export const D_GUST = D_BOOM + 0.3;

/**
 * Where the clash goes off: the seam between the beams at the impact. The scene writes it as
 * the beams lock; the flash and the shock rings read it.
 */
export const clashPoint = new Vector3(-4, 14, 18);

/**
 * Where they meet, in world space (outside the dragons' turned frame): the open sky above the
 * portal and right of it, clear of the nav card and the courier's head.
 */
export const D_POINT = new Vector3(-4, 18.5, 2);
/** The line they fight along, amber to obsidian: turned a little so we see them three-quarter on. */
export const D_AXIS = new Vector3(1, 0, -0.35).normalize();

/** The duel's own time: the film's, but frozen for D_HOLD at the impact. */
export const duelT = (t: number) => (t < D_HIT ? t : t < D_BOOM ? D_HIT : t - D_HOLD);

const along = (d: number, dy: number, dz = 0) => {
  const p = D_POINT.clone().addScaledVector(D_AXIS, d);
  return [p.x, p.y + dy, p.z + dz] as const;
};
const rel = (x: number, y: number, z: number) => [D_POINT.x + x, D_POINT.y + y, D_POINT.z + z] as const;
const k = (t: number, p: readonly [number, number, number]) => key(t, p[0], p[1], p[2]);

/** Where each floats after the clash, on its own side (`side` -1 left, 1 right). */
function float(side: number) {
  const out: ReturnType<typeof k>[] = [];
  for (let u = FLOAT_FROM; u <= 40; u += 0.4) {
    const a = (u - FLOAT_FROM) * FLOAT_W + (side > 0 ? 1.4 : 0);
    const r = FLOAT_R * (1 + 0.14 * Math.sin(a));
    const p = D_POINT.clone().addScaledVector(D_AXIS, side * r);
    out.push(key(u, p.x, p.y + 1 + (u - FLOAT_FROM) * FLOAT_RISE + Math.sin(a * 1.3) * 0.9, p.z + Math.cos(a) * 2.2 * side));
  }
  return out;
}

/** Body centres, in duel time. At the hit they stop at arm's length, about 8 apart. */
const AMBER = new Track([
  k(5, rel(-120, -1, 6)),
  k(D_IN - 0.1, rel(-72, 0.5, 6)),
  k(12.4, along(-24, 1.2)),
  k(12.95, along(-14.6, 1)),
  k(13.4, along(-13, 0.8)),
  k(14.6, along(-12.4, 0.2)),
  ...float(-1),
]);
const OBSIDIAN = new Track([
  k(5, rel(90, 6, -11)),
  k(D_IN - 0.1, rel(54, 4, -10)),
  k(12.4, along(24, 1.6)),
  k(12.95, along(14.6, 1.3)),
  k(13.4, along(13, 1.2)),
  k(14.6, along(12.6, 0.5)),
  k(16.2, along(13.3, 1.1)),
  k(D_HIT, along(13, 0.8)),
  k(18.0, along(14.5, 2.4, -1)),
  ...float(1),
]);
export const amberAt = (u: number, out: Vector3) => AMBER.at(u, out);

/**
 * The red one off its sky path, placed on the screen instead, as (x, y) in normalized
 * device coordinates (-1..1, beyond is off screen) and its distance from the camera: first
 * the break to the middle and out of the top, then, after a jump it makes off screen, the
 * rise into the lower-left corner, close.
 */
const EXIT = new Track([key(14.0, -0.34, 0.6, 43), key(14.45, -0.14, 0.24, 38), key(14.8, 0, 0.08, 34), key(15.3, 0.06, 1.7, 30)]);
// The return starts far below the frame, so the body it trails behind it stays out of sight.
const CLOSE = new Track([
  key(15.3, -0.9, -14, 4.2),
  key(16.0, -0.88, -5.5, 4.2),
  key(16.75, -0.78, -0.5, 4),
  key(D_HIT, -0.74, -0.42, 4.2),
  key(17.9, -0.85, -0.8, 7),
  key(19, -0.6, -0.2, 32),
]);
export const amberScreenAt = (u: number, out: Vector3) => (u < D_EXIT[1] ? EXIT : CLOSE).at(u, out);
/** How much the screen placement rules over the sky path, 0..1. */
export const amberScreenW = (u: number) => smooth(D_EXIT[0], D_EXIT[0] + 0.35, u) * (1 - smooth(17.9, 19.0, u));
/** Off screen between leaving the top and rising into the corner: not drawn. */
export const amberHidden = (u: number) => u > D_EXIT[1] - 0.05 && u < 16.0;
/** How far along from the red one's mouth to the other's the seam sits, 0..1. */
export const seamFrac = (u: number) => 0.14 + 0.32 * smooth(D_FIRE_C[0], D_HIT, u);
export const obsidianAt = (u: number, out: Vector3) => OBSIDIAN.at(u, out);

export type DuelBeats = {
  /** Anything of the duel on screen at all. */
  on: boolean;
  /** The spiritual pressure: builds as they close, released at the boom. 0..1. */
  pressure: number;
  /** Either breathing fire, 0..1. */
  breath: number;
  /** the white one's beam, and the red one's, 0..1. */
  fireX: number;
  fireC: number;
  /** The impact's flash, 0..1. */
  flash: number;
  /** A sharp kick on the boom, 0..1, gone in half a second. */
  kick: number;
  /** The blast wind at the courier, 0..1. */
  gust: number;
};

export function duelBeats(t: number): DuelBeats {
  const on = t > D_IN - 2;
  const release = 1 - smooth(D_BOOM, D_BOOM + 0.3, t);
  const pressure = Math.pow(smooth(9, D_HIT - 0.2, t), 1.4) * release;
  const u = duelT(t);
  // Both held through the frozen beat, cut by the blast.
  const cut = 1 - smooth(D_HIT, D_HIT + 0.12, u);
  const fireX = smooth(D_FIRE_X[0], D_FIRE_X[0] + 0.15, u) * cut;
  const fireC = smooth(D_FIRE_C[0], D_FIRE_C[0] + 0.12, u) * cut;
  const breath = Math.max(fireX, fireC);
  const since = t - D_BOOM;
  const flash = since >= 0 && since < 1.8 ? (since < 0.05 ? 1 : Math.exp(-(since - 0.05) * 3.4)) : 0;
  const kick = since >= 0 && since < 0.7 ? Math.exp(-since * 7) : 0;
  const g = t - D_GUST;
  const gust = g > 0 && g < 3.2 ? smooth(0, 0.12, g) * Math.exp(-Math.max(0, g - 0.12) * 1.5) : 0;
  return { on, pressure, breath, fireX, fireC, flash, kick, gust };
}
