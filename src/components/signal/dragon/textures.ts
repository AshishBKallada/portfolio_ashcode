import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

/* Everything the dragons and their sky paint is drawn here, in code: no image files. */

/** A small seeded random, so every build of the world comes out the same. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let x = s;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w: number, h = w) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

/**
 * Dragon scales: overlapping rows of rounded scales, each lit at its centre and dark at its rim,
 * so the same picture serves as colour (multiplied over the body's colours) and as bump.
 */
export function scaleTexture(soft = false) {
  const size = 256;
  const [c, g] = canvas(size);
  g.fillStyle = soft ? "#c9c9c9" : "#3a3a3a";
  g.fillRect(0, 0, size, size);
  const cols = 8;
  const rows = 8;
  const w = size / cols;
  const h = size / rows;
  for (let r = rows; r >= -1; r--) {
    for (let k = -1; k <= cols; k++) {
      const x = (k + (r % 2 ? 0.5 : 0)) * w;
      const y = r * h;
      const grad = g.createRadialGradient(x, y + h * 0.05, w * 0.05, x, y + h * 0.15, w * 0.68);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.55, soft ? "#f0f0f0" : "#d6d6d6");
      grad.addColorStop(0.85, soft ? "#dddddd" : "#7a7a7a");
      grad.addColorStop(1, soft ? "#b4b4b4" : "#2c2c2c");
      g.fillStyle = grad;
      g.beginPath();
      g.ellipse(x, y, w * 0.62, h * 0.95, 0, 0, Math.PI);
      g.closePath();
      g.fill();
      g.strokeStyle = soft ? "rgba(60,70,90,0.25)" : "rgba(20,20,20,0.55)";
      g.lineWidth = 1.5;
      g.beginPath();
      g.ellipse(x, y, w * 0.62, h * 0.95, 0, 0.05, Math.PI - 0.05);
      g.stroke();
    }
  }
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** A soft cloud puff: a cluster of blurred discs, for drifting cloud and storm banks. */
export function puffTexture(seed = 3) {
  const size = 128;
  const [c, g] = canvas(size);
  const r = rng(seed);
  for (let i = 0; i < 16; i++) {
    const x = size * (0.28 + r() * 0.44);
    const y = size * (0.32 + r() * 0.36);
    const rad = size * (0.14 + r() * 0.2);
    const grad = g.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, "rgba(255,255,255,0.35)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** A round glow, bright at the centre, for lanterns, the flash and sparks. */
export function glowTexture() {
  const size = 128;
  const [c, g] = canvas(size);
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, "rgba(255,255,255,0.75)");
  grad.addColorStop(0.45, "rgba(255,255,255,0.18)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

