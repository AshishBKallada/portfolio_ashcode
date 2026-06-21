"use client";

import { useEffect, useRef, useState } from "react";
import { colors } from "@/lib/theme/colors";
import { PLAYER } from "@/lib/constants/player";

const AUDIO_SRC = PLAYER.audioSrc;
// "歌" — uta, song. Sits in the white circle in place of the artwork.
const GLYPH = "歌";

function useOverHero() {
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const statement = document.getElementById("statement");
    if (!statement || typeof IntersectionObserver === "undefined") return;
    // We're "over hero" while the statement section hasn't yet crossed the top
    // 72px of the viewport. rootMargin shifts the IO trigger line up by that
    // much, so the toggle fires at the same boundary the old scroll handler
    // used — but only when it actually crosses, not on every scroll tick.
    const io = new IntersectionObserver(
      ([entry]) => setOverHero(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 }
    );
    io.observe(statement);
    return () => io.disconnect();
  }, []);

  return overHero;
}

export default function FloatingPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [attention, setAttention] = useState(false);
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

  useEffect(() => {
    let stopTimer: number | undefined;
    const start = () => {
      setAttention(true);
      stopTimer = window.setTimeout(() => setAttention(false), 3000);
    };
    // Wait for the loader; fall back if the event is missed.
    window.addEventListener("loader:done", start, { once: true });
    const fallback = window.setTimeout(start, 6000);
    return () => {
      window.removeEventListener("loader:done", start);
      window.clearTimeout(fallback);
      if (stopTimer !== undefined) window.clearTimeout(stopTimer);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (attention) setAttention(false);
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const label = playing ? PLAYER.pauseLabel : PLAYER.playLabel;
  const toneClass = overHero ? "text-black" : "text-ink";

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
            d="M 70 70 m -48 0 a 48 48 0 1 1 96 0 a 48 48 0 1 1 -96 0"
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

      {attention &&
        [0, 0.6, 1.2].map((delay) => (
          <span
            key={delay}
            aria-hidden
            className="pointer-events-none absolute w-16 h-16 md:w-20 md:h-20 rounded-full border-2 animate-attention-ring"
            style={{ borderColor: colors.accent, animationDelay: `${delay}s` }}
          />
        ))}

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? PLAYER.pauseAria : PLAYER.playAria}
        aria-pressed={playing}
        className="group relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-white/25 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex items-center justify-center transition-[transform,color,border-color,background-color] duration-500 hover:scale-105 active:scale-95"
        style={{ backgroundColor: colors.accent }}
      >
        <span
          aria-hidden
          className="relative z-[1] font-headline not-italic leading-none select-none text-[1.2rem] md:text-[1.45rem] text-white transition-transform duration-500 group-hover:scale-110"
        >
          {GLYPH}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 rounded-full transition-shadow duration-500"
          style={
            playing
              ? {
                  boxShadow: `0 0 30px rgba(${colors.accentRgb}, 0.55)`,
                  boxSizing: "border-box",
                  border: `1px solid rgba(${colors.accentRgb}, 0.6)`,
                }
              : undefined
          }
        />
      </button>
    </div>
  );
}
