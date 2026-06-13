"use client";

import { useEffect, useState } from "react";

export function useAudioPlaying(audioId: string) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = document.getElementById(audioId) as HTMLAudioElement | null;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
    };
  }, [audioId]);

  return isPlaying;
}
