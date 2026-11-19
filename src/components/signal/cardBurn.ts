/**
 * The hero nav card burning like paper (HeroNavFlipCard): a ragged front climbs from the
 * bottom edge to the top, slow to catch and quickening as it goes, with a charred rim and
 * glowing embers just ahead of the hole. Leaving the card lets it heal back, faster.
 *
 * Drawn small and scaled up, which softens the edges for free: a quarter-size canvas
 * becomes the card's CSS mask (where it has burnt away), a half-size one is laid over the
 * card for the char and the glow. Flakes of ash lift off the burning edge on a third
 * canvas, outside the mask, glowing as they leave and greying as they drift up and out.
 */

const GW = 170;
const GH = 232;
/** Seconds to burn right through, and to heal back. */
const BURN_S = 4.2;
const HEAL_S = 0.9;
/** How far past the top the front runs, so the last ragged tips go too. */
const P_END = 1.25;

type Burn = { ignite: () => void; heal: () => void; dispose: () => void };

/** How far the ash canvas reaches past the card on each side, in CSS px. */
export const ASH_PAD = 120;
const MAX_FLAKES = 160;

type Flake = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; spin: number; turn: number; seed: number };

/** Smooth value noise on a grid, a few octaves, 0..1. */
function noiseField(seed: number) {
  let s = seed >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const octave = (cells: number) => {
    const cw = cells + 1;
    const ch = Math.ceil((cells * GH) / GW) + 1;
    const g = Float32Array.from({ length: cw * ch }, rand);
    return (x: number, y: number) => {
      const fx = x * cells;
      const fy = y * cells;
      const ix = Math.min(cw - 2, Math.floor(fx));
      const iy = Math.min(ch - 2, Math.floor(fy));
      const tx = fx - ix;
      const ty = fy - iy;
      const sx = tx * tx * (3 - 2 * tx);
      const sy = ty * ty * (3 - 2 * ty);
      const a = g[iy * cw + ix] + (g[iy * cw + ix + 1] - g[iy * cw + ix]) * sx;
      const b = g[(iy + 1) * cw + ix] + (g[(iy + 1) * cw + ix + 1] - g[(iy + 1) * cw + ix]) * sx;
      return a + (b - a) * sy;
    };
  };
  const octs = [octave(4), octave(9), octave(19), octave(38), octave(76)];
  const field = new Float32Array(GW * GH);
  const flicker = new Float32Array(GW * GH);
  for (let j = 0; j < GH; j++)
    for (let i = 0; i < GW; i++) {
      const x = i / (GW - 1);
      const y = j / (GW - 1);
      const n = octs[0](x, y) * 0.5 + octs[1](x, y) * 0.25 + octs[2](x, y) * 0.13 + octs[3](x, y) * 0.08 + octs[4](x, y) * 0.04;
      // 0 at the bottom edge, 1 at the top, made ragged by the noise.
      field[j * GW + i] = (1 - j / (GH - 1)) * 0.85 + n * 0.4;
      flicker[j * GW + i] = octs[3](x, y);
    }
  return { field, flicker };
}

export function createCardBurn(target: HTMLElement, overlay: HTMLCanvasElement, ash: HTMLCanvasElement): Burn {
  const { field, flicker } = noiseField(1119);
  const MW = GW / 2;
  const MH = GH / 2;
  const mask = document.createElement("canvas");
  mask.width = MW;
  mask.height = MH;
  overlay.width = GW;
  overlay.height = GH;
  const mctx = mask.getContext("2d")!;
  const octx = overlay.getContext("2d")!;
  const actx = ash.getContext("2d")!;
  const mImg = mctx.createImageData(MW, MH);
  const oImg = octx.createImageData(GW, GH);

  let p = 0;
  let dir = 0;
  let frame = 0;
  let last = 0;
  let masked = false;
  const flakes: Flake[] = [];

  const draw = (now: number) => {
    const od = oImg.data;
    const t = now / 1000;
    for (let k = 0; k < GW * GH; k++) {
      const d = field[k] - p;
      // The char: a browned rim fading up into clean paper.
      const char = d <= 0 ? 0 : Math.max(0, 1 - d / 0.09);
      // Embers along the edge, just inside what is left (the mask fades the very rim), flickering.
      const flick = 0.65 + 0.35 * Math.sin(t * 11 + flicker[k] * 40);
      const ember = d <= 0 ? 0 : Math.exp(-(((d - 0.018) / 0.016) ** 2)) * flick;
      const o = k * 4;
      if (ember > char * 0.6) {
        od[o] = 255;
        od[o + 1] = 120 + 110 * ember;
        od[o + 2] = 30 + 60 * ember;
        od[o + 3] = Math.min(255, ember * 300);
      } else {
        od[o] = 40;
        od[o + 1] = 14;
        od[o + 2] = 4;
        od[o + 3] = char * char * 230;
      }
    }
    octx.putImageData(oImg, 0, 0);
    // Paper left, at quarter size: gone below the front, a soft edge just above it.
    const md = mImg.data;
    for (let j = 0; j < MH; j++)
      for (let i = 0; i < MW; i++) {
        const d = field[j * 2 * GW + i * 2] - p;
        md[(j * MW + i) * 4 + 3] = d <= 0 ? 0 : d >= 0.02 ? 255 : (d / 0.02) * 255;
      }
    mctx.putImageData(mImg, 0, 0);
    const url = `url(${mask.toDataURL()})`;
    target.style.maskImage = url;
    target.style.webkitMaskImage = url;
    masked = true;
  };

  const clear = () => {
    target.style.maskImage = "";
    target.style.webkitMaskImage = "";
    octx.clearRect(0, 0, GW, GH);
    masked = false;
  };

  // Ash: flakes torn off where the front is, while it burns.
  const spawn = (dt: number) => {
    if (dir <= 0 || p <= 0 || p >= P_END - 0.05) return;
    const want = Math.min(MAX_FLAKES - flakes.length, Math.round(dt * 70 + Math.random()));
    const cw = ash.width - ASH_PAD * 2;
    const ch = ash.height - ASH_PAD * 2;
    for (let n = 0, tries = 0; n < want && tries < 400; tries++) {
      const k = (Math.random() * GW * GH) | 0;
      if (Math.abs(field[k] - p) > 0.012) continue;
      n++;
      flakes.push({
        x: ASH_PAD + ((k % GW) / (GW - 1)) * cw,
        y: ASH_PAD + (((k / GW) | 0) / (GH - 1)) * ch,
        vx: (Math.random() - 0.5) * 30,
        vy: -(25 + Math.random() * 55),
        age: 0,
        life: 1.4 + Math.random() * 1.8,
        size: 1.2 + Math.random() * 3.2,
        spin: Math.random() * Math.PI,
        turn: (Math.random() - 0.5) * 6,
        seed: Math.random() * 10,
      });
    }
  };
  const drawAsh = (dt: number, t: number) => {
    actx.clearRect(0, 0, ash.width, ash.height);
    for (let i = flakes.length - 1; i >= 0; i--) {
      const f = flakes[i];
      f.age += dt;
      if (f.age >= f.life) {
        flakes.splice(i, 1);
        continue;
      }
      // Rising on the heat, fluttering side to side, slowing as it cools.
      f.vy *= 1 - dt * 0.35;
      f.x += (f.vx + Math.sin(t * 3 + f.seed) * 18) * dt;
      f.y += f.vy * dt;
      f.spin += f.turn * dt;
      const a = f.age / f.life;
      // Glowing as it leaves the edge, then grey ash, then gone.
      const hot = Math.max(0, 1 - a * 3.5);
      const r = Math.round(70 + 185 * hot);
      const g = Math.round(66 + 74 * hot);
      const b = Math.round(62 - 32 * hot);
      actx.fillStyle = `rgba(${r},${g},${b},${(1 - a) * 0.9})`;
      actx.save();
      actx.translate(f.x, f.y);
      actx.rotate(f.spin);
      // Flat flakes: a squashed sliver that turns as it falls.
      actx.scale(1, 0.35 + 0.65 * Math.abs(Math.sin(f.spin * 1.7)));
      actx.fillRect(-f.size, -f.size * 0.6, f.size * 2, f.size * 1.2);
      actx.restore();
    }
  };

  // Burn progress runs on a clock `u` (0..1); the front eases in, so it catches slowly.
  let u = 0;
  const tick = (now: number) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    const before = u;
    u = Math.min(1, Math.max(0, u + (dir > 0 ? dt / BURN_S : -dt / HEAL_S)));
    p = P_END * Math.pow(u, 1.7) - 0.02;
    if (u <= 0) {
      if (masked) clear();
    } else if (u !== before || !masked || dir > 0) draw(now);
    spawn(dt);
    drawAsh(dt, now / 1000);
    // Nothing moving: healed (or burnt through) and the last ash gone.
    const settled = (u <= 0 && dir < 0) || (u >= 1 && dir > 0);
    if (settled && flakes.length === 0) {
      actx.clearRect(0, 0, ash.width, ash.height);
      frame = 0;
      last = 0;
      return;
    }
    frame = requestAnimationFrame(tick);
  };
  const run = (d: number) => {
    dir = d;
    if (!frame) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  };

  return {
    ignite: () => run(1),
    heal: () => run(-1),
    dispose: () => {
      cancelAnimationFrame(frame);
      flakes.length = 0;
      actx.clearRect(0, 0, ash.width, ash.height);
      clear();
    },
  };
}
