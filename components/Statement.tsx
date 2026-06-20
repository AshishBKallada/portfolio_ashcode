"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";

type Segment = { text: string; className?: string };

const SEGMENTS: Segment[] = [
  { text: "I am Ashish Kallada," },
  { text: "a self-taught engineer.", className: "italic" },
  { text: "I build with React, Node, and TypeScript — from the database up." },
];

const BODY_TEXT =
  "Over the last few years, I have shipped production apps with small teams and solo founders — building React frontends, Node and Express APIs, and the databases behind them. The work has spanned consumer products, internal dashboards, and real-time tools used every day.";

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="statement"
      className="relative z-10 bg-paper text-ink px-4 md:px-6 py-16 md:py-24"
      aria-label="Statement"
    >
      <div className="relative bg-surface rounded-2xl md:rounded-[2rem] mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24 text-center overflow-hidden">
        <p
          data-reveal="fade"
          className="relative z-[1] font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-6 text-ink/70"
        >
          Full-stack engineering
        </p>

        <h2 className="relative z-[1] font-headline tracking-[-0.02em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] text-ink">
          {SEGMENTS.flatMap((seg, sIdx) =>
            seg.text.split(" ").map((word, wIdx) => (
              <span key={`${sIdx}-${wIdx}`} className="inline-block overflow-hidden align-baseline mr-[0.18em]">
                <span data-reveal="word" className={`inline-block ${seg.className ?? ""}`}>
                  {word}
                </span>
              </span>
            ))
          )}
        </h2>

        <p
          data-reveal="char"
          className="relative z-[1] font-body text-sm md:text-base leading-relaxed mt-10 md:mt-12 max-w-2xl mx-auto text-ink/85"
        >
          {BODY_TEXT}
        </p>
      </div>
    </section>
  );
}
