import Image from "next/image";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { Marquee } from "./Marquee";

const github = site.socials.find((s) => s.label === "GitHub")?.href ?? "https://github.com";

// Right edge: the projects running downward, name, year, one line and the stack.
export function ProjectsRail() {
  return (
    <aside id="projects" className="sg-rail sg-rail--right" aria-labelledby="projects-title">
      <div className="sg-rail__head">
        <h2 id="projects-title" className="font-headline text-[15px] leading-none tracking-[-0.01em]">
          Projects
        </h2>
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          className="font-headline text-[12px] leading-none text-cream/70 transition-colors hover:text-cream"
        >
          GitHub ↗
        </a>
      </div>
      <Marquee label="Projects" direction="down" seconds={30}>
        {projects.map((p) => (
          <li key={p.slug} className="sg-project">
            <a
              href={p.liveUrl ?? p.githubUrl ?? github}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <span className="sg-project__img">
                <Image src={p.image} alt={`${p.title}: ${p.summary}`} fill sizes="270px" />
              </span>
              <span className="mt-3 flex items-baseline justify-between gap-3">
                <span className="font-headline text-[26px] leading-none tracking-[-0.03em] transition-transform duration-300 group-hover:translate-x-1">
                  {p.title}
                </span>
                <span className="font-headline text-[12px] text-cream/60 tabular-nums">{p.year}</span>
              </span>
              <span className="mt-2 block font-narrative text-[15px] leading-[1.3] text-cream/85">{p.summary}</span>
              <span className="mt-2 block font-headline text-[11px] leading-none text-cream/55">{p.tags.join(" · ")}</span>
            </a>
          </li>
        ))}
      </Marquee>
    </aside>
  );
}
