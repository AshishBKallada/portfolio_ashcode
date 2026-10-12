import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { Parallax } from "@/components/motion/Parallax";
import { RevealItem } from "@/components/motion/Reveal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { buttonOutline } from "@/components/ui/buttonStyles";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const copy = site.projects;
// Middle tile drifts furthest so the row staggers as it passes.
const TILE_SPEEDS = [30, 80, 50];

export function Projects() {
  return (
    <section
      id="projects"
      style={{ backgroundColor: site.navbar.bg }}
      className="relative z-10 overflow-hidden px-4 text-cream pt-6 pb-24 sm:px-5 sm:pb-32"
    >
      {/* Meta row: the chapter label, then four small labels across the top. */}
      <div className="grid grid-cols-2 gap-y-2 border-b border-cream/20 pb-4 font-sans text-[11px] leading-tight font-medium tracking-[0.14em] uppercase sm:grid-cols-5">
        <SectionLabel index={3} className="leading-tight">
          Selected work
        </SectionLabel>
        {copy.meta.slice(1).map((item, i, rest) => (
          <p
            key={item}
            className={`whitespace-pre-line ${
              i === rest.length - 1 ? "text-right" : "hidden sm:block"
            }`}
          >
            {item}
          </p>
        ))}
      </div>

      {/* Headline: lead · WORD · WORD · trail */}
      <Parallax speed={50}>
        <SectionReveal className="mt-16 sm:mt-24">
          <h2 className="flex items-center justify-center gap-[1.5vw]">
            <span className="hidden -translate-y-[0.6em] self-center font-script text-[clamp(1.75rem,4.2vw,4.25rem)] leading-none whitespace-nowrap md:block">
              {copy.lead}
            </span>
            <span className="font-display text-[clamp(4rem,14vw,14rem)] leading-[0.8] uppercase">
              {copy.wordOne}
            </span>
            <span className="font-display text-[clamp(4rem,14vw,14rem)] leading-[0.8] uppercase">
              {copy.wordTwo}
            </span>
            <span className="hidden max-w-[5ch] translate-y-[0.5em] self-center font-script text-[clamp(1.75rem,4.2vw,4.25rem)] leading-[0.9] md:block">
              {copy.trail}
            </span>
          </h2>
        </SectionReveal>
      </Parallax>

      {/* Three project tiles, edge to edge. Hovering or focusing one dims
          and softens its neighbours so the eye lands on it. */}
      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-1 sm:mt-24 sm:grid-cols-3 [@media(hover:hover)]:[&:has(a:hover)_a:not(:hover)]:opacity-45 [@media(hover:hover)]:[&:has(a:hover)_a:not(:hover)]:blur-[2px] [&:has(a:focus-visible)_a:not(:focus-visible)]:opacity-45">
        {projects.slice(0, 3).map((project, i) => (
          <Parallax key={project.slug} speed={TILE_SPEEDS[i]}>
            <RevealItem>
              <Link
                href={`/projects/${project.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-cream/5 transition-[opacity,filter] duration-500 focus-visible:outline-cream"
              >
                {/* Named view transition: morphs into the project page cover. */}
                <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </ViewTransition>
                <span className="absolute top-3 right-3 bg-cream px-1.5 py-0.5 font-sans text-[11px] font-medium text-brand tabular-nums">
                  {project.year}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 pt-16 text-cream transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
                  <span className="min-w-0">
                    <span className="block font-sans text-[11px] font-medium tracking-[0.08em] text-cream/70 uppercase tabular-nums">
                      {String(i + 1).padStart(2, "0")} · {project.tags.join(" · ")}
                    </span>
                    <span className="mt-1 block font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none uppercase">
                      {project.title}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream text-brand transition-transform duration-500 group-hover:rotate-45"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.25">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                </span>
              </Link>
            </RevealItem>
          </Parallax>
        ))}
      </div>

      {/* Closing line. */}
      <Parallax speed={30}>
        <SectionReveal className="mt-16 text-center sm:mt-24">
          <p className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[0.95] whitespace-pre-line uppercase">
            {copy.closing}
          </p>
        </SectionReveal>
        <p className="mx-auto mt-4 max-w-sm text-center text-[13px] leading-relaxed text-cream/80">
          {copy.closingBody}
        </p>
        <div className="mt-8 flex justify-center">
          <AnchorLink href="/#contact" className={buttonOutline}>
            Start a project <span aria-hidden>↗</span>
          </AnchorLink>
        </div>
      </Parallax>
    </section>
  );
}
