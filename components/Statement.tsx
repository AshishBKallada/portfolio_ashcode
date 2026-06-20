"use client";

import { useRef, useState } from "react";
import { Hand } from "lucide-react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import SkillsModal from "@/components/SkillsModal";
import {
  STATEMENT_BODY,
  STATEMENT_SEGMENTS,
  STATEMENT_TERMINAL_TITLE,
} from "@/lib/constants";
import { colors, themeClasses } from "@/lib/theme";

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
      className={themeClasses.section.statement}
      aria-label="Statement"
    >
      <div className={themeClasses.terminal.card}>

        {/* Mac terminal title bar */}
        <div className={themeClasses.terminal.titleBar}>
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="w-3 h-3 rounded-full opacity-85"
              style={{ backgroundColor: colors.terminal.close }}
            />
            <span
              aria-hidden
              className="w-3 h-3 rounded-full opacity-85"
              style={{ backgroundColor: colors.terminal.minimize }}
            />
            <span
              aria-hidden
              className="w-3 h-3 rounded-full opacity-85"
              style={{ backgroundColor: colors.terminal.maximize }}
            />
          </div>
          <p className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-ink/45 tabular-nums truncate">
            {STATEMENT_TERMINAL_TITLE}
          </p>
          <span aria-hidden className="w-[54px] shrink-0" />
        </div>

        <div className={themeClasses.terminal.body}>
        <p data-reveal="fade" className={themeClasses.terminal.label}>
          Full-stack engineering
        </p>

        <h2 className={themeClasses.terminal.headline}>
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
              <span data-reveal="tail" className={themeClasses.terminal.link}>
                and more
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

        <p data-reveal="char" className={themeClasses.terminal.bodyText}>
          {STATEMENT_BODY}
        </p>
        </div>
      </div>
    </section>
    </>
  );
}
