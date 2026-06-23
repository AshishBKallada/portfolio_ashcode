"use client";

import type { Project } from "@/lib/constants/projects";

type Props = {
  project: Project;
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
};

export default function ProjectRow({ project, isHovered, onEnter, onLeave }: Props) {
  return (
    <li data-reveal="line" className="border-b border-section-fg/15">
      <a
        href={project.href}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="group relative flex items-baseline justify-between gap-4 md:gap-12 pl-0 pr-4 md:pr-10 lg:pr-16 py-7 md:py-10"
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute inset-0 bg-section-fg translate-y-full group-hover:translate-y-0 transition-transform duration-[650ms] ease-[cubic-bezier(0.65,0,0.35,1)]" />
        </span>

        <span className="relative z-[1] flex items-baseline gap-3 sm:gap-5 md:gap-9 min-w-0 flex-1">
          <span
            className={`shrink-0 font-body text-[10px] tracking-[0.32em] tabular-nums transition-colors duration-500 ${
              isHovered ? "text-section-bg/55" : "text-section-fg/40"
            }`}
          >
            {project.number}
          </span>
          <span
            className={`min-w-0 whitespace-nowrap [overflow-x:clip] [overflow-y:visible] font-main font-normal not-italic leading-[1.25] tracking-[0.02em] text-[clamp(1.15rem,4.25vw,2.5rem)] transition-[color,transform] duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform ${
              isHovered
                ? "text-section-bg translate-x-3 md:translate-x-6"
                : "text-section-fg"
            }`}
          >
            {project.name}
          </span>
        </span>

        <span className="relative z-[1] flex items-baseline gap-6 md:gap-10 shrink-0">
          <span
            className={`hidden md:inline-block font-body text-[10px] uppercase tracking-[0.28em] transition-colors duration-500 ${
              isHovered ? "text-section-bg/70" : "text-section-fg/55"
            }`}
          >
            {project.tag}
          </span>
          <span
            className={`hidden lg:inline-block font-body text-[10px] uppercase tracking-[0.28em] tabular-nums transition-colors duration-500 ${
              isHovered ? "text-section-bg/70" : "text-section-fg/55"
            }`}
          >
            {project.year}
          </span>
          <span
            aria-hidden
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isHovered
                ? "border-section-bg text-section-bg rotate-45"
                : "border-section-fg/30 text-section-fg/55"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </span>
        </span>
      </a>
    </li>
  );
}
