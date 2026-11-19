import { Vector3 } from "three";
import type { DuelBeats } from "./duel";

/**
 * The hero's sky, written as a short film: clear dawn, then the sky darkening as the wyverns'
 * pressure builds, a storm with rain and lightning through their duel (duel.ts, on the same
 * clock), one strike landing with their impact, and the storm breaking as they leave, so the
 * loop starts clear. Everything is a pure function of the
 * clock `t` (seconds), so every part agrees, and it can loop or hold.
 */
export const FILM_S = 32;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/** 0 to 1 inside [a, b], with soft shoulders `fade` seconds wide. */
export function window01(t: number, [a, b]: readonly [number, number], fade = 0.35) {
  return smooth(a, a + fade, t) * (1 - smooth(b - fade, b, t));
}

/* ------------------------------------------------------------------ paths */

export type Key = { t: number; x: number; y: number; z: number };

/**
 * A time-keyed Catmull-Rom (Barry–Goldman): passes through every key at its own time, smooth
 * in between however the keys are spaced. The wyverns ride these.
 */
export class Track {
  private keys: Key[];
  constructor(keys: Key[]) {
    this.keys = keys.sort((a, b) => a.t - b.t);
  }
  at(t: number, out: Vector3) {
    const k = this.keys;
    const n = k.length;
    if (t <= k[0].t) return out.set(k[0].x, k[0].y, k[0].z);
    if (t >= k[n - 1].t) return out.set(k[n - 1].x, k[n - 1].y, k[n - 1].z);
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (k[mid].t <= t) lo = mid;
      else hi = mid;
    }
    const p1 = k[lo];
    const p2 = k[lo + 1];
    const p0 = k[lo - 1] ?? { t: 2 * p1.t - p2.t, x: 2 * p1.x - p2.x, y: 2 * p1.y - p2.y, z: 2 * p1.z - p2.z };
    const p3 = k[lo + 2] ?? { t: 2 * p2.t - p1.t, x: 2 * p2.x - p1.x, y: 2 * p2.y - p1.y, z: 2 * p2.z - p1.z };
    const c = (a: number, b: number, d: number, e: number) => {
      const t0 = p0.t;
      const t1 = p1.t;
      const t2 = p2.t;
      const t3 = p3.t;
      const a1 = ((t1 - t) * a + (t - t0) * b) / (t1 - t0);
      const a2 = ((t2 - t) * b + (t - t1) * d) / (t2 - t1);
      const a3 = ((t3 - t) * d + (t - t2) * e) / (t3 - t2);
      const b1 = ((t2 - t) * a1 + (t - t0) * a2) / (t2 - t0);
      const b2 = ((t3 - t) * a2 + (t - t1) * a3) / (t3 - t1);
      return ((t2 - t) * b1 + (t - t1) * b2) / (t2 - t1);
    };
    return out.set(c(p0.x, p1.x, p2.x, p3.x), c(p0.y, p1.y, p2.y, p3.y), c(p0.z, p1.z, p2.z, p3.z));
  }
}

export const key = (t: number, x: number, y: number, z: number): Key => ({ t, x, y, z });

/* ------------------------------------------------------------------ beats */

/** Lightning strikes, in film seconds. */
export const LIGHTNING = [13.0, 14.25, 15.7, 17.56, 19.3, 21.4];

export type Beats = {
  /** 0 at clear dawn, 1 in the full storm: it rolls in with the wyverns and breaks as they go. */
  storm: number;
  rain: number;
  /** Lightning flash, 0..1, flickering, and which strike is lit (-1 for none). */
  bolt: number;
  boltIndex: number;
};

/** The shared clock the hero writes each frame and every part of the fight reads. */
/** `d` is the wyverns' duel (duel.ts), on the same clock. */
export type FilmClock = { t: number; dt: number; w: Beats; d: DuelBeats; still: boolean };

export function beats(t: number): Beats {
  const storm = smooth(9, 12.8, t) * (1 - smooth(20.5, 27, t));
  const rain = smooth(12.2, 14, t) * (1 - smooth(20.5, 24.5, t));
  let bolt = 0;
  let boltIndex = -1;
  for (let i = 0; i < LIGHTNING.length; i++) {
    const d = t - LIGHTNING[i];
    if (d >= 0 && d < 0.42) {
      // Two quick flickers, then a dying glow.
      const f = d < 0.07 ? 1 : d < 0.12 ? 0.25 : d < 0.19 ? 0.85 : Math.max(0, 1 - (d - 0.19) / 0.23) * 0.5;
      if (f > bolt) {
        bolt = f;
        boltIndex = i;
      }
    }
  }
  return { storm, rain, bolt, boltIndex };
}
