"use client";

import { forwardRef } from "react";
import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { useMagnetic } from "@/lib/useMagnetic";
import UnderlineLink from "./UnderlineLink";

const MagneticEmailButton = forwardRef<
  HTMLAnchorElement,
  { href: string; label: string; value: string }
>(({ href, label, value }, ref) => (
  <a
    ref={ref}
    href={href}
    className="group relative flex items-center gap-3 px-8 py-4 border border-black overflow-hidden transition-colors duration-300 font-headline text-xl will-change-transform"
  >
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
      style={{ backgroundColor: "#3fd75e" }}
    />
    <Mail className="relative z-[1] w-5 h-5 transition-colors group-hover:text-black" />
    <div className="relative z-[1] flex flex-col items-start leading-tight">
      <span className="font-body text-[10px] uppercase tracking-[0.25em] opacity-60 transition-colors group-hover:text-black">
        {label}
      </span>
      <span className="transition-colors group-hover:text-black">{value}</span>
    </div>
    <ArrowUpRight className="relative z-[1] w-4 h-4 transition-transform group-hover:rotate-45 group-hover:text-black" />
  </a>
));
MagneticEmailButton.displayName = "MagneticEmailButton";

export default function Contact() {
  const workRef = useMagnetic<HTMLAnchorElement>(0.22);
  const sayHiRef = useMagnetic<HTMLAnchorElement>(0.22);
  const backTopRef = useMagnetic<HTMLButtonElement>(0.32);

  const scrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      id="contact"
      className="relative z-10 w-full bg-white text-black border-t border-black/10 overflow-hidden"
    >
      {/* Top content */}
      <div className="relative z-10 px-6 md:px-12 pt-20 md:pt-28 pb-12 max-w-3xl">
        <h3 className="font-body text-xs font-bold uppercase tracking-[0.25em] mb-6 opacity-50">
          Connect
        </h3>
        <p className="font-headline text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tighter">
          Got an idea worth <em>shipping?</em>
          <br />
          Let&apos;s talk.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <MagneticEmailButton
            ref={workRef}
            href="mailto:ashercode4u@gmail.com"
            label="work"
            value="ashercode4u@gmail.com"
          />
          <MagneticEmailButton
            ref={sayHiRef}
            href="mailto:ashishbkallada@gmail.com"
            label="say hi"
            value="ashishbkallada@gmail.com"
          />
        </div>
      </div>

      {/* Bottom row — copyright + social links */}
      <div className="relative z-10 px-6 md:px-12 pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <p className="font-body text-xs uppercase tracking-[0.25em] opacity-70">
          2026 © Ashcode — Ashish B Kallada
        </p>
        <div className="flex gap-6 md:gap-8">
          <UnderlineLink
            href="https://github.com/AshishBKallada"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs uppercase tracking-[0.25em] opacity-80 hover:opacity-100 transition-opacity"
          >
            GitHub
          </UnderlineLink>
          <UnderlineLink
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs uppercase tracking-[0.25em] opacity-80 hover:opacity-100 transition-opacity"
          >
            LinkedIn
          </UnderlineLink>
          <UnderlineLink
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs uppercase tracking-[0.25em] opacity-80 hover:opacity-100 transition-opacity"
          >
            X / Twitter
          </UnderlineLink>
        </div>
      </div>

      {/* Oversized faded wordmark — clipped at bottom */}
      <div
        aria-hidden
        className="pointer-events-none select-none relative w-full overflow-hidden"
        style={{ height: "clamp(140px, 26vw, 340px)" }}
      >
        <span
          className="font-body font-bold uppercase absolute left-1/2 -translate-x-1/2 -bottom-[22%] whitespace-nowrap leading-none tracking-tight"
          style={{
            fontSize: "clamp(160px, 34vw, 520px)",
            color: "rgba(0,0,0,0.06)",
          }}
        >
          ashcode
        </span>
      </div>

      {/* Back to top — bottom-right arrow button */}
      <button
        ref={backTopRef}
        type="button"
        onClick={scrollTop}
        aria-label="Back to top"
        className="group absolute bottom-6 right-6 md:bottom-10 md:right-12 z-20 w-14 h-14 md:w-16 md:h-16 rounded-full border border-black/30 flex items-center justify-center bg-white hover:bg-black hover:text-white hover:border-black transition-colors duration-300 will-change-transform"
      >
        <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
      </button>
    </section>
  );
}
