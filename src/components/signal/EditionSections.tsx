"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { projects } from "@/data/projects";
import { TextReveal } from "@/components/motion/TextReveal";
import { RevealItem } from "@/components/motion/Reveal";
import { Card, CardGrid, DropCap } from "./Editions";
import { frame } from "./primitives";

/**
 * [01] Work on the plain page cream: the title and lede, then every project
 * as a card. The panel archive (ProjectIndex +
 * ArchiveAccordion) is kept but not shown.
 */
export function EditionWork() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  // The arc over the section's top: full as Work comes up from the bottom of the screen,
  // flattening as it rises, gone once its top reaches the top of the screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const arc = useTransform(scrollYProgress, [0, 1], ["18svh", "0svh"]);

  return (
    // A plain section on the page cream, following the hero: nothing pinned or stacked.
    <section ref={ref} id="index" aria-label="Work" data-nav-theme="light" className="signal-rail-bleed relative bg-background text-ink">
      {/* Over the hero as Work rises: its cream comes up curved outward, a dome on the
          section's top that flattens into a straight edge as it reaches the top. */}
      {!reduce && (
        <motion.svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ height: arc }}
          className="pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] w-full fill-background"
        >
          <path d="M0 100 Q50 -100 100 100 Z" />
        </motion.svg>
      )}
      <div className={`${frame} py-16 md:py-24`}>
        <TextReveal as="h2" text="Work" className="block pb-6 font-headline text-[clamp(4.5rem,13vw,13rem)] leading-[0.88] tracking-[-0.045em]" />
        <RevealItem delay={0.1}>
          <p className="mb-10 max-w-[44rem] text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.02] text-pretty">
            <DropCap scrub>Dashboards, marketing sites and apps, built end to end and made to last.</DropCap>
          </p>
        </RevealItem>
      <CardGrid columns={2}>
        {projects.map((project, i) => (
          <Card
            key={project.slug}
            title={project.title}
            meta={String(project.year)}
            body={project.summary}
            media={{ src: project.image, alt: `${project.title} preview` }}
            delay={i * 0.06}
            actions={[
              { label: "Case study", href: `/projects/${project.slug}` },
              ...(project.liveUrl ? [{ label: "Live", href: project.liveUrl, external: true }] : []),
              ...(project.githubUrl ? [{ label: "Code", href: project.githubUrl, external: true }] : []),
            ]}
          >
            <p className="mb-3 font-narrative text-[15px] tracking-[-0.02em] text-ink/60">{project.tags.join(" · ")}</p>
          </Card>
        ))}
      </CardGrid>
      </div>
    </section>
  );
}
