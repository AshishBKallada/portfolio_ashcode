import { CLAP, POINTS, charge, clamp01, darkness, ramp } from "./timeline";

/**
 * The cursed energy behind the Cursed King, drawn on one 2D canvas: ink splashes that bloom
 * as the tension builds, red wisps coiling round him, embers that gather at his open hands,
 * and on the clap a shockwave, a burst and radial speed lines. Everything is driven by the
 * scroll position p, plus one time-based impulse fired when the palms meet.
 */

type Point = { x: number; y: number };
/** Frame space (0 to 1 across the figure's canvas) to screen pixels. */
export type Project = (u: number, v: number) => Point;

type Ember = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; hot: boolean };

const CRIMSON = "181, 18, 36";
const HOT = "255, 59, 72";
const MAX_EMBERS = 420;

/** Deterministic noise so the splashes are the same on every visit. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** A splash of ink: a ragged blob, satellite drops and a few thrown streaks. */
function paintSplash(size: number, seed: number) {
  const rnd = seeded(seed);
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const m = size / 2;
  g.fillStyle = `rgb(${CRIMSON})`;
  g.beginPath();
  const lobes = 9 + Math.floor(rnd() * 6);
  for (let i = 0; i <= lobes * 4; i++) {
    const a = (i / (lobes * 4)) * Math.PI * 2;
    const r = m * (0.22 + 0.1 * Math.sin(a * lobes + seed) + rnd() * 0.08);
    const x = m + Math.cos(a) * r;
    const y = m + Math.sin(a) * r;
    if (i === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.fill();
  for (let i = 0; i < 26; i++) {
    const a = rnd() * Math.PI * 2;
    const d = m * (0.32 + rnd() * 0.6);
    g.beginPath();
    g.arc(m + Math.cos(a) * d, m + Math.sin(a) * d, m * (0.012 + rnd() * 0.04) * (1.2 - d / m), 0, Math.PI * 2);
    g.fill();
  }
  g.lineCap = "round";
  g.strokeStyle = g.fillStyle;
  for (let i = 0; i < 3; i++) {
    const a = rnd() * Math.PI * 2;
    const r0 = m * 0.25;
    const r1 = m * (0.55 + rnd() * 0.4);
    g.lineWidth = m * (0.01 + rnd() * 0.025);
    g.beginPath();
    g.moveTo(m + Math.cos(a) * r0, m + Math.sin(a) * r0);
    g.lineTo(m + Math.cos(a) * r1, m + Math.sin(a) * r1);
    g.stroke();
  }
  return c;
}

/** Where the splashes land around the figure (frame space) and when each blooms. */
const SPLASHES = [
  { u: 0.2, v: 0.3, s: 0.34, at: 0.22, seed: 11 },
  { u: 0.83, v: 0.22, s: 0.28, at: 0.27, seed: 23 },
  { u: 0.12, v: 0.72, s: 0.3, at: 0.33, seed: 37 },
  { u: 0.9, v: 0.66, s: 0.36, at: 0.39, seed: 41 },
  { u: 0.32, v: 0.08, s: 0.2, at: 0.46, seed: 53 },
  { u: 0.7, v: 0.86, s: 0.26, at: 0.52, seed: 67 },
  { u: 0.03, v: 0.45, s: 0.22, at: 0.58, seed: 71 },
  { u: 0.98, v: 0.4, s: 0.24, at: 0.62, seed: 83 },
];

export class Energy {
  private g: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private embers: Ember[] = [];
  private splashes: HTMLCanvasElement[] = [];
  private impact = -1;
  private last = 0;
  private lite: boolean;

  constructor(
    private canvas: HTMLCanvasElement,
    opts: { lite: boolean },
  ) {
    this.g = canvas.getContext("2d")!;
    this.lite = opts.lite;
  }

  resize(w: number, h: number, dpr: number) {
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!this.splashes.length) this.splashes = SPLASHES.map((s) => paintSplash(256, s.seed));
  }

  /** The palms just met. */
  clap(now: number, at: Point) {
    this.impact = now;
    const n = this.lite ? 70 : 180;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 6 + Math.random() * 16;
      this.spawn(at.x, at.y, Math.cos(a) * v, Math.sin(a) * v * 0.7, 40 + Math.random() * 50, 1 + Math.random() * 2.6, true);
    }
  }

  /** Milliseconds since the clap, or Infinity if it hasn't happened. */
  sinceImpact(now: number) {
    return this.impact < 0 ? Infinity : now - this.impact;
  }

  private spawn(x: number, y: number, vx: number, vy: number, max: number, size: number, hot: boolean) {
    if (this.embers.length >= MAX_EMBERS) this.embers.shift();
    this.embers.push({ x, y, vx, vy, life: 0, max, size, hot });
  }

  render(p: number, now: number, project: Project, figureH: number) {
    const { g, w, h } = this;
    const dt = Math.min(3, this.last ? (now - this.last) / 16.67 : 1);
    this.last = now;
    g.clearRect(0, 0, w, h);
    const k = charge(p);
    const dark = darkness(p);
    const t = now / 1000;

    // Ink splashes bloom one by one through the tension, then sink into the dark.
    g.globalCompositeOperation = "source-over";
    SPLASHES.forEach((s, i) => {
      const bloom = ramp(p, s.at, s.at + 0.035);
      if (!bloom) return;
      const c = project(s.u, s.v);
      const size = figureH * s.s * (0.6 + 0.4 * bloom);
      g.globalAlpha = bloom * (0.85 - dark * 0.45);
      g.drawImage(this.splashes[i], c.x - size / 2, c.y - size / 2, size, size);
    });
    g.globalAlpha = 1;

    // Wisps of cursed energy coiling round him, thicker as he gathers.
    const wisps = this.lite ? 5 : 11;
    const face = project(POINTS.face.x, POINTS.face.y);
    const reach = figureH * 0.62;
    const wispStrength = ramp(p, 0.18, 0.5) * (1 - ramp(p, CLAP, CLAP + 0.02)) + ramp(p, CLAP + 0.03, 0.85) * 0.6;
    if (wispStrength > 0.01) {
      g.lineCap = "round";
      for (let i = 0; i < wisps; i++) {
        const phase = t * (0.35 + i * 0.05) + i * 1.7;
        const r = reach * (0.55 + 0.45 * ((i * 0.37) % 1));
        const a0 = phase;
        const a1 = phase + 0.9 + 0.5 * Math.sin(t + i);
        g.strokeStyle = `rgba(${i % 3 ? CRIMSON : HOT}, ${0.55 * wispStrength})`;
        g.lineWidth = (1 + (i % 4)) * (0.6 + k);
        g.beginPath();
        for (let s = 0; s <= 24; s++) {
          const a = a0 + ((a1 - a0) * s) / 24;
          const rr = r * (1 + 0.08 * Math.sin(a * 3 + t * 2));
          const x = face.x + Math.cos(a) * rr * 0.75;
          const y = face.y + figureH * 0.3 + Math.sin(a) * rr * 0.55;
          if (s === 0) g.moveTo(x, y);
          else g.lineTo(x, y);
        }
        g.stroke();
      }
    }

    // Embers: a trickle rising at rest; while his arms are wide they're drawn into his hands.
    const gather = ramp(p, 0.42, 0.5) * (1 - ramp(p, CLAP - 0.03, CLAP));
    const rate = (this.lite ? 0.5 : 1.4) * k * (1 + gather * 3) * dt;
    const count = Math.floor(rate) + (Math.random() < rate % 1 ? 1 : 0);
    for (let i = 0; i < count; i++) {
      if (gather > 0.1 && Math.random() < gather) {
        const hand = project(POINTS.wideHands[i % 2].x, POINTS.wideHands[i % 2].y);
        const a = Math.random() * Math.PI * 2;
        const d = figureH * (0.12 + Math.random() * 0.2);
        const x = hand.x + Math.cos(a) * d;
        const y = hand.y + Math.sin(a) * d;
        this.spawn(x, y, (hand.x - x) / 30, (hand.y - y) / 30, 30, 1 + Math.random() * 2, Math.random() < 0.4);
      } else {
        const x = w * (0.15 + Math.random() * 0.7);
        this.spawn(x, h * (0.6 + Math.random() * 0.45), (Math.random() - 0.5) * 0.6, -(0.5 + Math.random() * 1.6) * (0.5 + k), 120 + Math.random() * 120, 0.8 + Math.random() * 2.2, Math.random() < 0.25);
      }
    }
    g.globalCompositeOperation = dark > 0.5 ? "lighter" : "source-over";
    for (let i = this.embers.length - 1; i >= 0; i--) {
      const e = this.embers[i];
      e.life += dt;
      if (e.life > e.max) {
        this.embers.splice(i, 1);
        continue;
      }
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      e.vx *= 0.97;
      e.vy = e.vy * 0.97 - 0.02 * dt;
      e.x += Math.sin(t * 2 + e.y * 0.01) * 0.3;
      const life = 1 - e.life / e.max;
      g.fillStyle = `rgba(${e.hot ? HOT : CRIMSON}, ${Math.min(1, life * 1.4)})`;
      g.beginPath();
      g.arc(e.x, e.y, e.size * (0.4 + life * 0.6), 0, Math.PI * 2);
      g.fill();
    }

    // Glow gathering at the hands before the clap.
    if (gather > 0.01) {
      for (const hp of POINTS.wideHands) {
        const c = project(hp.x, hp.y);
        const r = figureH * (0.08 + 0.05 * Math.sin(t * 6)) * (0.6 + gather);
        const grad = g.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
        grad.addColorStop(0, `rgba(${HOT}, ${0.55 * gather})`);
        grad.addColorStop(1, `rgba(${CRIMSON}, 0)`);
        g.fillStyle = grad;
        g.fillRect(c.x - r, c.y - r, r * 2, r * 2);
      }
    }

    // After the clap: radial speed lines from his hands, slowly turning.
    const lines = ramp(p, CLAP, CLAP + 0.02) * (1 - 0.5 * ramp(p, 0.8, 1));
    if (lines > 0.01) {
      const c = project(POINTS.clap.x, POINTS.clap.y);
      const n = this.lite ? 28 : 64;
      const far = Math.hypot(w, h);
      g.globalCompositeOperation = "lighter";
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + t * 0.04 + Math.sin(i * 12.9) * 0.05;
        const flick = 0.5 + 0.5 * Math.sin(t * 9 + i * 7.3);
        const r0 = figureH * (0.35 + 0.25 * ((i * 0.61) % 1));
        g.strokeStyle = `rgba(${i % 4 ? CRIMSON : HOT}, ${0.18 * lines * (0.4 + flick * 0.6)})`;
        g.lineWidth = 1 + (i % 3);
        g.beginPath();
        g.moveTo(c.x + Math.cos(a) * r0, c.y + Math.sin(a) * r0);
        g.lineTo(c.x + Math.cos(a) * far, c.y + Math.sin(a) * far);
        g.stroke();
      }
    }

    // The shockwave: two rings racing out from the clap.
    const since = this.sinceImpact(now);
    if (since < 1200) {
      const c = project(POINTS.clap.x, POINTS.clap.y);
      const far = Math.hypot(w, h);
      g.globalCompositeOperation = "lighter";
      for (const lag of [0, 140]) {
        const s = clamp01((since - lag) / 900);
        if (s <= 0 || s >= 1) continue;
        const ease = 1 - (1 - s) ** 3;
        g.strokeStyle = `rgba(${HOT}, ${(1 - s) * 0.9})`;
        g.lineWidth = (1 - s) * figureH * 0.05 + 1;
        g.beginPath();
        g.ellipse(c.x, c.y, far * ease, far * ease * 0.62, 0, 0, Math.PI * 2);
        g.stroke();
      }
    }
    g.globalCompositeOperation = "source-over";
  }
}
