"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

import AudioPlayButton from "./AudioPlayButton";
import type { ColorScheme } from "../lib/color-scheme";

const HERO_ROTATION_IMAGES = [
  "/hero-bg2.png",
  "/hero-figure-Photoroom.png",

  "/hero-bg3.png",
  "/hero-figure-Photoroom.png",

] as const;

export default function HeroSection({ colorScheme = "dark" }: { colorScheme?: ColorScheme }) {
  const light = colorScheme === "light";
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % HERO_ROTATION_IMAGES.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const flashEl = flashRef.current;
    if (!flashEl) return;

    gsap.killTweensOf(flashEl);
    gsap.set(flashEl, { opacity: 0 });
    const tl = gsap.timeline();
    tl.to(flashEl, { opacity: 0.9, duration: 0.06, ease: "power2.out" })
      .to(flashEl, { opacity: 0.12, duration: 0.11, ease: "power2.out" })
      .to(flashEl, { opacity: 0.45, duration: 0.05, ease: "power2.out" })
      .to(flashEl, { opacity: 0, duration: 0.16, ease: "power2.out" });
  }, [heroImageIndex]);

  return (
    <div
      className={`relative flex min-h-[100dvh] w-full flex-col px-6 pt-6 transition-colors duration-300 md:px-8 md:pt-8 lg:px-10 lg:pt-10 ${light ? "bg-white text-black" : "bg-black text-white"}`}
    >
      <Image
        src="/hero-bgx.jpg"
        alt=""
        fill
        className="pointer-events-none absolute inset-0 z-0 object-cover"
        sizes="100vw"
        priority
      />
      <div
        className={`pointer-events-none absolute inset-0 z-[1] ${
          light
            ? "bg-gradient-to-b from-white/30 via-white/12 to-white/35"
            : "bg-gradient-to-b from-black/45 via-black/28 to-black/55"
        }`}
      />

      <div className="absolute right-6 top-24 z-20 md:right-8 md:top-28 lg:right-10 lg:top-32">
        <AudioPlayButton src="/audio/hero.mp3" calloutOnLight={light} />
      </div>

      <Image
        src={HERO_ROTATION_IMAGES[heroImageIndex]}
        alt="Ashcode hero illustration"
        width={1200}
        height={1500}
        sizes="(max-width: 768px) 96vw, min(90vw, 72rem)"
        className="pointer-events-none absolute bottom-0 left-1/2 z-[2] h-auto max-h-[min(90vh,1000px)] w-auto max-w-[min(100%,72rem)] -translate-x-1/2 object-contain object-bottom select-none"
        priority
      />
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-[30] opacity-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.75) 24%, rgba(255,255,255,0.18) 52%, rgba(255,255,255,0) 76%)",
        }}
      />
    </div>
  );
}
