"use client";

import type { ColorScheme } from "../lib/color-scheme";

/**
 * Evolve-style statement block: column grid, large uppercase type
 * with a vertical fade (canvas + gradient follow site color scheme).
 */
const DEFAULT_LINES = [
  "Everyone writes code,",
  "what is the diff?",
  "I am just not mid,",
  "I do art!",
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
  colorScheme = "light",
}: StatementSectionProps) {
  const text = lines.join("\n");
  const light = colorScheme === "light";

  const gridStyle = light
    ? {
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(255,255,255,0.06) calc(8.333333% - 1px), rgba(255,255,255,0.06) 8.333333%)",
      }
    : {
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(255,255,255,0.034) calc(8.333333% - 1px), rgba(255,255,255,0.034) 8.333333%)",
      };

  return (
    <section
      id={id}
      className={`relative isolate w-full overflow-hidden bg-transparent pb-6 text-left transition-colors duration-300 md:pb-8 ${className}`}
      aria-label="Studio statement"
    >
      <div className="pointer-events-none absolute inset-0 z-0" style={gridStyle} aria-hidden />
      <div
        className={`pointer-events-none absolute inset-0 z-[1] ${light ? "bg-transparent" : "bg-black/[0.3]"}`}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[min(100%,88rem)] px-3 pt-4 md:px-4 md:pt-6 lg:px-6 lg:pt-8">
        <div className="flex w-full max-w-[min(100%,52rem)] flex-col items-start md:max-w-[min(100%,58rem)]">
          <div className="relative w-full overflow-visible pt-7 md:pt-8">
            <p className="w-full whitespace-nowrap font-chaney text-[clamp(2.8rem,13vw,10rem)] font-bold uppercase leading-none tracking-[0.08em] text-white">
              ASH
              <span className="relative inline-block">
                <span className="pointer-events-none absolute bottom-full left-0 z-10 mb-6 whitespace-nowrap font-mono text-[clamp(0.55rem,1.6vw,0.95rem)] font-semibold tracking-[0.12em] text-purple-400">
                  +1000 AURA ?
                </span>
                CODE
              </span>
            </p>
          </div>
          <h2
            className="mt-5 w-full max-w-full bg-clip-text font-chaney text-[clamp(0.95rem,3.2vw,2.4rem)] font-bold uppercase leading-[0.98] tracking-[0.01em] text-transparent md:mt-6 md:leading-[0.96] md:tracking-[0.02em] lg:mt-7 lg:text-[clamp(1.05rem,2.75vw,2.65rem)] bg-gradient-to-b from-white from-[2%] via-white/85 via-[45%] to-white/12 to-[100%]"
            style={{ whiteSpace: "pre-line", WebkitBackgroundClip: "text", backgroundClip: "text" }}
          >
            {text}
          </h2>
        </div>
      </div>
    </section>
  );
}
