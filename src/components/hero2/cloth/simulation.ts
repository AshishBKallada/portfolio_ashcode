import { pointerToScreen, scaleAt, toView, unproject, type View } from "./camera";
import { CH, CLOTH, COLS, CW, ROWS } from "./settings";

const N = COLS * ROWS;
const TOP_LEFT = (ROWS - 1) * COLS;
const TOP_RIGHT = ROWS * COLS - 1;
const ROLL = (CLOTH.pinRoll * Math.PI) / 180;
const BEND = 0.02 + (0.6 - 0.02) * CLOTH.stiffness;
const TETHER = 1.02;

const ridge = (x: number) => Math.sqrt(Math.sin(x) ** 2 + 0.03) - 0.64;

/** The permanent creases pressed into the cloth, as height. */
function crease(u: number, v: number) {
  return (
    CLOTH.crumple *
    0.045 *
    CH *
    (ridge(2.7 * u + 2.9 * v + 0.7) +
      0.8 * ridge(-2.6 * u + 3.3 * v + 2.1) +
      0.5 * Math.sin(4.9 * u - 1.4 * v + 2.2) +
      0.55 * ridge(1.1 * u + 6.4 * v + 1.3) +
      0.4 * ridge(8.3 * u + 3.9 * v + 0.2) +
      0.3 * ridge(-5.7 * u + 9.1 * v + 1.6))
  );
}

type Grab = { index: number; depth: number; offset: [number, number]; pointer: [number, number]; weights: Float32Array };

/**
 * A 46×42 Verlet cloth pinned by its top corners. Row 0 is the bottom edge.
 * Positions are in world space, in screen units (1.0 = the hero's height).
 */
export class ClothSim {
  readonly pos = new Float32Array(N * 3);
  readonly normal = new Float32Array(N * 3);
  private prev = new Float32Array(N * 3);
  private flat = new Float32Array(N * 2);
  private fixed = new Uint8Array(N);
  private links: { a: number; b: number; rest: number; k: number }[] = [];
  private pins: [number, number, number][];
  private tetherMax = new Float32Array(N * 2);
  private time = 0;
  private sweepForward = true;
  private grab: Grab | null = null;
  calm = false;

  constructor() {
    const half = 0.5 * CW * CLOTH.spread;
    const top = 0.5 * CH;
    this.pins = [
      [-half * Math.cos(ROLL), top + half * Math.sin(ROLL), 0],
      [half * Math.cos(ROLL), top - half * Math.sin(ROLL), 0],
    ];
    const rest = new Float32Array(N * 3);
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const i = row * COLS + col;
        const u = col / (COLS - 1);
        const v = row / (ROWS - 1);
        const x = (u - 0.5) * CW;
        const y = (v - 0.5) * CH;
        this.flat[i * 2] = x;
        this.flat[i * 2 + 1] = y;
        rest.set([x, y, crease(u, v)], i * 3);
        // Starting pose: the hem a touch wider, leaning with the pins.
        const sx = x * (CLOTH.spread + (1 - CLOTH.spread) * (1 - v) ** 2);
        const dy = y - top;
        const c = Math.cos(-ROLL);
        const s = Math.sin(-ROLL);
        this.pos.set([sx * c - dy * s, top + sx * s + dy * c, crease(u, v)], i * 3);
      }
    }
    this.fixed[TOP_LEFT] = 1;
    this.fixed[TOP_RIGHT] = 1;
    this.pos.set(this.pins[0], TOP_LEFT * 3);
    this.pos.set(this.pins[1], TOP_RIGHT * 3);
    this.prev.set(this.pos);

    const link = (a: number, b: number, k: number) => {
      const d = Math.hypot(rest[a * 3] - rest[b * 3], rest[a * 3 + 1] - rest[b * 3 + 1], rest[a * 3 + 2] - rest[b * 3 + 2]);
      this.links.push({ a, b, rest: d, k });
    };
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const i = row * COLS + col;
        if (col + 1 < COLS) link(i, i + 1, 1);
        if (row + 1 < ROWS) link(i, i + COLS, 1);
        if (col + 1 < COLS && row + 1 < ROWS) {
          link(i, i + COLS + 1, 0.5);
          link(i + 1, i + COLS, 0.5);
        }
        if (col + 2 < COLS) link(i, i + 2, BEND);
        if (row + 2 < ROWS) link(i, i + 2 * COLS, BEND);
        if (col + 5 < COLS) link(i, i + 5, BEND * 0.5);
        if (row + 5 < ROWS) link(i, i + 5 * COLS, BEND * 0.5);
      }
    }

    // No point may stray further from a pin than 1.02× its flat distance to that corner.
    const corners = [TOP_LEFT, TOP_RIGHT];
    for (let i = 0; i < N; i++) {
      corners.forEach((c, p) => {
        this.tetherMax[i * 2 + p] =
          TETHER * Math.hypot(this.flat[i * 2] - this.flat[c * 2], this.flat[i * 2 + 1] - this.flat[c * 2 + 1]);
      });
    }

    // Hang it before the first frame, so it never shows as a flat sheet.
    for (let n = 0; n < 360; n++) this.step(1 / 240, 1);
    this.computeNormals();
  }

  /** Advance by one frame's elapsed seconds. */
  advance(seconds: number, view: View) {
    const dt = Math.min(seconds, 1 / 30);
    const h = dt / CLOTH.steps;
    for (let n = 0; n < CLOTH.steps; n++) this.step(h, CLOTH.damping, view);
    this.computeNormals();
  }

  private tether(i: number, x: number, y: number, z: number): [number, number, number] {
    for (let p = 0; p < 2; p++) {
      const [px, py, pz] = this.pins[p];
      const dx = x - px;
      const dy = y - py;
      const dz = z - pz;
      const d = Math.hypot(dx, dy, dz);
      const max = this.tetherMax[i * 2 + p];
      if (d > max) {
        const s = max / d;
        x = px + dx * s;
        y = py + dy * s;
        z = pz + dz * s;
      }
    }
    return [x, y, z];
  }

  private step(h: number, damping: number, view?: View) {
    this.time += h;
    const T = this.time;
    const damp = Math.exp(-(0.15 + 5.85 * damping) * h);
    const gust = 0.6 + 0.4 * Math.sin(0.37 * T) * Math.sin(0.23 * T + 1.0);
    const wind = this.calm ? 0 : CLOTH.flutter * 2.4 * gust * (CLOTH.gravity / 2.6);
    const cap = CLOTH.maxSpeed * h;
    const { pos, prev } = this;

    // The held point and its neighbours follow the pointer without gaining velocity.
    const held = new Uint8Array(N);
    if (this.grab && view) {
      const g = this.grab;
      const sx = g.pointer[0] + g.offset[0];
      const sy = g.pointer[1] + g.offset[1];
      const w = unproject(sx, sy, g.depth);
      const [tx, ty, tz] = this.tether(g.index, w[0], w[1], w[2]);
      const gi = g.index * 3;
      const dx = tx - pos[gi];
      const dy = ty - pos[gi + 1];
      const dz = tz - pos[gi + 2];
      for (let i = 0; i < N; i++) {
        const k = g.weights[i];
        if (k <= 0) continue;
        const j = i * 3;
        pos[j] += k * dx;
        pos[j + 1] += k * dy;
        pos[j + 2] += k * dz;
        prev[j] += k * dx;
        prev[j + 1] += k * dy;
        prev[j + 2] += k * dz;
        if (k >= 0.98) held[i] = 1;
      }
    }

    for (let row = 0; row < ROWS; row++) {
      const v = row / (ROWS - 1);
      for (let col = 0; col < COLS; col++) {
        const i = row * COLS + col;
        if (this.fixed[i] || held[i]) continue;
        const u = col / (COLS - 1);
        const s1 = Math.sin(9.1 * u - 3.7 * v + 3.1 * T);
        const s2 = Math.sin(6.3 * u + 7.9 * v - 2.3 * T + 1.3);
        const s3 = Math.sin(2.9 * u + 1.7 * T + 0.8 * Math.sin(0.5 * T)) * Math.cos(2.3 * v - 0.9 * T);
        const ax = wind * 0.25 * Math.sin(3.3 * v + 1.1 * T + u);
        const ay = wind * 0.1 * s2 - CLOTH.gravity;
        const az = wind * (0.45 * s1 + 0.35 * s2 + 0.3 * s3);
        const j = i * 3;
        let vx = (pos[j] - prev[j]) * damp + ax * h * h;
        let vy = (pos[j + 1] - prev[j + 1]) * damp + ay * h * h;
        let vz = (pos[j + 2] - prev[j + 2]) * damp + az * h * h;
        const speed = Math.hypot(vx, vy, vz);
        if (speed > cap) {
          const s = cap / speed;
          vx *= s;
          vy *= s;
          vz *= s;
        }
        prev[j] = pos[j];
        prev[j + 1] = pos[j + 1];
        prev[j + 2] = pos[j + 2];
        pos[j] += vx;
        pos[j + 1] += vy;
        pos[j + 2] += vz;
      }
    }

    // One sweep over the links, alternating direction each sub-step.
    const L = this.links;
    const forward = this.sweepForward;
    this.sweepForward = !forward;
    for (let n = 0; n < L.length; n++) {
      const { a, b, rest, k } = L[forward ? n : L.length - 1 - n];
      const wa = this.fixed[a] || held[a] ? 0 : 1;
      const wb = this.fixed[b] || held[b] ? 0 : 1;
      if (wa + wb === 0) continue;
      const ia = a * 3;
      const ib = b * 3;
      const dx = pos[ib] - pos[ia];
      const dy = pos[ib + 1] - pos[ia + 1];
      const dz = pos[ib + 2] - pos[ia + 2];
      const d = Math.hypot(dx, dy, dz) || 1e-9;
      const c = ((d - rest) / d) * k / (wa + wb);
      pos[ia] += dx * c * wa;
      pos[ia + 1] += dy * c * wa;
      pos[ia + 2] += dz * c * wa;
      pos[ib] -= dx * c * wb;
      pos[ib + 1] -= dy * c * wb;
      pos[ib + 2] -= dz * c * wb;
    }

    for (let i = 0; i < N; i++) {
      if (this.fixed[i] || held[i]) continue;
      const j = i * 3;
      const t = this.tether(i, pos[j], pos[j + 1], pos[j + 2]);
      pos[j] = t[0];
      pos[j + 1] = t[1];
      pos[j + 2] = t[2];
    }
  }

  private computeNormals() {
    const { pos, normal } = this;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const i = row * COLS + col;
        const l = (row * COLS + Math.max(col - 1, 0)) * 3;
        const r = (row * COLS + Math.min(col + 1, COLS - 1)) * 3;
        const d = (Math.max(row - 1, 0) * COLS + col) * 3;
        const u = (Math.min(row + 1, ROWS - 1) * COLS + col) * 3;
        const ax = pos[r] - pos[l];
        const ay = pos[r + 1] - pos[l + 1];
        const az = pos[r + 2] - pos[l + 2];
        const bx = pos[u] - pos[d];
        const by = pos[u + 1] - pos[d + 1];
        const bz = pos[u + 2] - pos[d + 2];
        const nx = ay * bz - az * by;
        const ny = az * bx - ax * bz;
        const nz = ax * by - ay * bx;
        const len = Math.hypot(nx, ny, nz) || 1;
        normal.set([nx / len, ny / len, nz / len], i * 3);
      }
    }
  }

  /** The point a pointer would pick, or -1, with its view depth. */
  pick(clientX: number, clientY: number, rect: DOMRect, view: View): { index: number; depth: number; screen: [number, number] } | null {
    const [px, py] = pointerToScreen(clientX, clientY, rect, view);
    const radius = CLOTH.grabRadius / view.zoom;
    let best = -1;
    let bestScore = Infinity;
    let bestDepth = 0;
    let bestScreen: [number, number] = [0, 0];
    for (let i = 0; i < N; i++) {
      const q = toView(this.pos[i * 3], this.pos[i * 3 + 1], this.pos[i * 3 + 2]);
      const s = scaleAt(q[2]);
      const sx = q[0] * s;
      const sy = q[1] * s;
      const d = Math.hypot(sx - px, sy - py);
      if (d > radius) continue;
      const score = d - 0.08 * q[2];
      if (score < bestScore) {
        bestScore = score;
        best = i;
        bestDepth = q[2];
        bestScreen = [sx, sy];
      }
    }
    return best < 0 ? null : { index: best, depth: bestDepth, screen: bestScreen };
  }

  /** Take hold of a picked point; no jump, as its offset from the pointer is kept. */
  hold(picked: { index: number; depth: number; screen: [number, number] }, clientX: number, clientY: number, rect: DOMRect, view: View) {
    const pointer = pointerToScreen(clientX, clientY, rect, view);
    const weights = new Float32Array(N);
    const gx = this.flat[picked.index * 2];
    const gy = this.flat[picked.index * 2 + 1];
    const reach = CLOTH.carryRadius * CH;
    for (let i = 0; i < N; i++) {
      if (this.fixed[i]) continue;
      const d = Math.hypot(this.flat[i * 2] - gx, this.flat[i * 2 + 1] - gy) / reach;
      weights[i] = d < 1 ? (1 - d * d) ** 2 : 0;
    }
    weights[picked.index] = 1;
    this.grab = {
      index: picked.index,
      depth: picked.depth,
      offset: [picked.screen[0] - pointer[0], picked.screen[1] - pointer[1]],
      pointer,
      weights,
    };
  }

  move(clientX: number, clientY: number, rect: DOMRect, view: View) {
    if (this.grab) this.grab.pointer = pointerToScreen(clientX, clientY, rect, view);
  }

  release() {
    this.grab = null;
  }

  get holding() {
    return this.grab !== null;
  }
}
