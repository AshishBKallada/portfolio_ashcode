import * as THREE from "three";

function roundedRect(w: number, h: number, r: number, cy: number) {
  const s = new THREE.Shape();
  const x0 = -w / 2;
  const y0 = cy - h / 2;
  s.moveTo(x0 + r, y0);
  s.lineTo(x0 + w - r, y0);
  s.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
  s.lineTo(x0 + w, y0 + h - r);
  s.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
  s.lineTo(x0 + r, y0 + h);
  s.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
  s.lineTo(x0, y0 + r);
  s.quadraticCurveTo(x0, y0, x0 + r, y0);
  return s;
}

/** Splits every triangle into four, `rounds` times. */
function subdivide(pos: Float32Array, rounds: number) {
  let p = pos;
  for (let n = 0; n < rounds; n++) {
    const out = new Float32Array(p.length * 4);
    let o = 0;
    for (let i = 0; i < p.length; i += 9) {
      const a = [p[i], p[i + 1], p[i + 2]];
      const b = [p[i + 3], p[i + 4], p[i + 5]];
      const c = [p[i + 6], p[i + 7], p[i + 8]];
      const mid = (u: number[], v: number[]) => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2, (u[2] + v[2]) / 2];
      const ab = mid(a, b);
      const bc = mid(b, c);
      const ca = mid(c, a);
      for (const t of [a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca]) {
        out[o++] = t[0];
        out[o++] = t[1];
        out[o++] = t[2];
      }
    }
    p = out;
  }
  return p;
}

/** A rounded rectangle wrapped onto a sphere of `radius`, its normals pointing straight out. */
export function sphericalPanel(w: number, h: number, corner: number, centreY: number, radius: number) {
  const flat = new THREE.ShapeGeometry(roundedRect(w, h, corner, centreY), 48).toNonIndexed();
  const pos = subdivide(flat.getAttribute("position").array as Float32Array, 3);
  flat.dispose();
  const normal = new Float32Array(pos.length);
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i];
    const y = pos[i + 1];
    const z = Math.sqrt(Math.max(radius * radius - x * x - y * y, 0));
    pos[i + 2] = z;
    normal[i] = x / radius;
    normal[i + 1] = y / radius;
    normal[i + 2] = z / radius;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  return g;
}
