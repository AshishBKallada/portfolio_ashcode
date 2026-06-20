"use client";

import { useRef, useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import CursorPreview from "./projects/CursorPreview";
import ProjectRow from "./projects/ProjectRow";
import { LEDE_TEXT, PROJECTS } from "./projects/data";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative isolate z-10 w-full bg-transparent text-ink px-6 md:px-12 lg:px-20 py-24 md:py-36 overflow-hidden"
    >
      <CursorPreview projects={PROJECTS} activeIdx={previewIdx} />

      <div className="relative w-full max-w-[1600px] mx-auto">
        {/* Meta row */}
        <div className="flex items-start justify-between gap-6 mb-12 md:mb-16 font-body text-[10px] uppercase tracking-[0.32em] text-ink/55">
          <p>
            <span className="opacity-60">(03)</span>
            <span className="mx-2 opacity-30">/</span>
            Selected Works · 制作実績
          </p>
          <p className="tabular-nums text-right">
            {String(PROJECTS.length).padStart(2, "0")} Projects · 2024–25
          </p>
        </div>

        {/* Focal headline */}
        <h2 className="font-headline italic leading-[0.82] tracking-[-0.04em] text-[clamp(3rem,12vw,10rem)] -ml-[0.04em]">
          <span className="inline-block overflow-hidden align-baseline mr-[0.12em]">
            <span data-reveal="word" className="inline-block">Selected</span>
          </span>
          <span className="inline-block overflow-hidden align-baseline">
            <span data-reveal="word" className="inline-block text-ink/45">works.</span>
          </span>
        </h2>

        {/* Lede + sidekick */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          <p
            data-reveal="char"
            className="md:col-span-7 lg:col-span-6 font-body text-base md:text-lg leading-relaxed text-ink/85"
          >
            {LEDE_TEXT}
          </p>
          <div
            data-reveal="fade"
            className="md:col-span-4 md:col-start-9 flex flex-col gap-2 self-end font-body text-[10px] uppercase tracking-[0.32em] text-ink/55 md:text-right"
          >
            <p>Hover · cursor reveals preview</p>
            <p>↗ Open for the case study</p>
          </div>
        </div>

        {/* Project rows */}
        <ul className="mt-20 md:mt-28 border-t border-ink/15">
          {PROJECTS.map((p, i) => (
            <ProjectRow
              key={p.number}
              project={p}
              isHovered={previewIdx === i}
              onEnter={() => setPreviewIdx(i)}
              onLeave={() => setPreviewIdx(null)}
            />
          ))}
        </ul>

        {/* Coda */}
        <div className="mt-10 md:mt-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-body text-[10px] uppercase tracking-[0.32em] text-ink/55">
          <p>
            <span className="opacity-60">/&nbsp;</span> More in the case-study
            archive · drop a line for the rest
          </p>
          <a
            href="mailto:ashercode4u@gmail.com"
            className="group inline-flex items-center gap-2 hover:text-ink transition-colors"
          >
            Request full archive
            <span
              aria-hidden
              className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-current/40 transition-transform duration-300 group-hover:rotate-45"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
