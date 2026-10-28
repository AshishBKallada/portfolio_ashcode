"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { WORK_PAINTING } from "@/lib/hero";
import { frame } from "./primitives";
import { ScrollZoom } from "./ScrollZoom";
import { SwirlClouds } from "./SwirlClouds";

type Row = { title: string; meta: string; date: string; image: string; href: string; external?: boolean };

const linkedinUrl = site.socials.find((s) => s.label === "LinkedIn")?.href ?? "";

/** Projects first, then recent posts: one running index. */
const rows: Row[] = [
  ...projects.map((p) => ({
    title: p.title,
    meta: p.tags.join(" · "),
    date: String(p.year),
    image: p.image,
    href: `/projects/${p.slug}`,
  })),
  ...site.signal.linkedin.posts.map((post) => ({
    title: post.title,
    meta: "LinkedIn",
    date: "Post",
    image: post.src,
    href: linkedinUrl,
    external: true,
  })),
];

const [nameA, nameB] = ["Ash", "Code"];
const N = rows.length;

/*
 * Scroll timeline (0 → 1 over the pinned section):
 *   0    – 0.30  List: the filmstrip drifts up past the rows.
 *   0.30 – 0.62  The rows roll down out of their masks, top first, and each
 *                frame sweeps off to the left on a diagonal, one after another.
 *   0.40 – 0.78  The name grows from the bottom to fill the top.
 *   0.70 – 0.86  The bio fades up under it. Then it holds.
 */
const ROLL = [0.3, 0.46] as const;
const SWEEP = [0.32, 0.58] as const;
const GROW = [0.4, 0.78] as const;
const BIO = [0.7, 0.86] as const;
const STEP = 0.022;

/**
 * Index with a scroll-driven list → about transition. List: numbered titles
 * left, a filmstrip of thumbnails down the middle, tags and dates right, the
 * name along the bottom. Scrolling on, the filmstrip sweeps off diagonally
 * frame by frame, the rows roll away, and the name grows across the top over
 * a short bio. Scrolling back reverses it. Same page background as the site.
 */
export function ListTransition() {
  /** The animated stretch, the whole section: at its end the list lifts away off Studio, pinned beneath (page.tsx). */
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const lenis = useLenis();
  const [hover, setHover] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "about">("list");

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(p, "change", (v) => setView(v > 0.5 ? "about" : "list"));

  const stripY = useTransform(p, [0, ROLL[0]], ["0%", "-18%"]);
  const nameScale = useTransform(p, [...GROW], [0.32, 1]);
  const nameY = useTransform(p, [...GROW], ["58svh", "0svh"]);
  const bioOpacity = useTransform(p, (v) => Math.min(1, Math.max(0, (v - BIO[0]) / (BIO[1] - BIO[0]))));
  const bioY = useTransform(p, [...BIO], [24, 0]);

  // The tabs jump to either end of the pinned stretch.
  const jump = (to: "list" | "about") => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const end = top + el.offsetHeight - window.innerHeight;
    const y = to === "list" ? top : end;
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };

  const about = view === "about";

  return (
    <section
      id="index-list"
      aria-label="Index"
      // The rail's column shows Work's painting behind the panel, so the rail reads cream.
      data-nav-theme="dark"
      className="signal-rail-bleed relative z-[1] h-[320svh] text-ink"
    >
      <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[320svh]" />
      {/* Work's painting and drifting clouds behind the panel, fixed to the viewport and clipped to the
          section, so it lines up with Work's pinned painting (same treatment) as this section rises over it. */}
      {/* Runs a screen past the section, with the panel, while Studio erodes in over them. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -bottom-[100svh] [clip-path:inset(0)]">
        <div className="fixed inset-0 bg-night">
          {/* Zoomed with Work's own pass (ScrollZoom on #index), so the two copies meet without a seam. */}
          <ScrollZoom section="index">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={WORK_PAINTING.src}
              alt=""
              width={WORK_PAINTING.width}
              height={WORK_PAINTING.height}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover select-none"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(21,19,15,0.42)_0%,transparent_22%),linear-gradient(to_top,rgba(21,19,15,0.28)_0%,transparent_30%)]" />
          </ScrollZoom>
          <SwirlClouds />
        </div>
      </div>
      {/* The panel starts at the rail's edge, leaving the rail's column open. */}
      {/* Holds a screen past the section's end (the negative margin), as Studio's painting erodes in over it. */}
      <div className="sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden bg-background md:ml-[var(--nav-sidebar-w)]">
        <div className={`${frame} relative flex h-full flex-col py-8 md:px-10`}>
          {/* Header: label, view switch. */}
          <div className="relative z-20 flex items-start justify-between gap-6">
            <p className="font-headline text-[18px] leading-[1.1] tracking-[-0.02em]">
              Index
              <br />
              <span className="font-narrative text-[16px] tracking-[-0.03em] text-ink/50">{N} entries</span>
            </p>
            <div role="tablist" aria-label="View" className="flex gap-4">
              {(["list", "about"] as const).map((v) => (
                <button
                  key={v}
                  role="tab"
                  type="button"
                  aria-selected={view === v}
                  onClick={() => jump(v)}
                  className={`min-h-8 font-headline text-[15px] tracking-[-0.02em] capitalize transition-colors ${view === v ? "text-ink" : "text-ink/35 hover:text-ink/70"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-10 flex-1">
            {/* List rows, left and right of the filmstrip. */}
            <ol
              aria-hidden={about}
              className="relative z-10 grid grid-cols-[2.5rem_1fr] gap-x-2 gap-y-1 md:grid-cols-[2.5rem_1fr_minmax(6rem,9rem)_1fr_auto] md:gap-x-6"
            >
              {rows.map((row, i) => (
                <li
                  key={row.title}
                  className="contents"
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                >
                  {[
                    <span key="n" className="font-narrative text-ink/50 tabular-nums">{String(i).padStart(2, "0")}</span>,
                    <RowLink key="t" row={row} tabIndex={about ? -1 : 0}>
                      {row.title}
                    </RowLink>,
                    <span key="gap" />,
                    <span key="m" className="block truncate font-narrative text-ink/65">{row.meta}</span>,
                    <span key="d" className="block text-right font-narrative text-ink/65 tabular-nums">{row.date}</span>,
                  ].map((cell, c) => (
                    <span key={c} className={`overflow-hidden py-[3px] ${c >= 2 ? "hidden md:block" : ""}`}>
                      <RollCell p={p} i={i} still={reduce} dim={hover !== null && hover !== i}>
                        {cell}
                      </RollCell>
                    </span>
                  ))}
                </li>
              ))}
            </ol>

            {/* Filmstrip down the middle: drifts, then sweeps off frame by frame. */}
            <motion.div
              aria-hidden
              style={reduce ? undefined : { y: stripY }}
              className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[clamp(6rem,9vw,9rem)] -translate-x-1/2 flex-col gap-2 md:flex"
            >
              {rows.map((row, i) => (
                <Frame key={row.image + i} p={p} i={i} src={row.image} still={reduce} dim={hover !== null && hover !== i} />
              ))}
            </motion.div>

            {/* The bio, under the grown name. */}
            <motion.div
              aria-hidden={!about}
              style={reduce ? { opacity: about ? 1 : 0 } : { opacity: bioOpacity, y: bioY }}
              className="pointer-events-none absolute inset-x-0 top-[clamp(9rem,24vw,21rem)] z-10 mx-auto max-w-[30rem] px-4 font-narrative text-[clamp(1.25rem,1.7vw,1.6rem)] leading-[1.08] tracking-[-0.03em] text-pretty"
            >
              <p>{site.signal.approach.columns[0]}</p>
              <p className="mt-5">{site.signal.approach.columns[1]}</p>
            </motion.div>
          </div>

          {/* The name, set at full size and scaled: small along the bottom, full across the top. */}
          <motion.p
            aria-label={site.name}
            style={reduce ? undefined : { scale: nameScale, y: nameY }}
            className="pointer-events-none absolute inset-x-0 top-20 z-0 flex origin-top items-baseline justify-between px-4 text-[clamp(4rem,15vw,15rem)] leading-[0.8] will-change-transform sm:px-8 md:px-10"
          >
            <span className="font-headline tracking-[-0.05em]">{nameA}</span>
            <span className="font-narrative tracking-[-0.04em]">
              <span className="mr-[-0.06em] font-flourish text-[1.35em] leading-none tracking-normal">{nameB[0]}</span>
              {nameB.slice(1)}
            </span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/** A row's cell rolls down out of its mask, top row first. */
function RollCell({
  p,
  i,
  still,
  dim,
  children,
}: {
  p: MotionValue<number>;
  i: number;
  still: boolean;
  dim: boolean;
  children: React.ReactNode;
}) {
  const y = useTransform(p, [ROLL[0] + i * STEP * 0.5, ROLL[1] + i * STEP * 0.5], ["0%", "160%"]);
  return (
    <motion.span
      style={still ? undefined : { y }}
      className={`block text-[clamp(1rem,1.25vw,1.2rem)] leading-[1.15] tracking-[-0.02em] transition-opacity ${dim ? "opacity-30" : "opacity-100"}`}
    >
      {children}
    </motion.span>
  );
}

/** One filmstrip frame: sweeps off left on a diagonal, each a beat after the last. */
function Frame({ p, i, src, still, dim }: { p: MotionValue<number>; i: number; src: string; still: boolean; dim: boolean }) {
  const range = [SWEEP[0] + i * STEP, SWEEP[1] + i * STEP];
  // Off past the left edge, fanned on a diagonal: lower frames lift, upper ones drop.
  const x = useTransform(p, range, ["0vw", `${-62 - i * 4}vw`]);
  const y = useTransform(p, range, ["0vh", `${(N / 2 - i) * 6}vh`]);
  const rotate = useTransform(p, range, [0, -8]);
  // A function transform: a plain scroll-linked opacity gets handed to the
  // browser's scroll timeline, which ignores this section's offsets.
  const fadeFrom = range[0] + (range[1] - range[0]) * 0.55;
  const opacity = useTransform(p, (v) => 1 - Math.min(1, Math.max(0, (v - fadeFrom) / (range[1] - fadeFrom))));
  return (
    <motion.div
      style={still ? undefined : { x, y, rotate, opacity }}
      className={`relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-ink/5 transition-[filter] duration-300 will-change-transform ${dim ? "[filter:grayscale(1)_opacity(0.4)]" : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
    </motion.div>
  );
}

function RowLink({ row, children, tabIndex }: { row: Row; children: React.ReactNode; tabIndex: number }) {
  const className = "block truncate font-headline tracking-[-0.02em] hover:underline focus-visible:underline";
  return row.external ? (
    <a href={row.href} target="_blank" rel="noopener noreferrer" tabIndex={tabIndex} className={className}>
      {children}
    </a>
  ) : (
    <Link href={row.href} tabIndex={tabIndex} className={className}>
      {children}
    </Link>
  );
}
