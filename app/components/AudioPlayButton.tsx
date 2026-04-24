"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AudioPlayButtonProps = {
  src: string;
  playLabel?: string;
  pauseLabel?: string;
  /** Speech bubble tuned for white / light hero backgrounds */
  calloutOnLight?: boolean;
};

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

export default function AudioPlayButton({
  src,
  playLabel = "Play audio",
  pauseLabel = "Pause audio",
  calloutOnLight = false,
}: AudioPlayButtonProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => {
        setPlaying(false);
      });
    } else {
      el.pause();
    }
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const sync = () => setPlaying(!el.paused);
    el.addEventListener("play", sync);
    el.addEventListener("pause", sync);
    el.addEventListener("ended", sync);
    return () => {
      el.removeEventListener("play", sync);
      el.removeEventListener("pause", sync);
      el.removeEventListener("ended", sync);
    };
  }, []);

  return (
    <div className="flex max-w-[min(100%,16rem)] shrink-0 items-center">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div
        className={
          calloutOnLight
            ? "relative mr-1 max-w-[11.5rem] rounded-md border border-black/10 bg-zinc-100 px-2.5 py-2 shadow-md md:max-w-[13rem] md:px-3 md:py-2.5"
            : "relative mr-1 max-w-[11.5rem] rounded-md border border-white/30 bg-white/95 px-2.5 py-2 shadow-md backdrop-blur-[2px] md:max-w-[13rem] md:px-3 md:py-2.5"
        }
      >
        <p className="text-left font-safiro text-[10px] leading-snug tracking-tight text-neutral-900 md:text-[11px]">
          Wanna know who is Ashcode from himself?
        </p>
        {/* Triangle pointing at play button */}
        <span
          className={
            calloutOnLight
              ? "pointer-events-none absolute left-full top-1/2 -translate-y-1/2 border-y-[6px] border-l-[7px] border-y-transparent border-l-zinc-100"
              : "pointer-events-none absolute left-full top-1/2 -translate-y-1/2 border-y-[6px] border-l-[7px] border-y-transparent border-l-white/95"
          }
          aria-hidden
        />
      </div>

      <button
        type="button"
        onClick={toggle}
        className={`relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e6362d] text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${calloutOnLight ? "focus-visible:outline-black/30" : "focus-visible:outline-white"}`}
        aria-label={playing ? pauseLabel : playLabel}
        aria-pressed={playing}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
}
