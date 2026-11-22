"use client";

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { projects } from "@/data/projects";
import { TextReveal } from "@/components/motion/TextReveal";
import { RevealItem } from "@/components/motion/Reveal";
import {
  useInTrack,
  useSectionProgress,
} from "@/components/motion/HorizontalTrack";
import { Card, CardGrid, DropCap } from "./Editions";
import { frame } from "./primitives";

const title =
  "block pb-6 font-headline text-[clamp(4.5rem,13vw,13rem)] leading-[0.88] tracking-[-0.045em]";
const lede =
  "Dashboards, marketing sites and apps, built end to end and made to last.";

function ProjectCard({
  project,
  i,
}: {
  project: (typeof projects)[number];
  i: number;
}) {
  return (
    <Card
      title={project.title}
      meta={String(project.year)}
      body={project.summary}
      media={{ src: project.image, alt: `${project.title} preview` }}
      delay={i * 0.06}
      actions={[
        { label: "Case study", href: `/projects/${project.slug}` },
        ...(project.liveUrl
          ? [{ label: "Live", href: project.liveUrl, external: true }]
          : []),
        ...(project.githubUrl
          ? [{ label: "Code", href: project.githubUrl, external: true }]
          : []),
      ]}
    >
      <p className="mb-3 font-narrative text-[15px] tracking-[-0.02em] text-ink/60">
        {project.tags.join(" · ")}
      </p>
    </Card>
  );
}

/**
 * [01] Work on the plain page cream: the title and lede, then every project as a card.
 * Down the page (phones) the cards sit in a grid under a dome that flattens as Work rises;
 * on the sideways row they run in a strip under the title and lede (no curve: on the all-red page it
 * would only hide the hero's edge). The panel archive (ProjectIndex + ArchiveAccordion)
 * is kept but not shown.
 */
export function EditionWork() {
  // Sideways: the collage spread. Down the page: the title, lede and card grid.
  return useInTrack() ? <WorkCollage /> : <WorkGrid />;
}

function WorkGrid() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  // The dome over Work's top: full as it comes up from the bottom of the screen,
  // flattening as it rises, gone once its top reaches the top of the screen.
  const progress = useSectionProgress(ref, ["start end", "start start"]);
  const arc = useTransform(progress, [0, 1], ["18svh", "0svh"]);

  return (
    // A plain section on the page cream, following the hero: nothing pinned or stacked.
    <section
      ref={ref}
      id="index"
      aria-label="Work"
      data-nav-theme="light"
      className="signal-rail-bleed relative bg-background text-ink"
    >
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
        <TextReveal as="h2" text="Work" className={title} />
        <RevealItem delay={0.1}>
          <p className="mb-10 max-w-[44rem] text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.02] text-pretty">
            <DropCap scrub>{lede}</DropCap>
          </p>
        </RevealItem>
        <CardGrid columns={2}>
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} i={i} />
          ))}
        </CardGrid>
      </div>
    </section>
  );
}

type Project = (typeof projects)[number];
const mincho =
  "[font-family:'Hiragino_Mincho_ProN','Yu_Mincho','Noto_Serif_JP',serif]";

/** A picture in the collage: wipes open from one side as Work comes in, then drifts at its own pace. */
function CollagePicture({
  project,
  progress,
  enter,
  drift,
  from = "left",
  className,
  children,
}: {
  project: Project;
  progress: MotionValue<number>;
  /** Where in Work's entry (0–1) this picture opens. */
  enter: number;
  /** Sideways drift across the pass, in vw (+ lags, − runs ahead). */
  drift: number;
  from?: "left" | "right" | "top" | "bottom";
  className: string;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion() ?? false;
  const open = useTransform(progress, [enter, enter + 0.28], [100, 0], {
    clamp: true,
  });
  const clipPath = useTransform(open, (v) =>
    from === "left"
      ? `inset(0 ${v}% 0 0)`
      : from === "right"
        ? `inset(0 0 0 ${v}%)`
        : from === "top"
          ? `inset(0 0 ${v}% 0)`
          : `inset(${v}% 0 0 0)`,
  );
  const x = useTransform(progress, [0, 1], [`${drift}vw`, `${-drift}vw`]);
  const scale = useTransform(open, [100, 0], [1.25, 1]);
  return (
    <motion.figure
      style={reduce ? undefined : { clipPath, x }}
      className={`absolute overflow-hidden bg-[#140606] ${className}`}
    >
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`${project.title}, case study`}
        className="group absolute inset-0 block"
      >
        <motion.img
          src={project.image}
          alt={`${project.title} preview`}
          draggable={false}
          style={reduce ? undefined : { scale }}
          className="h-full w-full object-cover transition-[filter] duration-500 group-hover:brightness-110"
        />
      </Link>
      {children}
    </motion.figure>
  );
}

/** A tag chip with a clipped corner, light on the red. */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-white/85 px-2 py-[0.2em] font-headline text-[11px] tracking-[-0.01em] text-[#7a1410] [clip-path:polygon(0_0,100%_0,calc(100%-6px)_100%,0_100%)]">
      #{children}
    </span>
  );
}

/**
 * Work on the sideways row, laid out as an editorial spread: SELECTED in outline and WORK
 * solid run up the left edge; a Japanese heading and the lede at the top; the lead project
 * large and dark in the middle with its notes set over it; the others overlapping around it;
 * the tags along the foot. Each picture wipes open as Work arrives and drifts at its own pace.
 */
function WorkCollage() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  // Arrival: from Work's left edge entering on the right to it reaching the left.
  const enter = useSectionProgress(ref, ["start end", "start start"]);
  // The whole pass, for drift.
  const pass = useSectionProgress(ref, ["start end", "end start"]);
  const titleY = useTransform(pass, [0, 1], ["8vh", "-8vh"]);
  const outlineY = useTransform(pass, [0, 1], ["-6vh", "6vh"]);
  const textOpacity = useTransform(enter, [0.35, 0.7], [0, 1]);
  const textX = useTransform(enter, [0.35, 0.7], ["4vw", "0vw"]);
  const [lead, second, third] = projects;
  const stack = Array.from(new Set(projects.flatMap((p) => p.tags)));
  const years = Array.from(new Set(projects.map((p) => p.year))).sort();

  return (
    <section
      ref={ref}
      id="index"
      data-cut="Work"
      aria-label="Work"
      data-nav-theme="light"
      className="relative h-full w-[152vw] shrink-0 overflow-hidden bg-background text-white"
    >
      {/* SELECTED, outlined and tall; WORK solid beside it, reading bottom to top. */}
      <motion.p
        aria-hidden
        style={reduce ? undefined : { y: outlineY }}
        className="absolute top-[12vh] left-[11vw] z-0 font-display text-[min(14vh,9vw)] leading-[0.8] text-transparent uppercase [-webkit-text-stroke:1.5px_rgba(255,255,255,0.75)] [writing-mode:vertical-rl] rotate-180 select-none"
      >
        Selected
      </motion.p>
      <motion.h2
        style={reduce ? undefined : { y: titleY }}
        className="absolute bottom-[12vh] left-[4.5vw] z-10 font-display text-[min(14vh,9vw)] leading-[0.8] uppercase [writing-mode:vertical-rl] rotate-180 select-none"
      >
        Work
      </motion.h2>

      {/* The heading and the lede, beside the title. */}
      <motion.div
        style={reduce ? undefined : { opacity: textOpacity, x: textX }}
        className="absolute top-[18vh] left-[24vw] z-20 w-[24vw]"
      >
        <p
          className={`${mincho} text-[min(3.4vw,6vh)] leading-[1.15] font-semibold`}
        >
          選ばれた
          <br />
          作品たち
        </p>
        <span
          aria-hidden
          className="mt-[2.4vh] mb-[2vh] block h-px w-[5vw] bg-white/60"
        />
        <p className="max-w-[26rem] font-narrative text-[clamp(0.85rem,1vw,1rem)] leading-[1.7] text-white/85">
          {lede} Every one is built by hand: the interface, the motion and the
          code behind it, from the first sketch to the last deploy.
        </p>
      </motion.div>

      {/* The second project, past the lead, high. */}
      {second ? (
        <CollagePicture
          project={second}
          progress={enter}
          enter={0.15}
          drift={1.5}
          from="right"
          className="top-[14vh] left-[104vw] z-20 h-[30vh] w-[24vw]"
        >
          <figcaption className="pointer-events-none absolute right-0 bottom-0 bg-[#140606]/80 px-3 py-1.5 font-headline text-[12px] tracking-[-0.01em]">
            {second.title} · {second.year}
          </figcaption>
        </CollagePicture>
      ) : null}

      {/* The lead project, large and dark, on its own past the lede, its notes set over its foot. */}
      {lead ? (
        <CollagePicture
          project={lead}
          progress={enter}
          enter={0.05}
          drift={-1}
          from="bottom"
          className="top-[20vh] left-[54vw] z-10 h-[58vh] w-[42vw]"
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-b from-transparent via-[#140606]/80 to-[#140606]" />
          <div className="absolute inset-x-0 bottom-0 flex max-w-[30rem] flex-col gap-3 p-[2.4vw]">
            <span aria-hidden className="block h-px w-[4vw] bg-white/40" />
            <p className="font-headline text-[clamp(1.1rem,1.6vw,1.6rem)] tracking-[-0.03em]">
              {lead.title} <span className="text-white/50">{lead.year}</span>
            </p>
            <p className="font-narrative text-[clamp(0.85rem,1vw,1rem)] leading-[1.7] text-white/85">
              {lead.summary}
            </p>
            <p className="font-narrative text-[13px] text-white/55">
              {lead.tags.join(" · ")}
            </p>
            <div className="pointer-events-auto mt-1 flex flex-wrap gap-2">
              <Link
                href={`/projects/${lead.slug}`}
                className="rounded-full bg-white px-4 py-1.5 font-headline text-[13px] text-[#140606] transition-colors hover:bg-white/85"
              >
                Case study →
              </Link>
              {lead.liveUrl ? (
                <a
                  href={lead.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/40 px-4 py-1.5 font-headline text-[13px] transition-colors hover:border-white"
                >
                  Live ↗
                </a>
              ) : null}
            </div>
          </div>
        </CollagePicture>
      ) : null}

      {/* The third project, under the second, with a clear gap between. */}
      {third ? (
        <CollagePicture
          project={third}
          progress={enter}
          enter={0.3}
          drift={2}
          from="left"
          className="top-[54vh] left-[110vw] z-20 h-[28vh] w-[22vw]"
        >
          <figcaption className="pointer-events-none absolute top-0 left-0 bg-[#140606]/80 px-3 py-1.5 font-headline text-[12px] tracking-[-0.01em]">
            {third.title} · {third.year}
          </figcaption>
        </CollagePicture>
      ) : null}

      {/* Far right: the count, in outline, and the way to every project. */}
      <motion.div
        style={reduce ? undefined : { opacity: textOpacity }}
        className="absolute top-[40vh] left-[138vw] z-20 flex flex-col gap-3"
      >
        <span className="font-display text-[min(22vh,14vw)] leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.8)]">
          {String(projects.length).padStart(2, "0")}
        </span>
        <span className="font-headline text-[13px] tracking-[-0.01em] text-white/70">
          projects, {years[0]}–{years[years.length - 1]}
        </span>
      </motion.div>

      {/* The tags low under the lede, left of the lead. */}
      <motion.dl
        style={reduce ? undefined : { opacity: textOpacity }}
        className="absolute bottom-[12vh] left-[24vw] z-20 grid max-w-[26vw] grid-cols-[auto_1fr] items-center gap-x-5 gap-y-1.5 font-headline text-[12px] text-white/90"
      >
        <dt>◆ Projects</dt>
        <dd className="flex flex-wrap gap-1.5">
          {projects.map((p) => (
            <Chip key={p.slug}>{p.title}</Chip>
          ))}
        </dd>
        <dt>◆ Stack</dt>
        <dd className="flex flex-wrap gap-1.5">
          {stack.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </dd>
      </motion.dl>
    </section>
  );
}
