"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** The figure as normally shown. */
  base: string;
  /** Its twin, revealed where the cursor passes. */
  reveal: string;
  /** Natural size shared by both images. */
  width: number;
  height: number;
  reduce: boolean;
};

/** Natural image px per cell of the reveal mask. */
const CELL = 4;
/** Radius of the brush the cursor paints the reveal with (natural px). */
const BRUSH = 175;
/** How long a painted patch lingers before it has shrunk away (s). */
const LINGER = 1.6;
/** How strongly noise warps the mask's edge into a liquid outline. */
const WOBBLE = 0.32;
/**
 * The marble twin is framed a little larger and off-centre in its file;
 * this scale and offset (natural px) stack its silhouette on the figure's.
 * Found by maximising the overlap of the two silhouettes.
 */
const TWIN = { scale: 0.96, x: 40, y: 9 };

// Smooth 2D value noise over a small random lattice, 0..1.
const LATTICE = 64;
const lattice = Float32Array.from({ length: LATTICE * LATTICE }, () => Math.random());
const smooth = (t: number) => t * t * (3 - 2 * t);
function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const at = (i: number, j: number) =>
    lattice[(((j % LATTICE) + LATTICE) % LATTICE) * LATTICE + (((i % LATTICE) + LATTICE) % LATTICE)];
  const a = at(xi, yi) + (at(xi + 1, yi) - at(xi, yi)) * xf;
  const b = at(xi, yi + 1) + (at(xi + 1, yi + 1) - at(xi, yi + 1)) * xf;
  return a + (b - a) * yf;
}

// The figure with a liquid hover reveal, after the Lando Norris helmet
// reveal: the cursor paints its marble twin (stacked exactly over the
// figure) onto it with a soft brush, and paints topographic contour bands
// on the sky around it, leaving a trail that lingers and then shrinks away. The painted area's outline is warped by drifting noise, so
// it reads as a wet, organic blob rather than a circle. The plain <img>
// shows at rest; a canvas takes over only while any reveal is showing, so
// idle costs nothing. Pointer devices only: on touch the figure stays as is.
export function HeroFigureReveal({ base, reveal, width, height, reduce }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!box || !img || !canvas || !ctx) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const baseImg = new Image();
    const topImg = new Image();
    baseImg.src = base;
    topImg.src = reveal;

    // The reveal mask: a field of paint per cell, thresholded each frame.
    const cols = Math.ceil(width / CELL);
    const rows = Math.ceil(height / CELL);
    const field = new Float32Array(cols * rows);
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = cols;
    maskCanvas.height = rows;
    const maskCtx = maskCanvas.getContext("2d")!;
    const maskData = maskCtx.createImageData(cols, rows);
    // The twin, masked, is composed here before landing on the figure.
    const layer = document.createElement("canvas");
    const layerCtx = layer.getContext("2d")!;

    // Topographic contours for the painted sky: bands of warped noise in
    // faint cream and shadow, so they read as lighter and darker reds.
    const PAT = 2;
    const pattern = document.createElement("canvas");
    pattern.width = Math.ceil(width / PAT);
    pattern.height = Math.ceil(height / PAT);
    {
      const g = pattern.getContext("2d")!;
      const data = g.createImageData(pattern.width, pattern.height);
      for (let y = 0; y < pattern.height; y++) {
        for (let x = 0; x < pattern.width; x++) {
          const f = 0.0055 * PAT;
          const warp = noise(x * f * 2.3 + 17, y * f * 2.3 - 9) * 1.6;
          const h = noise(x * f + warp, y * f - warp * 0.6) * 0.75 + noise(x * f * 3, y * f * 3) * 0.25;
          const band = Math.floor(h * 14) % 2 === 0;
          const k = (y * pattern.width + x) * 4;
          if (band) {
            data.data[k] = 244;
            data.data[k + 1] = 241;
            data.data[k + 2] = 234;
            data.data[k + 3] = 52;
          } else {
            data.data[k] = 40;
            data.data[k + 1] = 4;
            data.data[k + 2] = 4;
            data.data[k + 3] = 72;
          }
        }
      }
      g.putImageData(data, 0, 0);
    }

    let ready = false;
    let alive = true;
    Promise.all([baseImg.decode(), topImg.decode()])
      .then(() => {
        if (alive) ready = true;
      })
      .catch(() => {});

    // The images are object-contain + bottom-aligned in the box, so the
    // canvas sits over exactly their drawn rect.
    const layout = () => {
      const bw = box.offsetWidth;
      const bh = box.offsetHeight;
      const fit = Math.min(bw / width, bh / height);
      const w = width * fit;
      const h = height * fit;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.style.left = `${(bw - w) / 2}px`;
      canvas.style.top = `${bh - h}px`;
      canvas.width = layer.width = Math.round(w * dpr);
      canvas.height = layer.height = Math.round(h * dpr);
    };
    layout();
    const resize = new ResizeObserver(layout);
    resize.observe(box);

    // Brush state, in natural image px: the brush trails the pointer.
    let bx = 0;
    let by = 0;
    let tx = 0;
    let ty = 0;
    let painting = false;
    let raf = 0;
    let last = 0;
    let shown = false;

    const show = (on: boolean) => {
      if (on === shown) return;
      shown = on;
      canvas.style.opacity = on ? "1" : "0";
      img.style.visibility = on ? "hidden" : "";
    };

    // Lay a soft round dab of paint, keeping the stronger of old and new.
    const sigma = BRUSH / 2;
    const reach = Math.ceil((BRUSH * 1.3) / CELL);
    const dab = (x: number, y: number) => {
      const ci = Math.round(x / CELL);
      const cj = Math.round(y / CELL);
      for (let j = Math.max(cj - reach, 0); j <= Math.min(cj + reach, rows - 1); j++) {
        for (let i = Math.max(ci - reach, 0); i <= Math.min(ci + reach, cols - 1); i++) {
          const dx = i * CELL - x;
          const dy = j * CELL - y;
          const v = 1.25 * Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
          const k = j * cols + i;
          if (v > field[k]) field[k] = v;
        }
      }
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;

      // The brush glides after the pointer, painting along the way.
      if (painting) {
        const fx = reduce ? tx : bx + (tx - bx) * 0.25;
        const fy = reduce ? ty : by + (ty - by) * 0.25;
        const steps = Math.max(Math.ceil(Math.hypot(fx - bx, fy - by) / (BRUSH / 4)), 1);
        for (let s = 1; s <= steps; s++) dab(bx + ((fx - bx) * s) / steps, by + ((fy - by) * s) / steps);
        bx = fx;
        by = fy;
      }

      // Paint dries off: everything fades toward the threshold and below,
      // so a patch shrinks inward from its edge before it disappears.
      const keep = Math.exp(-dt / (LINGER / 3));
      const t = reduce ? 0 : now / 1000;
      let any = false;
      const out = maskData.data;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          let v = field[k];
          if (v < 0.02) {
            field[k] = 0;
            out[k * 4 + 3] = 0;
            continue;
          }
          if (!painting || v < 1) v *= keep;
          field[k] = v;
          any = true;
          // Drifting noise bends the threshold into a liquid outline.
          const n = noise(i * 0.045 + t * 0.35, j * 0.045 - t * 0.25) - 0.5;
          out[k * 4 + 3] = v + n * WOBBLE > 0.5 ? 255 : 0;
        }
      }

      if (!any && !painting) {
        show(false);
        last = 0;
        return;
      }
      if (!ready) {
        raf = requestAnimationFrame(tick);
        return;
      }

      maskCtx.putImageData(maskData, 0, 0);
      const scale = canvas.width / width;
      // Contours, then the twin over them, cut to the mask (smoothly
      // upscaled, so its edge is soft).
      layerCtx.globalCompositeOperation = "source-over";
      layerCtx.setTransform(1, 0, 0, 1, 0, 0);
      layerCtx.clearRect(0, 0, layer.width, layer.height);
      layerCtx.setTransform(scale, 0, 0, scale, 0, 0);
      layerCtx.drawImage(pattern, 0, 0, width, height);
      layerCtx.drawImage(topImg, TWIN.x, TWIN.y, width * TWIN.scale, height * TWIN.scale);
      layerCtx.globalCompositeOperation = "destination-in";
      layerCtx.imageSmoothingEnabled = true;
      layerCtx.drawImage(maskCanvas, 0, 0, cols * CELL, rows * CELL);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(layer, 0, 0);
      show(true);
      raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (!ready) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      // Through the box's own transforms (scroll scale, cursor parallax).
      const nx = ((e.clientX - rect.left) / rect.width) * width;
      const ny = ((e.clientY - rect.top) / rect.height) * height;
      // Anywhere over the figure's picture: the figure itself shows its
      // marble twin, the sky around it shows contours.
      const over = nx >= 0 && ny >= 0 && nx <= width && ny <= height;
      // Start painting where the pointer arrived, not from a stale spot.
      if (over && !painting) {
        bx = nx;
        by = ny;
      }
      tx = nx;
      ty = ny;
      painting = over;
      wake();
    };
    const onLeave = () => {
      painting = false;
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      resize.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      img.style.visibility = "";
    };
  }, [base, reveal, width, height, reduce]);

  return (
    <div ref={boxRef} className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element -- the canvas
          below must draw this exact bitmap at its exact drawn rect. */}
      <img
        ref={imgRef}
        src={base}
        alt=""
        draggable={false}
        decoding="async"
        width={width}
        height={height}
        className="absolute inset-0 h-full w-full object-contain object-bottom select-none"
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ opacity: 0 }}
        className="pointer-events-none absolute"
      />
    </div>
  );
}
