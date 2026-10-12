import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { Button } from "@/components/ui/Button";
import { getProject, projects } from "@/data/projects";

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <div className="bg-brand text-cream">
      <article className="px-4 pt-8 pb-20 sm:px-5 sm:pb-28">
        <div className="flex items-center justify-between border-b border-cream/20 pb-4">
          <AnchorLink
            href="/#projects"
            className="nav-link font-sans text-[11px] leading-none font-medium tracking-[0.14em] uppercase"
          >
            ← Back to projects
          </AnchorLink>
        </div>

        <header className="mx-auto mt-16 max-w-5xl sm:mt-24">
          <p className="font-sans text-[12px] font-medium tracking-[0.08em] text-cream/70 uppercase tabular-nums">
            {project.year} · {project.tags.join(" · ")}
          </p>
          {/* Span carries the face: the global h1 rule would otherwise win. */}
          <h1 className="mt-5">
            <span className="block font-display text-[clamp(4rem,14vw,12rem)] leading-[0.85] uppercase">
              {project.title}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.25] font-serif">
            {project.summary}
          </p>
        </header>

        <div className="mx-auto mt-12 max-w-5xl overflow-hidden bg-cream/5">
          <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
            <Image
              src={project.image}
              alt={`${project.title} — cover`}
              width={project.imageWidth}
              height={project.imageHeight}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="block h-auto w-full"
              priority
            />
          </ViewTransition>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <p className="max-w-2xl text-[17px] leading-8 text-cream/85">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-3">
            {project.liveUrl ? (
              <Button href={project.liveUrl} external>
                View live ↗
              </Button>
            ) : null}
            {project.githubUrl ? (
              <Button href={project.githubUrl} external variant="secondary">
                GitHub ↗
              </Button>
            ) : null}
          </div>
        </div>

        {/* Next case: the page hands you on instead of dead-ending. */}
        <Link
          href={`/projects/${next.slug}`}
          className="group mx-auto mt-24 flex max-w-5xl items-end justify-between gap-6 border-t border-cream/20 pt-6"
        >
          <span>
            <span className="block font-sans text-[11px] leading-none font-medium tracking-[0.14em] text-cream/70 uppercase">
              Next project
            </span>
            <span className="mt-3 block font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.85] uppercase transition-colors group-hover:text-flame">
              {next.title}
            </span>
          </span>
          <span
            aria-hidden
            className="mb-2 flex size-12 shrink-0 items-center justify-center rounded-full bg-cream text-brand transition-transform duration-300 group-hover:-rotate-45"
          >
            →
          </span>
        </Link>
      </article>
      <SiteFooter />
    </div>
  );
}
