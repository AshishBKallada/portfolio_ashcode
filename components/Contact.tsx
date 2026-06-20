"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useMagnetic } from "@/lib/useMagnetic";
import { useScrollReveal } from "@/lib/useScrollReveal";

const ACCENT = "#ff1a1a";
const PRIMARY_EMAIL = "ashercode4u@gmail.com";
const SECONDARY_EMAIL = "ashishbkallada@gmail.com";

const SOCIALS: { k: string; v: string; href: string; external?: boolean }[] = [
  { k: "Github",   v: "@AshishBKallada",     href: "https://github.com/AshishBKallada", external: true },
  { k: "LinkedIn", v: "@ashishkallada",       href: "https://www.linkedin.com",          external: true },
  { k: "Email",    v: "ashercode4u",          href: "mailto:ashercode4u@gmail.com" },
  { k: "Resume",   v: "2026 ↗",               href: "/ashishbkalladaresume.pdf",          external: true },
];

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
  const sectionRef = useRef<HTMLElement>(null);
  const emailRef = useMagnetic<HTMLAnchorElement>(0.15);
  const backTopRef = useMagnetic<HTMLButtonElement>(0.3);
  const keralaTime = useKeralaTime();
  useScrollReveal(sectionRef);

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
      ref={sectionRef}
      id="contact"
      className="relative z-10 w-full min-h-screen flex flex-col bg-paper text-ink overflow-hidden"
    >
      {/* Top hairline — red brush */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${ACCENT} 50%, transparent 100%)`,
          opacity: 0.55,
        }}
      />

      {/* ─── Top meta strip ─── */}
      <div className="relative z-10 px-6 md:px-12 pt-8 md:pt-10 flex items-center justify-between font-body text-[10px] uppercase tracking-[0.32em] text-ink/55">
        <p data-reveal="fade">便り · Contact</p>
        <p data-reveal="fade" className="tabular-nums">
          {keralaTime || "—"} IST · Kerala
        </p>
      </div>

      {/* ─── Hero block — eyebrow + headline + email ─── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 max-w-[1500px] mx-auto w-full py-16 md:py-24">
        <p
          data-reveal="fade"
          className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-ink/45 mb-8 md:mb-12 flex items-center gap-3"
        >
          <span
            aria-hidden
            className="inline-block w-6 h-px"
            style={{ backgroundColor: ACCENT }}
          />
          (01) Get in touch
        </p>

        <h2 className="font-headline italic tracking-[-0.03em] leading-[0.88] text-[clamp(3.5rem,11vw,11rem)]">
          {[
            { word: "Let’s", className: "" },
            { word: "talk.", className: "text-ink/55" },
          ].map(({ word, className }, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.14em] align-baseline">
              <span data-reveal="word" className={`inline-block ${className}`}>
                {word}
              </span>
            </span>
          ))}
        </h2>

        {/* Primary email — focal CTA */}
        <div className="mt-10 md:mt-14">
          <p
            data-reveal="fade"
            className="font-body text-[10px] uppercase tracking-[0.32em] text-ink/40 mb-3"
          >
            Drop a line — 仕事
          </p>
          <a
            ref={emailRef}
            href={`mailto:${PRIMARY_EMAIL}`}
            data-cursor="cta"
            className="group inline-flex items-baseline gap-3 md:gap-5 will-change-transform"
          >
            <span className="inline-block overflow-hidden align-baseline">
              <span
                data-reveal="word"
                className="inline-block font-headline tracking-[-0.025em] text-[clamp(1.6rem,5vw,4.5rem)] leading-[1.05] underline decoration-ink/20 underline-offset-[0.22em] decoration-[0.04em] group-hover:decoration-[#ff1a1a] group-hover:text-[#ff1a1a] transition-colors duration-300"
              >
                {PRIMARY_EMAIL}
              </span>
            </span>
            <ArrowUpRight
              className="shrink-0 w-6 h-6 md:w-9 md:h-9 transition-[transform,color] duration-300 group-hover:rotate-[40deg] group-hover:text-[#ff1a1a]"
              strokeWidth={1.4}
            />
          </a>

          <p
            data-reveal="fade"
            className="mt-6 font-body text-xs md:text-sm text-ink/55"
          >
            Or say hi at{" "}
            <a
              href={`mailto:${SECONDARY_EMAIL}`}
              className="text-ink/80 underline decoration-ink/25 underline-offset-2 hover:text-ink hover:decoration-ink transition-colors"
            >
              {SECONDARY_EMAIL}
            </a>
            . Open for collaborations from Q3 2026.
          </p>
        </div>
      </div>

      {/* ─── Socials grid — replaces the awwwards-style stat row ─── */}
      <div className="relative z-10 px-6 md:px-12 max-w-[1500px] mx-auto w-full pb-8 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 border-t border-ink/10 pt-8">
        {SOCIALS.map((s) => (
          <a
            key={s.k}
            href={s.href}
            target={s.external ? "_blank" : undefined}
            rel={s.external ? "noopener noreferrer" : undefined}
            data-reveal="fade"
            className="group flex flex-col gap-2 transition-colors"
          >
            <span className="font-body text-[9px] uppercase tracking-[0.35em] text-ink/40 group-hover:text-ink/70 transition-colors">
              {s.k}
            </span>
            <span className="font-headline italic text-lg md:text-2xl tracking-[-0.01em] leading-none inline-flex items-center gap-2 group-hover:text-[#ff1a1a] transition-colors">
              {s.v}
              <ArrowUpRight
                strokeWidth={1.4}
                className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover:rotate-[40deg]"
              />
            </span>
          </a>
        ))}
      </div>

      {/* ─── Bottom strip — © only ─── */}
      <div className="relative z-10 px-6 md:px-12 pb-4">
        <div className="border-t border-ink/10 pt-4 font-body text-[10px] uppercase tracking-[0.3em] text-ink/55">
          <p data-reveal="fade">© 2026 Ashcode · All rights served</p>
        </div>
      </div>

      {/* ─── Big katakana wordmark — full-bleed at bottom ─── */}
      <div className="relative z-[1] overflow-hidden leading-none">
        <p
          aria-hidden
          data-reveal="mark"
          className="font-headline text-center select-none whitespace-nowrap animate-text-glow will-change-[opacity]"
          style={{
            fontSize: "clamp(3.5rem, 19vw, 16rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.82,
            color: ACCENT,
            textShadow: "0 0 22px rgba(255,26,26,0.45)",
          }}
        >
          アッシュコード
        </p>
      </div>

      {/* Back to top */}
      <button
        ref={backTopRef}
        type="button"
        onClick={scrollTop}
        aria-label="Back to top"
        className="group absolute top-6 right-6 md:top-10 md:right-12 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full border border-ink/25 flex items-center justify-center bg-paper/40 backdrop-blur-sm hover:bg-ink hover:text-paper hover:border-ink transition-colors duration-300 will-change-transform"
      >
        <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
      </button>
    </section>
  );
}
