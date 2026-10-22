"use client";

import { useEffect, useRef } from "react";
import {
  HEAD_FRAME_SIZE,
  HERO_HEAD_COUNT,
  HERO_HEAD_FRAME_URLS,
} from "@/lib/hero";

export { HEAD_FRAME_SIZE };

/** Shown at rest and on touch: looking a little left, toward the headline. */
const REST = 6;
/** How much of the remaining distance the head covers each frame (0–1). */
const EASE = 0.12;

/**
 * The hero figure, whose head turns to follow the cursor across the screen.
 * The head's position eases toward the pointer every animation frame, and
 * the two frames either side of it are crossfaded by how far between them it
 * is, so the turn reads as one smooth motion rather than a series of steps.
 * Images are updated directly, not through React state. Touch devices and
 * reduced motion keep the resting frame.
 */
export function HeadFollow({ reduce }: { reduce: boolean }) {
  const imgs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const show = (pos: number) => {
      const lo = Math.floor(pos);
      const hi = Math.min(HERO_HEAD_COUNT - 1, lo + 1);
      const mix = pos - lo;
      imgs.current.forEach((img, i) => {
        if (!img) return;
        // The lower frame stays solid underneath; the upper one fades in on
        // top, so the figure never thins out mid-blend.
        img.style.opacity = i === lo ? "1" : i === hi ? String(mix) : "0";
        img.style.zIndex = i === hi ? "2" : i === lo ? "1" : "0";
      });
    };
    show(REST);
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;

    let pos = REST;
    let target = REST;
    let raf = 0;
    const tick = () => {
      pos += (target - pos) * EASE;
      if (Math.abs(target - pos) < 0.01) pos = target;
      show(pos);
      raf = pos === target ? 0 : requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      target = Math.min(1, Math.max(0, e.clientX / window.innerWidth)) * (HERO_HEAD_COUNT - 1);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div className="absolute inset-0">
      {HERO_HEAD_FRAME_URLS.map((src, i) => (
        // Plain img: pre-cropped frames, all decoded up front so a swap never waits.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          ref={(el) => {
            imgs.current[i] = el;
          }}
          src={src}
          alt=""
          draggable={false}
          decoding="sync"
          fetchPriority={i === REST ? "high" : "auto"}
          width={HEAD_FRAME_SIZE.width}
          height={HEAD_FRAME_SIZE.height}
          style={{ opacity: i === REST ? 1 : 0 }}
          className="absolute inset-0 h-full w-full object-contain object-bottom select-none [backface-visibility:hidden] [transform:translateZ(0)]"
        />
      ))}
    </div>
  );
}
