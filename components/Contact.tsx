"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useMagnetic } from "@/lib/useMagnetic";

const ACCENT = "#ff1a1a";
const PRIMARY_EMAIL = "ashercode4u@gmail.com";

const SOCIALS = [
  { label: "Github", href: "https://github.com/AshishBKallada" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Resume", href: "/ashishbkalladaresume.pdf" },
] as const;

function useKeralaTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function Contact() {
  const emailRef = useMagnetic<HTMLAnchorElement>(0.15);
  const backTopRef = useMagnetic<HTMLButtonElement>(0.3);
  const keralaTime = useKeralaTime();

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
      <div className="mx-auto max-w-7xl px-6 md:px-12 pt-16 md:pt-24 pb-8 md:pb-10">
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

        {/* Focal headline */}
        <h2 className="font-headline italic tracking-[-0.04em] leading-[0.82] text-[clamp(3.25rem,13vw,11rem)] -ml-[0.04em]">
          Let&apos;s talk.
        </h2>

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

        {/* Numbered socials grid with hover slide-fill */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 border-t border-b border-ink/15 sm:divide-x divide-y sm:divide-y-0 divide-ink/15">
          {SOCIALS.map(({ label, href }, i) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between gap-4 px-4 md:px-6 py-5 md:py-7 overflow-hidden"
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-[550ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
              />
              <span className="relative flex items-baseline gap-2 md:gap-3">
                <span className="font-body text-[9px] uppercase tracking-[0.28em] text-ink/50 group-hover:text-paper/60 transition-colors duration-500">
                  0{i + 1}
                </span>
                <span className="font-headline italic text-lg md:text-2xl text-ink group-hover:text-paper transition-colors duration-500">
                  {label}
                </span>
              </span>
              <ArrowUpRight
                className="relative shrink-0 w-4 h-4 md:w-5 md:h-5 text-ink/60 group-hover:text-paper transition-[transform,color] duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                strokeWidth={1.2}
              />
            </a>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-6 md:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between font-body text-[10px] uppercase tracking-[0.28em] text-ink/55">
          <p>© 2026 Ashcode · Built solo in Kerala</p>
          <p className="tabular-nums">{keralaTime || "—"} IST · Kochi, IN</p>
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
