"use client";

import { useRef, useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import CursorPreview from "./projects/CursorPreview";
import ProjectRow from "./projects/ProjectRow";
import { PROJECTS, PROJECTS_COPY } from "@/lib/constants/projects";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative isolate z-10 w-full section-panel rounded-b-[2rem] md:rounded-b-[2.75rem] lg:rounded-b-[3.25rem] px-6 md:px-12 lg:px-20 py-24 md:py-36 overflow-hidden"
    >
      <CursorPreview projects={PROJECTS} activeIdx={previewIdx} />

      <div className="relative w-full max-w-[1600px] mx-auto">
        {/* Focal headline */}
        <h2 className="section-title -ml-[0.04em]">
          <span data-reveal="fade" className="inline-block align-baseline mr-[0.12em]">
            {PROJECTS_COPY.headlineLeft}
          </span>
          <span data-reveal="fade" className="inline-block align-baseline text-section-fg/45">
            {PROJECTS_COPY.headlineRight}
          </span>
        </h2>

        {/* Lede */}
        <p
          data-reveal="char"
          className="mt-10 md:mt-14 max-w-2xl font-body text-base md:text-lg leading-relaxed text-section-fg/85"
        >
          {PROJECTS_COPY.lede}
        </p>

        {/* Project rows */}
        <ul className="mt-20 md:mt-28 border-t border-section-fg/15">
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
      </div>
    </section>
  );
}
