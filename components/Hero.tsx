"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAudioPlaying } from "./useAudioPlaying";

const SplashCursor = dynamic(() => import("./SplashCursor"), { ssr: false });

const LIGHT_GRID = {
  backgroundImage:
    "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(0,0,0,0.034) calc(8.333333% - 1px), rgba(0,0,0,0.034) 8.333333%)",
};

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const isPlaying = useAudioPlaying("bg-audio");
  const [inView, setInView] = useState(true);

  // Pause heavy WebGL (SplashCursor) when Hero scrolls out of view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Entrance + staggered text reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.set(bgRef.current, { scale: 1.12, y: 56, opacity: 0, transformOrigin: "50% 100%" });
        gsap.to(bgRef.current, { scale: 1, y: 0, opacity: 1, duration: 1.35, ease: "power3.out" });
      }
      const root = sectionRef.current;
      if (!root) return;
      gsap.from(root.querySelectorAll(".hero-tag"), { y: 18, opacity: 0, duration: 0.6, delay: 0.45, ease: "power2.out" });
      gsap.from(root.querySelectorAll(".hw"), { y: 90, opacity: 0, duration: 1.05, stagger: 0.07, delay: 0.6, ease: "power4.out" });
      gsap.from(root.querySelectorAll(".hero-cta"), { y: 22, opacity: 0, duration: 0.65, delay: 1.35, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, []);

  // Horizontal cursor parallax — bg drifts opposite, figure follows
  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const figure = figureRef.current;
    if (!section || !bg || !figure) return;

    const bgX = gsap.quickTo(bg, "x", { duration: 1.2, ease: "power3.out" });
    const figX = gsap.quickTo(figure, "x", { duration: 0.9, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      bgX(nx * -28);
      figX(nx * 42);
    };
    const onLeave = () => { bgX(0); figX(0); };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="sticky top-0 z-0 w-full min-h-screen overflow-hidden bg-transparent text-white"
      style={{ color: isPlaying ? "#000" : "#fff" }}
    >
      {/* Blurred background image */}
      <div ref={bgRef} className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 scale-105">
          <Image
            src="/bali.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center blur-[3px] brightness-[0.92] saturate-[1.15]"
          />
        </div>
      </div>

      {/* Foreground hero figure — always visible */}
      <div
        ref={figureRef}
        className="pointer-events-none absolute inset-0 z-[3] will-change-transform"
      >
        <Image
          src="/hero-image.png"
          alt="Ashish B Kallada — hero"
          fill
          priority
          sizes="100vw"
          className="object-contain object-bottom"
        />
      </div>

      {/* SplashCursor — only when Hero is in view. */}
      {inView && (
        <SplashCursor
          RAINBOW_MODE={false}
          COLOR="#3fd75e"
          SIM_RESOLUTION={64}
          DYE_RESOLUTION={512}
          PRESSURE_ITERATIONS={8}
          SHADING={false}
        />
      )}

      {/* Readability gradient — hidden during playback */}
      {!isPlaying && (
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ background: "linear-gradient(115deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0) 60%)" }}
          aria-hidden
        />
      )}

      {/* Circular white reveal — grows from the audio button */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-white"
        style={{
          clipPath: `circle(${isPlaying ? "150%" : "0%"} at calc(100% - 4rem) calc(100% - 4rem))`,
          transition: "clip-path 900ms cubic-bezier(0.65, 0, 0.35, 1)",
        }}
        aria-hidden
      />

      {/* 12-column gridlines */}
      <div className="pointer-events-none absolute inset-0 z-[1]" style={LIGHT_GRID} aria-hidden />

      {/* Headline block — bottom-left. Colors inherit from section via currentColor */}
      <div className="absolute left-0 right-0 bottom-24 md:bottom-28 z-[3] px-6 md:px-12 max-w-2xl md:max-w-3xl pointer-events-none">
        <p className="hero-tag font-body text-xs uppercase tracking-[0.3em] mb-4 opacity-70">
          Full-stack engineer / Kerala, India
        </p>
        <h1
          className="font-headline text-[14vw] md:text-[9vw] lg:text-[7.5vw] leading-[0.85] tracking-[-0.02em]"
          style={!isPlaying ? { textShadow: "0 2px 12px rgba(0,0,0,0.4)" } : undefined}
        >
          <span className="hw inline-block mr-[0.18em]">Obsession</span>
          <span className="hw inline-block mr-[0.18em]"><em>beats</em></span>
          <br />
          <span className="hw inline-block">talent.</span>
        </h1>
        <div className="hero-cta mt-8 flex flex-wrap gap-4 items-center">
          <a
            href="mailto:ashercode4u@gmail.com"
            className="group pointer-events-auto inline-flex items-center gap-2 px-6 py-3 border transition-colors duration-300 font-headline text-lg backdrop-blur-sm"
            style={{
              borderColor: "currentColor",
              backgroundColor: isPlaying ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
            }}
          >
            <span>Get in Touch</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:rotate-45 transition-transform"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
          <span className="font-body text-xs uppercase tracking-[0.2em] opacity-70">
            Available · Q3 2026
          </span>
        </div>
      </div>

      {/* Hex tag — bottom-left */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-12 z-[3] font-body text-[11px] tracking-[0.2em] opacity-70">
        0x2f·7a · 4b · ff · 01 · 3c · ae →
      </div>

      {/* "Scroll to explore" — bottom-center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3] flex items-center gap-2 pointer-events-none opacity-70">
        <p className="font-body text-xs uppercase tracking-[0.25em]">Scroll to explore</p>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 animate-bounce"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
