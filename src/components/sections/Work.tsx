"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { RevealItem } from "@/components/motion/Reveal";
import { Section } from "@/components/layout/Section";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

const PREVIEW_WIDTH = 256;
const CURSOR_OFFSET = 24;

export function Work() {
  const [preview, setPreview] = useState<{
    project: (typeof projects)[number];
    x: number;
    y: number;
  } | null>(null);
  const supportsHover = useRef<boolean | null>(null);

  function canHover() {
    if (supportsHover.current === null) {
      supportsHover.current =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover)").matches;
    }
    return supportsHover.current;
  }

  function place(clientX: number, clientY: number) {
    const x =
      clientX + CURSOR_OFFSET + PREVIEW_WIDTH > window.innerWidth
        ? clientX - PREVIEW_WIDTH - CURSOR_OFFSET
        : clientX + CURSOR_OFFSET;
    return { x, y: clientY - 96 };
  }

  return (
    <Section id="work" className="pt-16 pb-20 sm:pt-20 sm:pb-24">
      <RevealItem className="mb-16 ml-auto max-w-xl sm:mb-20 lg:max-w-2xl lg:w-[52%]">
        <SectionEyebrow number="02" label={site.work.eyebrow} />
        <h2 className="mt-4 font-sans text-3xl leading-[1.2] font-medium tracking-tight text-foreground sm:text-4xl lg:text-[2.85rem]">
          {site.work.headlineBefore}{" "}
          <em className="font-serif font-extralight italic">
            {site.work.headlineItalic}
          </em>
          {site.work.headlineAfter}
        </h2>
      </RevealItem>

      <div className="border-b border-border">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={index}
            onHover={(event) => {
              if (!canHover()) return;
              setPreview({ project, ...place(event.clientX, event.clientY) });
            }}
            onMove={(event) => {
              if (!canHover()) return;
              setPreview((current) =>
                current
                  ? { ...current, ...place(event.clientX, event.clientY) }
                  : current,
              );
            }}
            onLeave={() => setPreview(null)}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed z-40 hidden w-64 overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition-opacity duration-200 md:block ${
          preview ? "opacity-100" : "opacity-0"
        }`}
        style={preview ? { left: preview.x, top: preview.y } : undefined}
      >
        {preview ? (
          <Image
            src={preview.project.image}
            alt=""
            width={preview.project.imageWidth}
            height={preview.project.imageHeight}
            className="h-auto w-full"
          />
        ) : null}
      </div>
    </Section>
  );
}
