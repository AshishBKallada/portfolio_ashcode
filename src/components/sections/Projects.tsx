import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ProjectsCamera } from "@/components/sections/projects/ProjectsCamera";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const copy = site.projects;

export function Projects() {
  return (
    <section
      id="projects"
      style={{ backgroundColor: site.navbar.bg }}
      className="relative z-10 overflow-clip px-4 text-cream sm:px-5"
    >
      {/* One camera move: the headline surfaces from a cloud bank, the
          camera flies through it into the three project tiles, then through
          those onto the closing line. */}
      <ProjectsCamera
        headline={
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
        }
        cards={projects.slice(0, 3).map((project, i) => (
            <Link
            key={project.slug}
              href={`/projects/${project.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden bg-cream/5 focus-visible:outline-cream"
            >
              {/* Named view transition: morphs into the project page cover. */}
              <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  // Starts off-screen inside the camera stage; load it up front
              // so it doesn't pop in mid-pan.
              loading="eager"
              sizes="(min-width: 640px) 33vw, 50vw"
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
        ))}
        closing={
          <div className="text-center">
            <p className="font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.9] whitespace-pre-line uppercase">
              {copy.closing}
            </p>
            <p className="mx-auto mt-5 max-w-sm text-[13px] leading-relaxed text-cream/80">
              {copy.closingBody}
            </p>
          </div>
        }
      />
    </section>
  );
}
