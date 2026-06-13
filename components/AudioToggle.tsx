"use client";

import Image from "next/image";
import { useAudioPlaying } from "./useAudioPlaying";

const IDLE_RING = "MID WHO ? · PLAY BLAST · MID WHO ? · PLAY BLAST ·";
const PLAYING_RING = "NOW PLAYING · CANTA DE LUNA · NOW PLAYING · CANTA DE LUNA ·";

export default function AudioToggle({ audioId = "bg-audio" }: { audioId?: string }) {
  const isPlaying = useAudioPlaying(audioId);

  const toggle = () => {
    const audio = document.getElementById(audioId) as HTMLAudioElement | null;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-12 z-[60] pointer-events-none">
      <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className={`absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite] ${isPlaying ? "text-black" : "text-white"}`}
          aria-hidden
        >
          <defs>
            <path id="audio-toggle-curve" d="M 50,50 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" />
          </defs>
          <text
            fill="currentColor"
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontSize: 9,
              letterSpacing: "0.18em",
            }}
          >
            <textPath href="#audio-toggle-curve" startOffset="0">
              {isPlaying ? PLAYING_RING : IDLE_RING}
            </textPath>
          </text>
        </svg>

        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "Pause Canta de Luna" : "Play Canta de Luna"}
          aria-pressed={isPlaying}
          className="pointer-events-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
        >
          <Image
            src="/hero-cta-image.png"
            alt=""
            width={140}
            height={140}
            className="w-[78%] h-[78%] object-contain"
          />
        </button>
      </div>
    </div>
  );
}
