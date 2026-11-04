// Builds the hero courier's continuous sequence (CourierTalk): floating in lotus,
// raising a hand to answer the mat (mouth moving), then unfolding into the original leap.
//
//   node scripts/courier-sequence.mjs <path to rife-ncnn-vulkan folder>
//
// 1. Every painted keyframe (art/courier-talk, from Gemini on a near-white ground) is
//    put on the original leap's canvas, at the scale and place that lines its stride
//    frame up with the leap, on pure white.
// 2. RIFE fills the in-betweens of each segment, so there are no jumps.
// 3. Each frame is cut out (the white ground keyed away) and written as WebP to
//    public/images/hero/talk/<segment>-NN.webp.

import { execFileSync } from "node:child_process";
import { mkdir, readdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
// sharp isn't a direct dependency; Next.js brings it for image optimisation.
const sharp = createRequire(require.resolve("next/package.json"))("sharp");

const RIFE = process.argv[2];
if (!RIFE) throw new Error("Pass the rife-ncnn-vulkan folder.");

const SRC = "art/courier-talk";
const OUT = "public/images/hero/talk";
const TMP = path.join(os.tmpdir(), "courier-sequence");
/** The original leap: the sequence ends on it, so everything shares its canvas. */
const LEAP = "public/images/hero/hero-figure-winged-courier.webp";
const W = 1303;
const H = 1207;

/** Segments, in story order: [name, keyframes, frames including both ends]. */
const SEGMENTS = [
  ["raise", ["sit-base", "lotus-up-closed"], 14],
  ["mouth", ["lotus-up-closed", "lotus-up-open"], 5],
  ["unfold", ["sit-base", "unfold-1", "unfold-1a", "unfold-2", "@leap"], 44],
];

/** Distance (0–441) from the ground colour below which a flooded pixel is ground, and above which it's figure. */
const CLEAR = 24;
const SOLID = 70;
const POCKET = 14;
const POCKET_MIN = 60;
const CHOKE = 70;

const raw = async (input) => {
  const { data, info } = await sharp(input).flatten({ background: "#ffffff" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
};

/** The ground's colour: the median of the four corners. */
function groundOf({ data, w, h }) {
  const at = (x, y) => [0, 1, 2].map((c) => data[(y * w + x) * 3 + c]);
  const corners = [at(4, 4), at(w - 5, 4), at(4, h - 5), at(w - 5, h - 5)];
  return [0, 1, 2].map((c) => corners.map((p) => p[c]).sort((a, b) => a - b)[2]);
}

/** Alpha for the figure: flood the ground in from the edges (and from big enclosed pockets of it). */
async function matte({ data, w, h }) {
  const g = groundOf({ data, w, h });
  const dist = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 3] - g[0];
    const gg = data[i * 3 + 1] - g[1];
    const b = data[i * 3 + 2] - g[2];
    dist[i] = Math.sqrt(r * r + gg * gg + b * b);
  }
  const ground = new Uint8Array(w * h);
  const stack = [];
  const push = (i) => {
    if (!ground[i] && dist[i] < SOLID) {
      ground[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  const seen = new Uint8Array(w * h);
  for (let s = 0; s < w * h; s++) {
    if (seen[s] || dist[s] >= POCKET) continue;
    const run = [s];
    seen[s] = 1;
    for (let k = 0; k < run.length; k++) {
      const i = run[k];
      const x = i % w;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j >= 0 && j < w * h && !seen[j] && dist[j] < POCKET) {
          seen[j] = 1;
          run.push(j);
        }
      }
    }
    if (run.length >= POCKET_MIN) for (const i of run) push(i);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < w * (h - 1)) push(i + w);
  }
  const alpha = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) {
    alpha[i] = ground[i] ? Math.round(255 * Math.min(1, Math.max(0, (dist[i] - CLEAR) / (SOLID - CLEAR)))) : 255;
  }
  const blurred = await sharp(alpha, { raw: { width: w, height: h, channels: 1 } }).blur(0.8).extractChannel(0).raw().toBuffer();
  return { alpha: blurred.map((v) => Math.max(0, Math.min(255, Math.round(((v - CHOKE) * 255) / (255 - CHOKE))))), ground: g };
}

/** RGBA cutout: colour pulled away from the ground at the soft edge. */
async function cutout(img) {
  const { alpha, ground } = await matte(img);
  const { data, w, h } = img;
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const a = alpha[i] / 255;
    for (let c = 0; c < 3; c++) {
      const v = data[i * 3 + c];
      rgba[i * 4 + c] = a > 0.02 && a < 1 ? Math.max(0, Math.min(255, Math.round((v - ground[c] * (1 - a)) / a))) : v;
    }
    rgba[i * 4 + 3] = alpha[i];
  }
  return { rgba, w, h };
}

function bounds({ rgba, w, h }) {
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (rgba[(y * w + x) * 4 + 3] > 128) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { x0, y0, x1, y1 };
}

/** A cutout scaled by `s` and offset by (dx, dy) onto the leap's canvas, on white. */
async function onCanvas(cut, s, dx, dy) {
  const sw = Math.round(cut.w * s);
  const sh = Math.round(cut.h * s);
  const scaled = await sharp(cut.rgba, { raw: { width: cut.w, height: cut.h, channels: 4 } }).resize(sw, sh).png().toBuffer();
  const left = Math.round(dx);
  const top = Math.round(dy);
  const cx = Math.max(0, -left);
  const cy = Math.max(0, -top);
  const cw = Math.min(sw - cx, W - Math.max(0, left));
  const ch = Math.min(sh - cy, H - Math.max(0, top));
  const piece = await sharp(scaled).extract({ left: cx, top: cy, width: cw, height: ch }).toBuffer();
  return sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } })
    .composite([{ input: piece, left: Math.max(0, left), top: Math.max(0, top) }])
    .png()
    .toBuffer();
}

await rm(TMP, { recursive: true, force: true });
await mkdir(TMP, { recursive: true });
await mkdir(OUT, { recursive: true });

// Line the painted frames up with the leap: the stride frame's figure scaled to the
// leap's height and centred on it; every other frame takes the same transform.
const leapCut = await cutout(await raw(LEAP));
const strideCut = await cutout(await raw(path.join(SRC, "unfold-2.png")));
const lb = bounds(leapCut);
const sb = bounds(strideCut);
const s = (lb.y1 - lb.y0) / (sb.y1 - sb.y0);
const dx = (lb.x0 + lb.x1) / 2 - ((sb.x0 + sb.x1) / 2) * s;
const dy = lb.y1 - sb.y1 * s;

const placed = new Map();
const place = async (name) => {
  if (!placed.has(name)) {
    const file = path.join(TMP, `${name}.png`);
    if (name === "@leap") await sharp(LEAP).flatten({ background: "#ffffff" }).png().toFile(file);
    else await sharp(await onCanvas(await cutout(await raw(path.join(SRC, `${name}.png`))), s, dx, dy)).toFile(file);
    placed.set(name, file);
  }
  return placed.get(name);
};

/** Cut a white-ground frame out and write it as WebP. */
const emit = async (file, out) => {
  const cut = await cutout(await raw(file));
  await sharp(cut.rgba, { raw: { width: cut.w, height: cut.h, channels: 4 } }).webp({ quality: 86, alphaQuality: 100 }).toFile(out);
};

for (const [name, keys, frames] of SEGMENTS) {
  const inDir = path.join(TMP, `${name}-in`);
  const outDir = path.join(TMP, `${name}-out`);
  await mkdir(inDir);
  await mkdir(outDir);
  for (const [i, key] of keys.entries()) {
    await sharp(await place(key)).toFile(path.join(inDir, `${String(i + 1).padStart(8, "0")}.png`));
  }
  execFileSync(path.join(RIFE, "rife-ncnn-vulkan"), ["-i", inDir, "-o", outDir, "-n", String(frames), "-m", "rife-v4.6"], {
    cwd: RIFE,
    stdio: "ignore",
  });
  const out = (await readdir(outDir)).filter((f) => f.endsWith(".png")).sort();
  for (const [i, f] of out.entries()) await emit(path.join(outDir, f), path.join(OUT, `${name}-${String(i + 1).padStart(2, "0")}.webp`));
  console.log(`${name}: ${out.length} frames`);
}
