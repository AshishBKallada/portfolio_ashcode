"use client";

import { useRef, useState } from "react";
import { Hand } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import SkillsModal from "@/components/SkillsModal";
import { colors } from "@/lib/theme/colors";
import {
  STATEMENT_SEGMENTS,
  STATEMENT_BODY,
  STATEMENT_LABELS,
} from "@/lib/constants/statement";

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
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[5px] md:rounded-[8px] border border-ink/15 bg-surface text-ink shadow-[0_24px_60px_-24px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.72)]"
      >

        {/* Mac terminal title bar — title + spacer hide on mobile where they
            collapse to an unreadable truncation. */}
        <div className="relative flex items-center justify-between gap-4 px-4 md:px-5 py-3 border-b border-ink/10 bg-ink/[0.04] dark:bg-ink/[0.06]">
          <div className="flex items-center gap-2">
            <span aria-hidden className="w-3 h-3 rounded-full opacity-85" style={{ backgroundColor: colors.macTraffic.close }} />
            <span aria-hidden className="w-3 h-3 rounded-full opacity-85" style={{ backgroundColor: colors.macTraffic.minimize }} />
            <span aria-hidden className="w-3 h-3 rounded-full opacity-85" style={{ backgroundColor: colors.macTraffic.maximize }} />
          </div>
          <p className="hidden sm:block font-body text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-ink/45 tabular-nums truncate">
            {STATEMENT_LABELS.terminalTitle}
          </p>
          <span aria-hidden className="hidden sm:block w-[54px] shrink-0" />
        </div>

        <div className="relative px-6 md:px-12 py-16 md:py-24 text-center">
        <p
          data-reveal="fade"
          className="relative z-[1] font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-6 text-ink/55"
        >
          {STATEMENT_LABELS.eyebrow}
        </p>

        <h2 className="relative z-[1] font-headline tracking-[-0.02em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] text-ink">
          {STATEMENT_SEGMENTS.flatMap((seg, sIdx) =>
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
                className="inline-block italic text-ink/55 underline decoration-ink/20 underline-offset-[0.18em] decoration-[0.04em] group-hover:text-ink group-hover:decoration-ink/60 transition-colors"
              >
                {STATEMENT_LABELS.more}
              </span>
            </span>
            <span className="inline-block overflow-hidden align-middle">
              <span data-reveal="tail" className="inline-block">
                <Hand
                  aria-hidden
                  strokeWidth={1.4}
                  className="inline-block w-[0.95em] h-[0.95em] animate-point-left text-ink/65 group-hover:text-ink transition-colors"
                />
              </span>
            </span>
          </button>
        </h2>

        <p
          data-reveal="char"
          className="relative z-[1] font-body text-sm md:text-base leading-relaxed mt-10 md:mt-12 max-w-2xl mx-auto text-ink/75"
        >
          {STATEMENT_BODY}
        </p>
        </div>
      </div>
    </section>
    </>
  );
}
