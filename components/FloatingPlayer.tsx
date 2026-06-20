"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/audio/canta-de-luna.mp3";
const IMAGE_SRC = "/floating-mark.png";

function useOverHero() {
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const measure = () => {
      const statement = document.getElementById("statement");
      if (!statement) return;
      setOverHero(statement.getBoundingClientRect().top > 72);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("loader:done", measure, { once: true });

    return () => window.removeEventListener("scroll", measure);
  }, []);

  return overHero;
}

export default function FloatingPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const overHero = useOverHero();

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
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
  const toneClass = overHero
    ? "text-black"
    : "text-ink";
  const ringClass = overHero
    ? "border border-black/25 bg-white/60"
    : "border border-ink/25 bg-paper/60";

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[90] w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
      {/* Orbiting curved label */}
      <svg
        viewBox="0 0 140 140"
        className={`absolute inset-0 w-full h-full pointer-events-none animate-spin-slow transition-colors duration-500 ${toneClass}`}
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
        className={`group relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-[transform,color,border-color,background-color] duration-500 hover:scale-105 active:scale-95 ${ringClass}`}
      >
        <Image
          src={IMAGE_SRC}
          alt=""
          fill
          sizes="80px"
          className="object-cover"
        />
        <span
          aria-hidden
          className={`absolute inset-0 rounded-full transition-shadow duration-500 ${
            playing
              ? "shadow-[0_0_30px_rgba(255,26,26,0.55)] ring-1 ring-[#ff1a1a]/60"
              : ""
          }`}
        />
      </button>
    </div>
  );
}
