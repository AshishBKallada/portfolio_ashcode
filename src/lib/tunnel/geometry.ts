import * as THREE from "three";
import { HALF, PATH, S_FROM, SEGMENTS, STEP, WALL_H, at } from "./path";

/** The floor is a step greyer than the walls, so the room reads as a room. */
const FLOOR_TONE = 0.9;

/** Corner shade: darker near the floor–wall seam, fading out within ~1.2 m. */
const occlusion = (d: number) => 1 - 0.14 * Math.exp(-d / 0.45);

/** A strip down the corridor: `across` lists its cross-section points, `normal` their normals. */
function strip(
  across: { side: number; y: number; shade: number }[],
  normal: (h: number) => [number, number, number],
  flip: boolean,
) {
  const pos: number[] = [];
  const nrm: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const p = new THREE.Vector3();
  for (let i = 0; i <= SEGMENTS; i++) {
    const s = S_FROM + i * STEP;
    const n = normal(PATH.h[i]);
    for (const c of across) {
      at(s, c.side, c.y, p);
      pos.push(p.x, p.y, p.z);
      nrm.push(...n);
      col.push(c.shade, c.shade, c.shade);
    }
  }
  const n = across.length;
  for (let i = 0; i < SEGMENTS; i++)
    for (let j = 0; j < n - 1; j++) {
      const a = i * n + j;
      const b = (i + 1) * n + j;
      if (flip) idx.push(a, a + 1, b, b, a + 1, b + 1);
      else idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  return g;
}

/** One wall, `side` = +HALF (left) or -HALF (right), its normal facing into the corridor. */
export function wallGeometry(side: number) {
  const rows = [0, 0.08, 0.25, 0.6, 1.2, 2.4, WALL_H];
  const k = Math.sign(side);
  return strip(
    rows.map((y) => ({ side, y, shade: occlusion(y) })),
    // Into the corridor is minus the left normal for the left wall, plus it for the right.
    (h) => [Math.cos(h) * k, 0, -Math.sin(h) * k],
    side < 0,
  );
}

/** The floor between the walls, a step greyer, shaded towards both edges. */
export function floorGeometry() {
  const cols = [HALF, HALF - 0.08, HALF - 0.3, HALF - 0.9, 0, -HALF + 0.9, -HALF + 0.3, -HALF + 0.08, -HALF];
  return strip(
    cols.map((side) => ({ side, y: 0, shade: FLOOR_TONE * occlusion(HALF - Math.abs(side)) })),
    () => [0, 1, 0],
    false,
  );
}
