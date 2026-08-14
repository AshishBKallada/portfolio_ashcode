"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { RevealItem } from "@/components/motion/Reveal";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
  onHover?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onMove?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onLeave?: () => void;
};

export function ProjectCard({
  project,
  index,
  onHover,
  onMove,
  onLeave,
}: ProjectCardProps) {
  return (
    <RevealItem>
      <Link
        href={`/projects/${project.slug}`}
        className="group relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 border-t border-border py-4 sm:grid-cols-[auto_minmax(0,1.1fr)_minmax(0,1fr)_auto] sm:gap-x-8 sm:py-5"
        onMouseEnter={onHover}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <span className="font-sans text-[11px] font-medium tracking-[0.16em] text-subtle uppercase tabular-nums transition-colors group-hover:text-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="col-start-2 font-sans text-[15px] font-medium tracking-[-0.02em] text-foreground transition-opacity group-hover:opacity-60 sm:col-start-2 sm:text-base">
          {project.title}
        </h3>

        <p className="col-span-2 col-start-1 font-sans text-[13px] tracking-[-0.02em] text-muted sm:col-span-1 sm:col-start-3 sm:text-center">
          {project.tags.join(" · ")}
        </p>

        <span className="col-span-2 col-start-1 font-sans text-[13px] tracking-[-0.02em] text-muted tabular-nums sm:col-span-1 sm:col-start-4 sm:text-right">
          {project.year}
        </span>
      </Link>
    </RevealItem>
  );
}
