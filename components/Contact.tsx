"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useMagnetic } from "@/lib/useMagnetic";
import StatsGrid from "./contact/StatsGrid";
import SocialsGrid from "./contact/SocialsGrid";

const ACCENT = "#ff1a1a";
const PRIMARY_EMAIL = "ashercode4u@gmail.com";

export default function Contact() {
  const emailRef = useMagnetic<HTMLAnchorElement>(0.15);
  const backTopRef = useMagnetic<HTMLButtonElement>(0.3);

  const scrollTop = () => {
    if (typeof window === "undefined") return;
    const lenis = (window as unknown as {
      __lenis?: { scrollTo: (target: number) => void };
    }).__lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="contact"
      className="relative z-10 w-full bg-paper text-ink border-t border-ink/10 overflow-hidden"
    >
      {/* Giant signature watermark behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center overflow-hidden"
      >
        <span className="font-headline italic text-[26vw] leading-[0.7] text-ink/[0.045] -mb-[2.5vw] select-none whitespace-nowrap tracking-[-0.04em]">
          ashcode
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 pt-16 md:pt-24 pb-8 md:pb-10">
        {/* Top meta row */}
        <div className="flex items-start justify-between mb-12 md:mb-16 font-body text-[10px] uppercase tracking-[0.32em] text-ink/55">
          <p>
            <span className="opacity-60">(04)</span>
            <span className="mx-2 opacity-30">/</span>
            Contact · コンタクト
          </p>
          <p className="flex items-center gap-2 tabular-nums">
            <span aria-hidden className="relative inline-flex w-1.5 h-1.5">
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: ACCENT, opacity: 0.55 }}
              />
              <span
                className="relative inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
            </span>
            Available Q3 26
          </p>
        </div>

        {/* Focal headline + japanese subtitle */}
        <h2 className="font-headline italic tracking-[-0.04em] leading-[0.82] text-[clamp(3.25rem,13vw,11rem)] -ml-[0.04em]">
          Let&apos;s talk.
        </h2>
        <p className="mt-3 md:mt-4 font-headline italic tracking-[-0.01em] text-base md:text-2xl text-ink/40">
          お話ししましょう
        </p>

        {/* Email with animated underline */}
        <a
          ref={emailRef}
          href={`mailto:${PRIMARY_EMAIL}`}
          data-cursor="cta"
          className="group mt-8 md:mt-12 inline-flex items-baseline gap-2 md:gap-3 font-headline italic tracking-[-0.01em] text-[clamp(1.35rem,4vw,2.5rem)] text-ink will-change-transform"
        >
          <span className="relative">
            {PRIMARY_EMAIL}
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 -bottom-1 h-[1.5px] bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[500ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
            />
          </span>
          <ArrowUpRight
            className="shrink-0 w-5 h-5 md:w-7 md:h-7 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
            strokeWidth={1.2}
          />
        </a>

        <div className="mt-14 md:mt-20">
          <StatsGrid />
        </div>

        <div className="mt-6 md:mt-8">
          <SocialsGrid />
        </div>

        {/* Bottom strip */}
        <div className="mt-8 md:mt-10 pt-5 border-t border-ink/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between font-body text-[10px] uppercase tracking-[0.28em] text-ink/55">
          <div className="flex flex-wrap items-center gap-3">
            <span>© 2026 Ashcode</span>
            <span aria-hidden className="hidden sm:inline-block w-px h-3 bg-ink/20" />
            <span>Built solo in Kerala</span>
            <span aria-hidden className="hidden sm:inline-block w-px h-3 bg-ink/20" />
            <span>Next.js · GSAP · Caffeine</span>
          </div>
          <button
            ref={backTopRef}
            type="button"
            onClick={scrollTop}
            className="group inline-flex items-center gap-2 hover:text-ink transition-colors will-change-transform"
          >
            Back to top
            <span
              aria-hidden
              className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-current/40 transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              <ArrowUp className="w-3 h-3" strokeWidth={1.4} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
