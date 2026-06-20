"use client";

import { useRef, useState } from "react";
import { Hand } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import SkillsModal from "@/components/SkillsModal";

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
  const [skillsOpen, setSkillsOpen] = useState(false);
  useScrollReveal(sectionRef);

  return (
    <>
    <SkillsModal open={skillsOpen} onClose={() => setSkillsOpen(false)} />
    <section
      ref={sectionRef}
      id="statement"
      className="relative z-10 bg-transparent text-ink px-4 md:px-6 py-16 md:py-24"
      aria-label="Statement"
    >
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[5px] md:rounded-[8px] border border-[#caa869]/45 -rotate-[0.35deg] shadow-[0_30px_70px_-25px_rgba(80,55,25,0.55),0_10px_22px_-14px_rgba(80,55,25,0.4)]"
        style={{
          backgroundImage: "url('/watercolor-paper-texture_1194-6310.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* Mac terminal title bar */}
        <div className="relative flex items-center justify-between gap-4 px-4 md:px-5 py-3 border-b border-[#5a3e15]/20 bg-[#5a3e15]/[0.05]">
          <div className="flex items-center gap-2">
            <span aria-hidden className="w-3 h-3 rounded-full bg-[#ff5f57] opacity-85" />
            <span aria-hidden className="w-3 h-3 rounded-full bg-[#febc2e] opacity-85" />
            <span aria-hidden className="w-3 h-3 rounded-full bg-[#28c840] opacity-85" />
          </div>
          <p className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#3a2614]/55 tabular-nums truncate">
            ashcode — about · 自己紹介 — zsh
          </p>
          <span aria-hidden className="w-[54px] shrink-0" />
        </div>

        <div className="relative px-6 md:px-12 py-16 md:py-24 text-center">
        <p
          data-reveal="fade"
          className="relative z-[1] font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-6 text-[#3a2614]/75"
        >
          Full-stack engineering
        </p>

        <h2 className="relative z-[1] font-headline tracking-[-0.02em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] text-[#3a2614]">
          {SEGMENTS.flatMap((seg, sIdx) =>
            seg.text.split(" ").map((word, wIdx) => (
              <span key={`${sIdx}-${wIdx}`} className="inline-block overflow-hidden align-baseline mr-[0.18em]">
                <span data-reveal="word" className={`inline-block ${seg.className ?? ""}`}>
                  {word}
                </span>
              </span>
            ))
          )}
          <button
            type="button"
            onClick={() => setSkillsOpen(true)}
            aria-label="Open all skills"
            className="group ml-[0.12em] inline-flex items-baseline gap-[0.15em] align-baseline bg-transparent border-0 p-0 font-[inherit] text-[inherit] cursor-pointer animate-float-y"
          >
            <span className="inline-block overflow-hidden align-baseline">
              <span
                data-reveal="tail"
                className="inline-block italic text-[#3a2614]/60 underline decoration-[#3a2614]/25 underline-offset-[0.18em] decoration-[0.04em] group-hover:text-[#3a2614] group-hover:decoration-[#3a2614] transition-colors"
              >
                and more
              </span>
            </span>
            <span className="inline-block overflow-hidden align-middle">
              <span data-reveal="tail" className="inline-block">
                <Hand
                  aria-hidden
                  strokeWidth={1.4}
                  className="inline-block w-[0.95em] h-[0.95em] animate-point-left text-[#3a2614]/75 group-hover:text-[#3a2614] transition-colors"
                />
              </span>
            </span>
          </button>
        </h2>

        <p
          data-reveal="char"
          className="relative z-[1] font-body text-sm md:text-base leading-relaxed mt-10 md:mt-12 max-w-2xl mx-auto text-[#3a2614]/85"
        >
          {BODY_TEXT}
        </p>
        </div>
      </div>
    </section>
    </>
  );
}
