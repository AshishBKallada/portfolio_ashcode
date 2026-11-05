"use client";

import { useEffect, useRef } from "react";

/** Cell size in CSS px, the reveal's radius in cells, and how long a lit cell holds (ms). */
const CELL = 22;
const RADIUS = 2.6;
const HOLD = [260, 900] as const;

/**
 * A pixel reveal over an image: square cells under the pointer switch on to show `src`
 * (drawn in the same object-contain, bottom-aligned box as the image it covers), each
 * holding a moment at random before it blinks off, so the trail dissolves in blocks.
 * Mouse only; draws nothing until hovered and stops its loop once every cell is off.
 */
export function PixelReveal({ src, className = "" }: { src: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = src;
    /** The image pre-scaled to the canvas at device resolution, copied from cell by cell. */
    const sheet = document.createElement("canvas");
    /** Lit cells, keyed "col,row", to the time each goes off. */
    const lit = new Map<string, number>();
    let dpr = 1;
    let frame = 0;

    const layout = () => {
      // Its own layout size, not the box its parents' transforms scale it to.
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = sheet.width = Math.round(width * dpr);
      canvas.height = sheet.height = Math.round(height * dpr);
      if (!img.naturalWidth) return;
      // object-contain, object-bottom: scaled to fit, centred across, sat on the bottom.
      const scale = Math.min(sheet.width / img.naturalWidth, sheet.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const s = sheet.getContext("2d");
      s?.clearRect(0, 0, sheet.width, sheet.height);
      s?.drawImage(img, (sheet.width - w) / 2, sheet.height - h, w, h);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const c = CELL * dpr;
      for (const [key, off] of lit) {
        if (now > off) {
          lit.delete(key);
          continue;
        }
        const [col, row] = key.split(",").map(Number);
        ctx.drawImage(sheet, col * c, row * c, c, c, col * c, row * c, c, c);
      }
      frame = lit.size ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !img.naturalWidth) return;
      const r = canvas.getBoundingClientRect();
      // The canvas may be scaled by its parents' transforms: map the pointer into its own px.
      const x = ((e.clientX - r.left) / r.width) * (canvas.width / dpr);
      const y = ((e.clientY - r.top) / r.height) * (canvas.height / dpr);
      const pad = CELL * RADIUS;
      if (x < -pad || y < -pad || x > canvas.width / dpr + pad || y > canvas.height / dpr + pad) return;
      const now = performance.now();
      const cx = x / CELL;
      const cy = y / CELL;
      for (let col = Math.floor(cx - RADIUS); col <= cx + RADIUS; col++) {
        for (let row = Math.floor(cy - RADIUS); row <= cy + RADIUS; row++) {
          const d = Math.hypot(col + 0.5 - cx, row + 0.5 - cy);
          // Solid at the centre, scattered toward the rim, so the edge reads as pixels.
          if (d > RADIUS || Math.random() > 1.15 - d / RADIUS) continue;
          lit.set(`${col},${row}`, now + HOLD[0] + Math.random() * (HOLD[1] - HOLD[0]));
        }
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };

    img.onload = layout;
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [src]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
