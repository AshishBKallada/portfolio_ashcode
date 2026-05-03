"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

import AudioPlayButton from "./AudioPlayButton";
import type { ColorScheme } from "../lib/color-scheme";
import { prefersReducedMotion } from "../lib/main-scroller";

const HERO_IMAGE = "/hero-latestx.png";

export default function HeroSection({ colorScheme = "light" }: { colorScheme?: ColorScheme }) {
  const light = colorScheme === "light";
  const rootRef = useRef<HTMLDivElement>(null);
  const bgScaleRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    const bg = bgScaleRef.current;
    const audio = audioRef.current;
    if (!root || !bg) return;

    const ctx = gsap.context(() => {
      const bgStart = light ? 1.12 : 1.14;
      const bgEnd = light ? 1 : 0.98;
      if (light) {
        gsap.set(bg, {
          scale: bgStart,
          y: 56,
          opacity: 0,
          filter: "blur(12px)",
          transformOrigin: "50% 100%",
        });
      } else {
        gsap.set(bg, {
          scale: bgStart,
          transformOrigin: "50% 100%",
        });
      }
      if (audio) gsap.set(audio, { x: 28, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (light) {
        tl.to(
          bg,
          { scale: bgEnd, y: 0, opacity: 1, filter: "blur(0px)", duration: 1.35 },
          0,
        );
      } else {
        tl.to(bg, { scale: bgEnd, duration: 1.45 }, 0);
      }
      if (audio) {
        tl.to(audio, { x: 0, opacity: 1, duration: 0.75, ease: "power2.out" }, light ? 0.32 : 0.22);
      }
    }, root);

    return () => ctx.revert();
  }, [light]);

  const lightGridStyle = {
    backgroundImage:
      "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(0,0,0,0.034) calc(8.333333% - 1px), rgba(0,0,0,0.034) 8.333333%)",
  } as const;

  return (
    <div
      ref={rootRef}
      className={`relative flex min-h-[100dvh] w-full flex-col overflow-hidden px-0 pt-0 transition-colors duration-300 ${light ? "bg-transparent text-white" : "bg-black text-white"}`}
    >
      {light ? (
        <>
          <div ref={bgScaleRef} className="pointer-events-none absolute inset-0 z-0">
            <Image
              src={HERO_IMAGE}
              alt="Ashcode hero illustration"
              fill
              className="grayscale object-cover object-bottom"
              sizes="100vw"
              priority
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={lightGridStyle}
            aria-hidden
          />
        </>
      ) : (
        <>
          <div ref={bgScaleRef} className="pointer-events-none absolute inset-0 z-0">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              className="object-cover object-bottom"
              sizes="100vw"
              priority
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/28 to-black/55" />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-black/[0.32]" aria-hidden />
        </>
      )}

      <div
        ref={audioRef}
        className="absolute right-4 top-24 z-20 md:right-6 md:top-28 lg:right-8 lg:top-32"
      >
        <AudioPlayButton src="/audio/hero.mp3" calloutOnLight={light} />
      </div>

    </div>
  );
}
