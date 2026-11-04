import type { Metadata } from "next";
import { TextReveal } from "@/components/motion/TextReveal";
import Image from "next/image";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { ScrollWords } from "@/components/motion/ScrollWords";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SignalNav } from "@/components/signal/SignalNav";
import { Dot, monoLabel } from "@/components/signal/primitives";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { Button } from "@/components/ui/Button";
import { getProject, projects } from "@/data/projects";

// Only the slugs below exist; anything else is a 404 rather than a render.
export const dynamicParams = false;

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title: project.title,
      description: project.summary,
      images: [{ url: project.image, width: project.imageWidth, height: project.imageHeight }],
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <div className="bg-background text-foreground">
      <SignalNav />
      <article className="px-4 pt-28 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-5xl">
          <AnchorLink href="/#index" className={`${monoLabel} nav-link`}>
            ← Back to the archive
          </AnchorLink>
        </div>

        <header className="mx-auto mt-16 max-w-5xl sm:mt-24">
          <p className={`${monoLabel} flex items-center gap-2 tabular-nums`}>
            <Dot className="bg-ink" />
            {project.year} · {project.tags.join(" · ")}
          </p>
          {/* Span carries the face: the global h1 rule would otherwise win. */}
          <h1 className="mt-5">
            <TextReveal text={project.title} className="block font-headline text-[clamp(4.5rem,14vw,12rem)] leading-[0.88] tracking-[-0.045em]" />
          </h1>
          <p className="mt-6 max-w-xl font-narrative text-[clamp(1.3rem,2vw,1.75rem)] leading-[1.15] tracking-[-0.03em] text-pretty">
            <ScrollWords text={project.summary} />
          </p>
        </header>

        <ParallaxImage
          amount={6}
          style={{ aspectRatio: `${project.imageWidth} / ${project.imageHeight}` }}
          className="mx-auto mt-12 max-w-5xl rounded-[4px] bg-ink"
        >
          <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
            <Image
              src={project.image}
              alt={`${project.title} — cover`}
              width={project.imageWidth}
              height={project.imageHeight}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="block h-full w-full object-cover"
              preload
            />
          </ViewTransition>
        </ParallaxImage>

        <div className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <p className="max-w-[65ch] font-narrative text-[19px] leading-[1.5] tracking-[-0.015em] text-pretty">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-3">
            {project.liveUrl ? (
              <Button href={project.liveUrl} external>
                View live
              </Button>
            ) : null}
            {project.githubUrl ? (
              <Button href={project.githubUrl} external variant="secondary">
                GitHub
              </Button>
            ) : null}
          </div>
        </div>

        {/* Next case: the page hands you on instead of dead-ending. */}
        <Link
          href={`/projects/${next.slug}`}
          className="group mx-auto mt-24 flex max-w-5xl items-end justify-between gap-6 border-t border-ink/20 pt-6"
        >
          <span>
            <span className={`${monoLabel} block`}>
              Next project
            </span>
            <span className="mt-3 block font-headline text-[clamp(3rem,9vw,7.5rem)] leading-[0.88] tracking-[-0.045em] transition-colors group-hover:text-ink/60">
              {next.title}
            </span>
          </span>
          <span
            aria-hidden
            className="mb-2 flex size-12 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-300 group-hover:-rotate-45"
          >
            →
          </span>
        </Link>
      </article>
      <SiteFooter />
    </div>
  );
}
