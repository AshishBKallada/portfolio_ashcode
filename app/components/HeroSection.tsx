"use client";

import Image from "next/image";
import { useRef } from "react";

export default function HeroSection() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Audio component */}
      <audio
        ref={audioRef}
        src="/hero.mp3"
        preload="auto"
      />

      {/* Centered wizard image */}
      <div className="flex items-end justify-end h-full">
        <Image
          src="/retro-pc.png"
          alt="Wizard"
          width={1200}
          height={1200}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}



