"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FLOATING_PLAYER } from "@/lib/constants";
import { overHeroTone, themeClasses } from "@/lib/theme";
import { useOverHero } from "@/lib/useOverHero";

export default function FloatingPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const overHero = useOverHero();
  const tone = overHeroTone(overHero);

  useEffect(() => {
    const audio = new Audio(FLOATING_PLAYER.audio);
    audio.loop = true;
    audio.preload = "none";
    audioRef.current = audio;

    const onEnded = () => setPlaying(false);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const label = playing ? "TAP TO PAUSE · " : "TAP TO PLAY · ";

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[90] w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
      {/* Orbiting curved label */}
      <svg
        viewBox="0 0 140 140"
        className={`absolute inset-0 w-full h-full pointer-events-none animate-spin-slow transition-colors duration-500 ${tone.floatingTone}`}
        aria-hidden
      >
        <defs>
          <path
            id="floating-player-curve"
            d="M 70 70 m -58 0 a 58 58 0 1 1 116 0 a 58 58 0 1 1 -116 0"
            fill="none"
          />
        </defs>
        <text
          fill="currentColor"
          style={{
            fontSize: "10px",
            letterSpacing: "0.32em",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          <textPath href="#floating-player-curve" startOffset="0">
            {label.repeat(4)}
          </textPath>
        </text>
      </svg>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause audio" : "Play audio"}
        aria-pressed={playing}
        className={`group relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-[transform,color,border-color,background-color] duration-500 hover:scale-105 active:scale-95 ${tone.floatingRing}`}
      >
        <Image
          src={FLOATING_PLAYER.image}
          alt=""
          fill
          sizes="80px"
          className="object-cover"
        />
        <span
          aria-hidden
          className={`absolute inset-0 rounded-full transition-shadow duration-500 ${
            playing ? themeClasses.accent.playingGlow : ""
          }`}
        />
      </button>
    </div>
  );
}
