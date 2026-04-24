"use client";

import Image from "next/image";

import AudioPlayButton from "./AudioPlayButton";
import type { ColorScheme } from "../lib/color-scheme";

export default function HeroSection({ colorScheme = "dark" }: { colorScheme?: ColorScheme }) {
  const light = colorScheme === "light";

  return (
    <div
      className={`relative flex min-h-[100dvh] w-full flex-col px-6 pt-6 transition-colors duration-300 md:px-8 md:pt-8 lg:px-10 lg:pt-10 ${light ? "bg-white text-black" : "bg-black text-white"}`}
    >
      <div className="absolute right-6 top-24 z-20 md:right-8 md:top-28 lg:right-10 lg:top-32">
        <AudioPlayButton src="/audio/hero.mp3" calloutOnLight={light} />
      </div>

      <Image
        src="/hero-figure-Photoroom.png"
        alt="Ashcode hero illustration"
        width={1200}
        height={1500}
        sizes="(max-width: 768px) 96vw, min(90vw, 72rem)"
        className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-auto max-h-[min(90vh,1000px)] w-auto max-w-[min(100%,72rem)] -translate-x-1/2 object-contain object-bottom select-none"
        priority
      />
    </div>
  );
}
