import * as THREE from "three";

/*
 * The hero: a plain white corridor, two curved walls and a floor, bending left.
 * Its centre line starts at the origin heading -z, almost straight, and bends left ever
 * more tightly the further it goes (its curvature grows with distance, like a clothoid),
 * so the view keeps changing as the camera moves down it. The walls stand HALF either
 * side of that line. Fog the colour of the walls swallows the far end. The only shading
 * is light falling on the curved surfaces and a soft occlusion baked into the corners
 * where the walls meet the floor.
 */
export const HALF = 2.4;
export const WALL_H = 7;
/** The corridor's length along its centre line (m), from a little behind the start. */
export const S_FROM = -6;
export const S_TO = 76;
export const SEGMENTS = 380;
/**
 * Curvature (1/m) at the start, its growth per metre, and its cap (tightest radius 20 m).
 * Kept with S_TO so the whole turn stays under ~2.8 rad: any more and the corridor curls
 * back on itself and its far end shows through the gaps.
 */
export const BEND = { start: 0.01, growth: 0.0008, max: 0.05 };
/** How far down the corridor the camera travels over the hero's scroll (m). */
export const TRAVEL = 50;
export const EYE = 1.6;

const curvature = (s: number) => Math.min(BEND.max, BEND.start + BEND.growth * Math.max(0, s));

/** The centre line, sampled every STEP metres: position (x, z) and heading (0 = -z, + = left). */
export const STEP = (S_TO - S_FROM) / SEGMENTS;
export const PATH = (() => {
  const x = new Float64Array(SEGMENTS + 1);
  const z = new Float64Array(SEGMENTS + 1);
  const h = new Float64Array(SEGMENTS + 1);
  // Walk forward from s = 0, then backward to S_FROM (straight behind the start).
  const zero = Math.round(-S_FROM / STEP);
  for (let i = zero + 1; i <= SEGMENTS; i++) {
    const s = S_FROM + (i - 0.5) * STEP;
    h[i] = h[i - 1] + curvature(s) * STEP;
    const mid = (h[i] + h[i - 1]) / 2;
    x[i] = x[i - 1] - Math.sin(mid) * STEP;
    z[i] = z[i - 1] - Math.cos(mid) * STEP;
  }
  for (let i = zero - 1; i >= 0; i--) {
    z[i] = z[i + 1] + STEP;
  }
  return { x, z, h };
})();

/** A point on the corridor: `s` metres along, `side` metres left of centre, `y` up. */
export function at(s: number, side: number, y: number, out = new THREE.Vector3()) {
  const f = Math.min(SEGMENTS, Math.max(0, (s - S_FROM) / STEP));
  const i = Math.min(SEGMENTS - 1, Math.floor(f));
  const t = f - i;
  const x = PATH.x[i] + (PATH.x[i + 1] - PATH.x[i]) * t;
  const z = PATH.z[i] + (PATH.z[i + 1] - PATH.z[i]) * t;
  const h = PATH.h[i] + (PATH.h[i + 1] - PATH.h[i]) * t;
  // The left normal of heading h.
  return out.set(x - Math.cos(h) * side, y, z + Math.sin(h) * side);
}

/** The heading at `s` metres along (rad, 0 = -z, + = left). */
export function headingAt(s: number) {
  const f = Math.min(SEGMENTS, Math.max(0, (s - S_FROM) / STEP));
  const i = Math.min(SEGMENTS - 1, Math.floor(f));
  return PATH.h[i] + (PATH.h[i + 1] - PATH.h[i]) * (f - i);
}
