import { BufferAttribute, BufferGeometry, Color, Vector3 } from "three";

const UP = new Vector3(0, 1, 0);
const t = new Vector3();
const n = new Vector3();
const b = new Vector3();
const prevN = new Vector3();

/**
 * One geometry holding `count` tubes of `rings` rings each, rebuilt in place every frame from
 * their centre lines. The dragon's body is one; its mane, whiskers and tail tuft share another.
 * Each ring's frame keeps "up" as close to the world's up as it can, so a body's belly stays
 * underneath it through the turns.
 */
export class Tubes {
  readonly geometry = new BufferGeometry();
  readonly rings: number;
  readonly radial: number;
  readonly count: number;
  /** Per ring, after `update`: the tangent (towards the tube's start), up and side. */
  readonly T: Float32Array;
  readonly N: Float32Array;
  readonly B: Float32Array;
  private pos: Float32Array;
  private nrm: Float32Array;

  constructor(
    count: number,
    rings: number,
    radial: number,
    opts: { aroundRepeat?: number; alongRepeat?: number; colors?: (around: number, along: number) => Color } = {},
  ) {
    this.count = count;
    this.rings = rings;
    this.radial = radial;
    const per = rings * (radial + 1);
    const verts = count * per;
    this.pos = new Float32Array(verts * 3);
    this.nrm = new Float32Array(verts * 3);
    this.T = new Float32Array(count * rings * 3);
    this.N = new Float32Array(count * rings * 3);
    this.B = new Float32Array(count * rings * 3);
    const uv = new Float32Array(verts * 2);
    const col = opts.colors ? new Float32Array(verts * 3) : null;
    const index: number[] = [];
    for (let k = 0; k < count; k++) {
      for (let i = 0; i < rings; i++) {
        for (let j = 0; j <= radial; j++) {
          const v = k * per + i * (radial + 1) + j;
          uv[v * 2] = (j / radial) * (opts.aroundRepeat ?? 1);
          uv[v * 2 + 1] = (i / (rings - 1)) * (opts.alongRepeat ?? 1);
          if (col && opts.colors) {
            const c = opts.colors(j / radial, i / (rings - 1));
            col[v * 3] = c.r;
            col[v * 3 + 1] = c.g;
            col[v * 3 + 2] = c.b;
          }
          if (i < rings - 1 && j < radial) {
            const a = v;
            const bb = v + radial + 1;
            index.push(a, bb, a + 1, bb, bb + 1, a + 1);
          }
        }
      }
    }
    this.geometry.setAttribute("position", new BufferAttribute(this.pos, 3));
    this.geometry.setAttribute("normal", new BufferAttribute(this.nrm, 3));
    this.geometry.setAttribute("uv", new BufferAttribute(uv, 2));
    if (col) this.geometry.setAttribute("color", new BufferAttribute(col, 3));
    this.geometry.setIndex(index);
  }

  /** Frames for one centre line (`c`, rings × 3) into this tube's slot `k`. */
  frames(k: number, c: Float32Array, up: Vector3 = UP) {
    const R = this.rings;
    const o = k * R * 3;
    for (let i = 0; i < R; i++) {
      const a = Math.max(0, i - 1) * 3;
      const z = Math.min(R - 1, i + 1) * 3;
      t.set(c[a] - c[z], c[a + 1] - c[z + 1], c[a + 2] - c[z + 2]);
      if (t.lengthSq() < 1e-10) t.set(0, 0, 1);
      t.normalize();
      n.copy(up).addScaledVector(t, -up.dot(t));
      if (n.lengthSq() < 0.04 && i > 0) n.copy(prevN).addScaledVector(t, -prevN.dot(t));
      if (n.lengthSq() < 1e-8) n.set(1, 0, 0).addScaledVector(t, -t.x);
      n.normalize();
      b.crossVectors(t, n);
      prevN.copy(n);
      const p = o + i * 3;
      this.T[p] = t.x;
      this.T[p + 1] = t.y;
      this.T[p + 2] = t.z;
      this.N[p] = n.x;
      this.N[p + 1] = n.y;
      this.N[p + 2] = n.z;
      this.B[p] = b.x;
      this.B[p + 1] = b.y;
      this.B[p + 2] = b.z;
    }
  }

  /** Rebuild tube `k` round its centre line `c` with radii `r` (one per ring). */
  update(k: number, c: Float32Array, r: Float32Array | ((i: number) => number), up?: Vector3) {
    this.frames(k, c, up);
    const R = this.rings;
    const M = this.radial;
    const base = k * R * (M + 1);
    const fo = k * R * 3;
    for (let i = 0; i < R; i++) {
      const rad = typeof r === "function" ? r(i) : r[i];
      const f = fo + i * 3;
      for (let j = 0; j <= M; j++) {
        const a = (j / M) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const nx = ca * this.N[f] + sa * this.B[f];
        const ny = ca * this.N[f + 1] + sa * this.B[f + 1];
        const nz = ca * this.N[f + 2] + sa * this.B[f + 2];
        const v = (base + i * (M + 1) + j) * 3;
        this.pos[v] = c[i * 3] + nx * rad;
        this.pos[v + 1] = c[i * 3 + 1] + ny * rad;
        this.pos[v + 2] = c[i * 3 + 2] + nz * rad;
        this.nrm[v] = nx;
        this.nrm[v + 1] = ny;
        this.nrm[v + 2] = nz;
      }
    }
  }

  commit() {
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.normal.needsUpdate = true;
  }

  dispose() {
    this.geometry.dispose();
  }
}
