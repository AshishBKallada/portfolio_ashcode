"use client";

import { ArrowUpRight, Mail } from "lucide-react";

export default function Contact() {
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
      {/* Top content — two-column grid */}
      <div className="relative z-10 px-6 md:px-12 pt-20 md:pt-28 pb-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* Left — heading + buttons */}
        <div>
          <h3 className="font-body text-xs font-bold uppercase tracking-[0.25em] mb-6 opacity-50">
            Connect
          </h3>
          <p className="font-headline text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tighter">
            Got an idea worth <em>shipping?</em>
            <br />
            Let&apos;s talk.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:work@ashish.example"
              className="group flex items-center gap-3 px-8 py-4 border border-black hover:bg-black hover:text-white transition-colors duration-300 font-headline text-xl"
            >
              <Mail className="w-5 h-5" />
              <div className="flex flex-col items-start leading-tight">
                <span className="font-body text-[10px] uppercase tracking-[0.25em] opacity-60">
                  work
                </span>
                <span>work@ashish.example</span>
              </div>
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </a>
            <a
              href="mailto:hi@ashish.example"
              className="group flex items-center gap-3 px-8 py-4 border border-black hover:bg-black hover:text-white transition-colors duration-300 font-headline text-xl"
            >
              <Mail className="w-5 h-5" />
              <div className="flex flex-col items-start leading-tight">
                <span className="font-body text-[10px] uppercase tracking-[0.25em] opacity-60">
                  say hi
                </span>
                <span>hi@ashish.example</span>
              </div>
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </a>
          </div>

          <button
            type="button"
            onClick={scrollTop}
            className="mt-16 font-body text-xs uppercase tracking-[0.25em] opacity-70 hover:opacity-100 transition-opacity"
          >
            Back to top
          </button>
        </div>

        {/* Right — info blocks with thin dividers */}
        <div className="md:pl-8 lg:pl-16">
          <InfoRow label="Email Address" value="hi@ashish.example" first />
          <InfoRow label="Location" value="Kerala, India (GMT+5:30)" />
          <InfoRow label="Availability" value="Q3 2026 — Open" />
        </div>
      </div>

      {/* Bottom row — copyright + social links */}
      <div className="relative z-10 px-6 md:px-12 pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <p className="font-body text-xs uppercase tracking-[0.25em] opacity-70">
          2026 © Ashcode — Ashish B Kallada
        </p>
        <div className="flex gap-6 md:gap-8">
          <a
            href="https://github.com/AshishBKallada"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs uppercase tracking-[0.25em] opacity-70 hover:opacity-100 transition-opacity"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs uppercase tracking-[0.25em] opacity-70 hover:opacity-100 transition-opacity"
          >
            LinkedIn
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs uppercase tracking-[0.25em] opacity-70 hover:opacity-100 transition-opacity"
          >
            X / Twitter
          </a>
        </div>
      </div>

      {/* Oversized faded wordmark — clipped at bottom like YKWMI */}
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
    </section>
  );
}

function InfoRow({
  label,
  value,
  first = false,
}: {
  label: string;
  value: string;
  first?: boolean;
}) {
  return (
    <div className={`py-5 ${first ? "border-t" : ""} border-b border-black/10`}>
      <p className="font-body text-[11px] font-bold uppercase tracking-[0.25em] mb-2">
        {label}
      </p>
      <p className="font-body text-sm md:text-base opacity-50">{value}</p>
    </div>
  );
}
