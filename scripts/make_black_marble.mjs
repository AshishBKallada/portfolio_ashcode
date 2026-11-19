// Renders the hero nav card's black marble (Nero Marquina) to public/images/hero/marble-black.webp:
// near-black stone with a faint cloudy mottle and a few thin, branching white veins on the diagonal.
// Usage: node scripts/make_black_marble.mjs  (needs cwebp on PATH)
import { writeFileSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const W = 680, H = 928;
let seed = 20261119;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const P = new Uint8Array(512);
{ const p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) P[i] = p[i & 255]; }
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const grad = (h, x, y) => ((h & 1) ? -x : x) + ((h & 2) ? -y : y);
function perlin(x, y) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y);
  const u = fade(x), v = fade(y), a = P[X] + Y, b = P[X + 1] + Y;
  const l1 = grad(P[a], x, y) + u * (grad(P[b], x - 1, y) - grad(P[a], x, y));
  const l2 = grad(P[a + 1], x, y - 1) + u * (grad(P[b + 1], x - 1, y - 1) - grad(P[a + 1], x, y - 1));
  return l1 + v * (l2 - l1);
}
const fbm = (x, y, o = 5) => { let s = 0, a = 0.5, f = 1; for (let i = 0; i < o; i++) { s += a * perlin(x * f, y * f); a *= 0.5; f *= 2.03; } return s; };

const ang = -0.56, ca = Math.cos(ang), sa = Math.sin(ang);
const buf = Buffer.alloc(W * H * 3);
for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
  const x = i / W, y = j / W;
  // Diagonal frame for the veins, warped so they wander.
  const u = x * ca - y * sa, v = x * sa + y * ca;
  const wx = fbm(u * 2.2 + 3.1, v * 2.2) * 0.9, wy = fbm(u * 2.2, v * 2.2 + 7.7) * 0.9;
  // Main veins: thin where the warped field crosses zero.
  const f = fbm(u * 1.4 + wx, v * 5.5 + wy, 6);
  const main = Math.exp(-Math.pow(f / 0.012, 2));
  // Hairlines branching off.
  const g = fbm(u * 3.5 + wx * 1.6 + 11, v * 9 + wy * 1.6, 5);
  const hair = Math.exp(-Math.pow(g / 0.006, 2)) * 0.45;
  // Cloudy mottle in the stone.
  const m = fbm(x * 3 + 20, y * 3, 4);
  const base = 14 + m * 14;
  const vein = Math.min(1, main * 0.55 + hair * 0.5);
  const k = (j * W + i) * 3;
  buf[k] = Math.max(0, Math.min(255, base + (205 - base) * vein));
  buf[k + 1] = Math.max(0, Math.min(255, base - 1 + (200 - base) * vein));
  buf[k + 2] = Math.max(0, Math.min(255, base - 2 + (194 - base) * vein));
}
const ppm = join(tmpdir(), "marble-black.ppm");
writeFileSync(ppm, Buffer.concat([Buffer.from(`P6\n${W} ${H}\n255\n`), buf]));
execFileSync("cwebp", ["-quiet", "-q", "82", ppm, "-o", "public/images/hero/marble-black.webp"]);
unlinkSync(ppm);
