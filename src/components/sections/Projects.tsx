import Image from "next/image";
import Link from "next/link";
import { Parallax } from "@/components/motion/Parallax";
import { RevealItem } from "@/components/motion/Reveal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const copy = site.projects;
// Middle tile drifts furthest so the row staggers as it passes.
const TILE_SPEEDS = [30, 80, 50];

export function Projects() {
  return (
    <section
      id="projects"
      style={{ color: site.navbar.bg, backgroundColor: copy.bg }}
      className="relative z-10 overflow-hidden px-4 pt-6 pb-24 sm:px-5 sm:pb-32"
    >
      {/* Meta row: five small labels spread across the top. */}
      <div className="grid grid-cols-2 gap-y-2 font-mono text-[10px] leading-tight uppercase sm:grid-cols-5">
        {copy.meta.map((item, i) => (
          <p
            key={item}
            className={`whitespace-pre-line ${
              i === copy.meta.length - 1 ? "sm:text-right" : ""
            } ${i > 0 && i < copy.meta.length - 1 ? "hidden sm:block" : ""}`}
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

      {/* Three project tiles, edge to edge. */}
      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-1 sm:mt-24 sm:grid-cols-3">
        {projects.slice(0, 3).map((project, i) => (
          <Parallax key={project.slug} speed={TILE_SPEEDS[i]}>
            <RevealItem>
              <Link
                href={`/projects/${project.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-black/5"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 bg-white px-1.5 py-0.5 font-mono text-[10px] text-black">
                  {project.year}
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 font-mono text-[11px] tracking-wide text-white uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {project.title}
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
        <p className="mx-auto mt-4 max-w-xs text-center text-[11px] leading-snug">
          {copy.closingBody}
        </p>
      </Parallax>
    </section>
  );
}
