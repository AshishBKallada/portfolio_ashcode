import * as THREE from "three";

/**
 * The soft arched glow behind each work: a white arch (round top, square foot) blurred on
 * a canvas, transparent around it. One texture shared by every work.
 */
export function makeHaloTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.filter = "blur(22px)";
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.moveTo(48, 470);
  g.lineTo(48, 128);
  g.arc(128, 128, 80, Math.PI, 0);
  g.lineTo(208, 470);
  g.closePath();
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A small white wall label: the title in italic, its note under it in grey. */
export function makeLabelTexture(title: string, note: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 176;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fbfbfa";
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = "#1a1a1a";
  g.font = "italic 40px Georgia, 'Times New Roman', serif";
  g.fillText(title, 28, 70, 456);
  g.fillStyle = "#8a8a8a";
  g.font = "26px Georgia, 'Times New Roman', serif";
  g.fillText(note, 28, 122, 456);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
