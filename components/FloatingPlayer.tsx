"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/audio/canta-de-luna.mp3";
const IMAGE_SRC = "/floating-mark.png";

export default function FloatingPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

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

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause audio" : "Play audio"}
      aria-pressed={playing}
      className="group fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[90] w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-[#E1E0CC]/25 bg-black/60 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:scale-105 active:scale-95"
    >
      <Image
        src={IMAGE_SRC}
        alt=""
        fill
        sizes="80px"
        className={`object-cover transition-transform duration-[6000ms] ease-linear ${
          playing ? "animate-spin-slow" : ""
        }`}
      />
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full ring-1 ring-[#ff1a1a]/0 transition-[box-shadow,ring] duration-500 ${
          playing
            ? "ring-[#ff1a1a]/60 shadow-[0_0_30px_rgba(255,26,26,0.45)]"
            : ""
        }`}
      />
      <span
        aria-hidden
        className="absolute bottom-1.5 right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-black/80 text-[#E1E0CC]"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </span>
    </button>
  );
}
