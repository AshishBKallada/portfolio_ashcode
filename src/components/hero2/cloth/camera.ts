import { CH, CLOTH, CW } from "./settings";

export type Vec3 = [number, number, number];

const t = (CLOTH.tilt * Math.PI) / 180;
const r = (CLOTH.turn * Math.PI) / 180;

/** World-to-view rotation, by rows. */
export const R0: Vec3 = [Math.cos(r), 0, Math.sin(r)];
export const R1: Vec3 = [Math.sin(t) * Math.sin(r), Math.cos(t), -Math.sin(t) * Math.cos(r)];
export const R2: Vec3 = [-Math.cos(t) * Math.sin(r), Math.sin(t), Math.cos(t) * Math.cos(r)];
/** The rows laid end to end; GLSL reads them as columns, so shaders multiply `p * uR`. */
export const ROWS_FLAT = new Float32Array([...R0, ...R1, ...R2]);

/** Camera distance: far (flat) at perspective 0, close at 1. */
export const CAM = Math.exp(Math.log(18) * (1 - CLOTH.perspective) + Math.log(1.7) * CLOTH.perspective);

export type View = { cx: number; cy: number; zoom: number; aspect: number; width: number; height: number };

/** Where the cloth sits and how big, for a hero of this size. */
export function viewFor(width: number, height: number): View {
  const aspect = width / height;
  if (width >= 1100 && aspect >= 1.25) {
    return { cx: 0.402, cy: 0.485, zoom: Math.min(1, (0.58 * aspect) / (CW * 1.12)), aspect, width, height };
  }
  const narrow = aspect < 0.75;
  return {
    cx: 0.5,
    cy: narrow ? 0.41 : 0.43,
    zoom: Math.min(1, (0.92 * aspect) / (CW * 1.12), (narrow ? 0.6 : 0.66) / CH),
    aspect,
    width,
    height,
  };
}

const dot = (a: Vec3, x: number, y: number, z: number) => a[0] * x + a[1] * y + a[2] * z;

/** A world point in view space. */
export const toView = (x: number, y: number, z: number): Vec3 => [dot(R0, x, y, z), dot(R1, x, y, z), dot(R2, x, y, z)];

/** Perspective scale of a view-space depth. */
export const scaleAt = (qz: number) => CAM / Math.max(CAM - qz, 0.001);

/** Screen units (before zoom) back to world, at a view-space depth. */
export function unproject(sx: number, sy: number, qz: number): Vec3 {
  const s = scaleAt(qz);
  const qx = sx / s;
  const qy = sy / s;
  return [
    qx * R0[0] + qy * R1[0] + qz * R2[0],
    qx * R0[1] + qy * R1[1] + qz * R2[1],
    qx * R0[2] + qy * R1[2] + qz * R2[2],
  ];
}

/** A pointer position in screen units (before zoom). */
export function pointerToScreen(clientX: number, clientY: number, rect: DOMRect, view: View): [number, number] {
  return [
    (((clientX - rect.left) / rect.width - view.cx) * view.aspect) / view.zoom,
    (view.cy - (clientY - rect.top) / rect.height) / view.zoom,
  ];
}
