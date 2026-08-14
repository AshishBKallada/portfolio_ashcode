import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getProject, projects } from "@/data/projects";
import { site } from "@/data/site";

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

  return (
    <article className="py-16 sm:py-24">
      <Container>
        <Link
          href="/#work"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Back to work
        </Link>

        <p className="mt-10 text-sm text-muted">{project.year}</p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-sm text-muted">{project.tags.join(" · ")}</p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
          <Image
            src={project.image}
            alt={`${project.title} — cover`}
            width={project.imageWidth}
            height={project.imageHeight}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full"
            priority
          />
        </div>

        <p className="mt-10 max-w-2xl text-lg leading-8 text-muted">
          {project.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
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

        <p className="mt-16 text-sm text-muted">
          A project by {site.name}. Replace this dummy write-up with the real
          case study.
        </p>
      </Container>
    </article>
  );
}
