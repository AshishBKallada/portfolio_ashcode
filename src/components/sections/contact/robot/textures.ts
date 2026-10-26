import * as THREE from "three";

/** A radial gradient from the centre to the edge, as an sRGB texture. */
export function radialTexture(stops: [number, string][], size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    for (const [o, col] of stops) g.addColorStop(o, col);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const css = (c: THREE.Color, a = 1) => `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`;

/** A soft glow of the accent, fading out to nothing. */
export const glowTexture = (accent: THREE.Color) =>
  radialTexture([
    [0, css(accent, 1)],
    [0.25, css(accent, 0.55)],
    [0.6, css(accent, 0.12)],
    [1, css(accent, 0)],
  ]);

/** The iris: light at the centre, the accent, then deeper at the rim. */
export function irisTexture(accent: THREE.Color) {
  const light = accent.clone().lerp(new THREE.Color(1, 1, 1), 0.6);
  const deep = accent.clone().lerp(new THREE.Color(0, 0, 0), 0.25);
  const deeper = accent.clone().lerp(new THREE.Color(0, 0, 0), 0.4);
  return radialTexture([
    [0, `#${light.getHexString()}`],
    [0.45, `#${accent.getHexString()}`],
    [0.8, `#${deep.getHexString()}`],
    [1, `#${deeper.getHexString()}`],
  ]);
}

/** The soft shadow under the robot. */
export const shadowTexture = () =>
  radialTexture([
    [0, "rgba(0,0,0,1)"],
    [0.5, "rgba(0,0,0,0.45)"],
    [1, "rgba(0,0,0,0)"],
  ]);
