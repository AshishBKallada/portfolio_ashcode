"use client";

import { useEffect, useRef, useState } from "react";
import { MusicPlayer } from "@/components/ui/music-player";
import { site } from "@/data/site";
import { HERO_COURIER } from "@/lib/hero";

/**
 * The record player set into the face of the courier's suitcase. It sits inside the figure's
 * box, over the picture as the picture is laid out there (contained, feet on the bottom, centred;
 * see HeroCourierCloth), so it rides every move the courier makes. The player is drawn at a fixed
 * size, so it's scaled to fit the slot rather than restyled.
 */

// The courier picture's aspect, and where the suitcase's front face sits on it (fractions).
const ASPECT = HERO_COURIER.width / HERO_COURIER.height;
const FACE = { x: 0.292, y: 0.575, size: 0.0927 };

export function SuitcasePlayer() {
  const slot = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = slot.current;
    const player = inner.current;
    if (!el || !player) return;
    const fit = () => {
      const natural = player.offsetWidth || 256;
      setScale(el.clientWidth / natural);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    ro.observe(player);
    return () => ro.disconnect();
  }, []);

  return (
    // The picture's own rectangle inside the figure's box (container units of that box).
    // Marked so FilmRibbon can find where the courier is as he moves.
    <div
      data-courier-frame
      className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
      style={{
        width: `min(100cqw, calc(100cqh * ${ASPECT}))`,
        height: `min(100cqh, calc(100cqw / ${ASPECT}))`,
      }}
    >
      {/* Its top corners, for FilmRibbon to read where he is and how he's tilted. */}
      <span data-corner="a" className="absolute top-0 left-0 size-0" />
      <span data-corner="b" className="absolute top-0 right-0 size-0" />
      <div
        ref={slot}
        className="pointer-events-auto absolute aspect-square -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${FACE.x * 100}%`, top: `${FACE.y * 100}%`, width: `${FACE.size * 100}%` }}
      >
        <div
          ref={inner}
          className="absolute top-0 left-0 w-max origin-top-left"
          style={{ transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
        >
          <MusicPlayer src={site.music.src} aria-label="Music player" />
        </div>
      </div>
    </div>
  );
}
