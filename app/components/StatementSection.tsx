"use client";

import Image from "next/image";
import type { ColorScheme } from "../lib/color-scheme";

/**
 * Evolve-style statement block: column grid, large uppercase type
 * with a vertical fade (canvas + gradient follow site color scheme).
 */
const DEFAULT_LINES = [
  "STACKS ARE INFRASTRUCTURE.",
  "DESIGN IS THE INTERFACE.",
  "I BRIDGE MERN, APIs, AND",
  "PIXEL-LEVEL DETAIL SO",
  "VISION SHIPS AS MOMENTUM.",
] as const;

type StatementSectionProps = {
  lines?: readonly string[];
  className?: string;
  id?: string;
  colorScheme?: ColorScheme;
};

export default function StatementSection({
  lines = DEFAULT_LINES,
  className = "",
  id = "statement-hero",
  colorScheme = "dark",
}: StatementSectionProps) {
  const text = lines.join("\n");
  const light = colorScheme === "light";

  const gridStyle = light
    ? {
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(0,0,0,0.06) calc(8.333333% - 1px), rgba(0,0,0,0.06) 8.333333%)",
      }
    : {
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(255,255,255,0.055) calc(8.333333% - 1px), rgba(255,255,255,0.055) 8.333333%)",
      };

  return (
    <section
      id={id}
      className={`relative isolate min-h-[145dvh] w-full overflow-hidden bg-transparent text-left transition-colors duration-300 ${className}`}
      aria-label="Studio statement"
    >
      <div className="pointer-events-none absolute inset-0 z-0" style={gridStyle} aria-hidden />

      <div className="pointer-events-none absolute inset-x-0 top-4 z-20 px-3 text-center md:top-6 md:px-4 lg:top-8 lg:px-6">
        <p
          className={`font-chaney text-[clamp(2.8rem,13vw,10rem)] font-bold uppercase leading-none tracking-[0.08em] ${light ? "text-black/85" : "text-white/85"}`}
        >
          ASHCODE
        </p>
        <div className=" mt-2 flex w-full justify-center md:mt-3">
          <Image
            src="/Gemini_Generated_Image_gvpp8fgvpp8fgvpp.png"
            alt="Statement visual"
            width={420}
            height={420}
            className="h-auto w-[min(90vw,90rem)] max-h-[60vh] object-fit"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[145dvh] w-full max-w-[min(100%,88rem)] flex-col items-start justify-end px-3 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[clamp(16rem,36vh,22rem)] md:px-4 md:pb-12 md:pt-[clamp(20rem,42vh,26rem)] lg:px-6">
 
        <h2
          className={`max-w-[min(100%,52rem)] font-chaney text-[clamp(0.95rem,3.2vw,2.4rem)] font-bold uppercase leading-[0.98] tracking-[0.01em] md:max-w-[min(100%,58rem)] md:leading-[0.96] md:tracking-[0.02em] lg:text-[clamp(1.1rem,2.85vw,2.8rem)] ${light ? "statement-fade-text-light" : "statement-fade-text"}`}
          style={{ whiteSpace: "pre-line" }}
        >
          {text}
        </h2>
      </div>
    </section>
  );
}
