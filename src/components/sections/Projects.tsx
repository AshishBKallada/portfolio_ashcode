import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { Parallax } from "@/components/motion/Parallax";
import { ScrollThread } from "@/components/motion/ScrollThread";
import { RevealItem } from "@/components/motion/Reveal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const copy = site.projects;
// Middle tile drifts furthest so the row staggers as it passes.
// sm+: the row bends into a deep concave arc, like the inside of a curved screen.
// The side tiles turn in toward the viewer around their inner edges, so the
// seams stay closed, and straighten when hovered or focused.
const TILE_CURVE = [
  "sm:origin-right sm:[transform:perspective(1100px)_rotateY(24deg)] sm:hover:[transform:perspective(1100px)_rotateY(12deg)] sm:has-[:focus-visible]:[transform:perspective(1100px)_rotateY(12deg)]",
  "",
  "sm:origin-left sm:[transform:perspective(1100px)_rotateY(-24deg)] sm:hover:[transform:perspective(1100px)_rotateY(-12deg)] sm:has-[:focus-visible]:[transform:perspective(1100px)_rotateY(-12deg)]",
];
// Darkens each side tile toward its outer edge, where it curves furthest
// from the light in the middle of the row.
const TILE_SHADE = [
  "sm:bg-[linear-gradient(90deg,rgba(0,0,0,0.35),transparent_60%)]",
  "",
  "sm:bg-[linear-gradient(270deg,rgba(0,0,0,0.35),transparent_60%)]",
];

export function Projects() {
  return (
    <section
      id="projects"
      className="bg-brand relative isolate z-10 overflow-hidden px-4 text-cream pt-24 pb-24 sm:px-5 sm:pt-32 sm:pb-32"
    >
      {/* A flame thread burns its way through the section as it scrolls
          past, weaving over and under the content. Desktop only: on a
          narrow column the curls squash. */}
      <ScrollThread color="var(--color-flame)" className="hidden sm:block" />

      {/* Headline: lead · WORD · WORD · trail */}
      <Parallax speed={50}>
        <SectionReveal>
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

      {/* Three project tiles, edge to edge, bent into a concave arc: the row
          drifts as one, and its outline is cut to a curve so the top edge
          dips toward the middle and the bottom edge rises to meet it. */}
      <Parallax speed={50} className="mx-auto mt-16 max-w-5xl sm:mt-24">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:[mask-image:url(/images/curve-mask-2.svg)] sm:[mask-size:100%_100%] sm:[mask-repeat:no-repeat]">
        {projects.slice(0, 3).map((project, i) => (
          <div key={project.slug}>
            <RevealItem>
              <div className={`transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${TILE_CURVE[i]}`}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group relative block aspect-[5/4] overflow-hidden bg-cream/5 focus-visible:outline-cream"
                >
                  {/* The photo is taller than its frame and drifts against
                      the scroll, so it reads as a window onto a deeper scene. */}
                  <Parallax speed={36} className="absolute inset-x-0 -inset-y-[12%]">
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
                  </Parallax>
                  {TILE_SHADE[i] && (
                    <span aria-hidden className={`pointer-events-none absolute inset-0 transition-opacity duration-700 group-hover:opacity-40 ${TILE_SHADE[i]}`} />
                  )}
                  <span className="absolute top-3 right-3 bg-cream sm:top-[18%] px-1.5 py-0.5 font-sans text-[11px] font-medium text-brand tabular-nums">
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
              </div>
            </RevealItem>
          </div>
        ))}
      </div>
      </Parallax>

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
      </Parallax>
    </section>
  );
}
