"use client";

import { MusicPlayer } from "@/components/ui/music-player";
import { site } from "@/data/site";

/**
 * The record player, pinned bottom right over every section. The component is
 * drawn at 256–320px, so it's scaled down from its corner rather than restyled.
 */
export function CornerPlayer() {
  return (
    <div className="pointer-events-none fixed right-8 bottom-4 z-[60] sm:right-12 sm:bottom-6">
      <div className="pointer-events-auto origin-bottom-right scale-[0.26] sm:scale-[0.34] md:scale-[0.36]">
        <MusicPlayer src={site.music.src} coverArt={site.music.coverArt} aria-label="Music player" />
      </div>
    </div>
  );
}
