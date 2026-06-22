"use client";

import { useRef, useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import CursorPreview from "./projects/CursorPreview";
import ProjectRow from "./projects/ProjectRow";
import { PROJECTS, PROJECTS_COPY } from "@/lib/constants/projects";
import { SITE } from "@/lib/constants/site";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative isolate z-10 w-full bg-paper text-ink px-6 md:px-12 lg:px-20 py-24 md:py-36 overflow-hidden"
    >
      <CursorPreview projects={PROJECTS} activeIdx={previewIdx} />

      <div className="relative w-full max-w-[1600px] mx-auto">
        {/* Meta row */}
        <div className="flex items-start justify-between gap-6 mb-12 md:mb-16 font-body text-[10px] uppercase tracking-[0.32em] text-ink/55">
          <p>
            <span className="opacity-60">{PROJECTS_COPY.metaSection}</span>
            <span className="mx-2 opacity-30">/</span>
            {PROJECTS_COPY.metaLabel}
          </p>
          <p className="tabular-nums text-right">
            {String(PROJECTS.length).padStart(2, "0")} {PROJECTS_COPY.metaSuffix}
          </p>
        </div>

        {/* Focal headline */}
        <h2 className="font-headline italic leading-[0.82] tracking-[-0.04em] text-[clamp(3rem,12vw,10rem)] -ml-[0.04em]">
          <span className="inline-block overflow-hidden align-baseline mr-[0.12em]">
            <span data-reveal="word" className="inline-block">{PROJECTS_COPY.headlineLeft}</span>
          </span>
          <span className="inline-block overflow-hidden align-baseline">
            <span data-reveal="word" className="inline-block text-ink/45">{PROJECTS_COPY.headlineRight}</span>
          </span>
        </h2>

        {/* Lede + sidekick */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          <p
            data-reveal="char"
            className="md:col-span-7 lg:col-span-6 font-body text-base md:text-lg leading-relaxed text-ink/85"
          >
            {PROJECTS_COPY.lede}
          </p>
          <div
            data-reveal="fade"
            className="md:col-span-4 md:col-start-9 flex flex-col gap-2 self-end font-body text-[10px] uppercase tracking-[0.32em] text-ink/55 md:text-right"
          >
            <p>{PROJECTS_COPY.hoverHint}</p>
            <p>{PROJECTS_COPY.openHint}</p>
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
            <span className="opacity-60">/&nbsp;</span> {PROJECTS_COPY.archiveAside}
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="group inline-flex items-center gap-2 hover:text-ink transition-colors"
          >
            {PROJECTS_COPY.archiveCta}
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
