"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

import type { ColorScheme } from "../lib/color-scheme";
import { prefersReducedMotion } from "../lib/main-scroller";

const HERO_BACKGROUND = "/bali.webp";
const HERO_IMAGE = "/hero-image.png";
const COCONUT_IMAGE = "/coconut-Photoroom.png";

export default function HeroSection({ colorScheme = "light" }: { colorScheme?: ColorScheme }) {
  const light = colorScheme === "light";
  const rootRef = useRef<HTMLDivElement>(null);
  const bgScaleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    const bg = bgScaleRef.current;
    if (!root || !bg) return;

    const ctx = gsap.context(() => {
      const bgStart = light ? 1.12 : 1.14;
      const bgEnd = light ? 1 : 0.98;
      if (light) {
        gsap.set(bg, {
          scale: bgStart,
          y: 56,
          opacity: 0,
          transformOrigin: "50% 100%",
        });
      } else {
        gsap.set(bg, {
          scale: bgStart,
          transformOrigin: "50% 100%",
        });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (light) {
        tl.to(
          bg,
          { scale: bgEnd, y: 0, opacity: 1, duration: 1.35 },
          0,
        );
      } else {
        tl.to(bg, { scale: bgEnd, duration: 1.45 }, 0);
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
      <div ref={bgScaleRef} className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 scale-105">
          <Image
            src={HERO_BACKGROUND}
            alt=""
            fill
            className="object-cover object-center blur-[3px] brightness-[0.92] saturate-[1.15]"
            sizes="100vw"
            priority
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <Image
          src={HERO_IMAGE}
          alt={light ? "Ashcode hero illustration" : ""}
          fill
          className="object-contain object-bottom"
          sizes="100vw"
          priority
        />
      </div>

      {light ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={lightGridStyle}
          aria-hidden
        />
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-black/28 to-black/55" />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-black/[0.32]" aria-hidden />
        </>
      )}

      <div className="pointer-events-none absolute bottom-0 left-0 z-[2] p-5 md:p-8 lg:p-10">
        <p className="max-w-[min(100%,28rem)] font-cormorant text-[clamp(1.15rem,3.4vw,1.85rem)] font-light italic leading-snug tracking-[0.01em] text-white/92 md:max-w-[32rem] lg:text-[clamp(1.25rem,2.6vw,2.05rem)]">
       why the coconut 
          <Image
            src={COCONUT_IMAGE}
            alt=""
            width={128}
            height={128}
            className="mx-1.5 inline-block -mb-6 h-[3.35em] w-[3.35em] min-h-12 min-w-12 align-[-0.12em] object-contain md:mx-2 md:min-h-14 md:min-w-14 lg:min-h-16 lg:min-w-16"
          />
           did I put this background, i dont know brah!
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 z-[2] flex items-center gap-2 p-5 md:p-8 lg:p-10">
        <p className="font-safiro text-[13px] font-light tracking-tight text-white/90 md:text-sm lg:text-[15px]">
          scroll for dope sh*t
        </p>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-white/80"
          aria-hidden
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
