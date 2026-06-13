"use client";

import { useState } from "react";
import { Menu, Volume2, VolumeX } from "lucide-react";

export default function Header() {
  const [muted, setMuted] = useState(true);

  const toggleAudio = () => {
    const audio = document.getElementById("bg-audio") as HTMLAudioElement | null;
    if (!audio) return;
    if (muted) {
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    setMuted(!muted);
  };

  return (
    <header
      className="fixed top-0 left-0 w-full px-6 py-5 flex justify-between items-center z-50 text-white"
      style={{ mixBlendMode: "difference" }}
    >
      <button className="pointer-events-auto flex items-baseline gap-1">
        <span className="font-headline text-xl italic">ashish</span>
        <span className="font-body text-xs uppercase tracking-[0.25em] opacity-50">/ kallada</span>
      </button>
      <nav className="hidden md:flex items-center space-x-6 pointer-events-auto">
        {["Works", "About", "Contact"].map((label) => (
          <button
            key={label}
            onClick={() =>
              document
                .getElementById(label.toLowerCase() === "works" ? "projects" : label.toLowerCase())
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-xs hover:opacity-50 transition-opacity uppercase tracking-[0.2em] font-body"
          >
            {label}
          </button>
        ))}
        <button
          onClick={toggleAudio}
          aria-label={muted ? "Unmute audio" : "Mute audio"}
          className="hover:opacity-50 transition-opacity animate-pulse-glow"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </nav>
      <div className="md:hidden pointer-events-auto flex items-center gap-4">
        <button onClick={toggleAudio} className="hover:opacity-50 transition-opacity">
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button aria-label="Toggle menu">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
