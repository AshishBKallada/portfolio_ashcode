"use client";

import Image from "next/image";

import HeroHeader from "./HeroHeader";

export default function HeroSection() {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-white px-6 pt-6 text-black md:px-8 md:pt-8 lg:px-10 lg:pt-10">
      <HeroHeader />

      {/* Figure: pinned to bottom of hero section (viewport) */}
      <Image
        src="/hero-figure.png"
        alt="Ashcode hero illustration"
        width={1200}
        height={1500}
        sizes="(max-width: 768px) 96vw, min(90vw, 72rem)"
        className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-auto max-h-[min(90vh,1000px)] w-auto max-w-[min(calc(100vw-3rem),72rem)] -translate-x-1/2 object-contain object-bottom select-none"
        priority
      />

      {/* Bottom row */}
      <footer className="relative z-20 mt-auto flex w-full shrink-0 flex-col items-start justify-end gap-6 pb-6 font-mono text-[11px] leading-snug tracking-[0.12em] sm:flex-row sm:items-end sm:justify-between sm:gap-8 md:pb-8 md:text-xs lg:pb-10">
        <div className="flex flex-col uppercase">
          <span>End-to-end web.</span>
          <span>Shipped with MERN.</span>
        </div>

        <p className="max-w-[min(100%,22rem)] text-right uppercase leading-relaxed sm:max-w-xs md:max-w-md">
          Arrested for crimes against boring code.<br />
          Wanted for clean syntax, bleeding-edge stacks, and machine-like precision.<br />
          Architect by day. Flash-man by night.<br />
          MERN is my getaway car.
        </p>
      </footer>
    </div>
  );
}
