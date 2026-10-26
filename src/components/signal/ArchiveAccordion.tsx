"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { introEase } from "@/lib/motion";
import { metaLabel, metaText } from "./primitives";

/** The numbers, from full ink to faint: a tonal run, not colours with meanings. */
const NUMBER_TONE = ["text-ink", "text-ink/80", "text-ink/60", "text-ink/45", "text-ink/30"];

/**
 * The archive as a row of tall panels, one open at a time. Closed panels are
 * narrow strips that clip their giant number; the open one shows the project's
 * image, year and scope, name, summary and link. The row pins while scrolling
 * opens each panel in turn (back reverses it); focus or a click opens one too,
 * for the keyboard. Phones: a stacked list, all open, no pin.
 */
export function ArchiveAccordion({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const [wide, setWide] = useState(true);
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (wide) setActive(Math.min(projects.length - 1, Math.floor(p * projects.length)));
  });

  useEffect(() => {
    const q = window.matchMedia("(min-width: 761px)");
    const update = () => setWide(q.matches);
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);

  return (
    // Wide: pinned for 70vh of scroll per project.
    <div ref={track} className="relative mt-14" style={wide ? { height: `calc(100svh + ${projects.length * 70}svh)` } : undefined}>
    <div className="min-[761px]:sticky min-[761px]:top-0 min-[761px]:flex min-[761px]:h-[100svh] min-[761px]:items-center">
    <div className="flex w-full border-y border-border max-[760px]:flex-col min-[761px]:h-[min(84vh,800px)] min-[761px]:min-h-[560px]">
      {projects.map((project, i) => {
        const open = !wide || i === active;
        return (
          <div
            key={project.slug}
            role="group"
            tabIndex={wide ? 0 : -1}
            aria-label={`Project ${i + 1}: ${project.title}`}
            onFocus={wide ? () => setActive(i) : undefined}
            onClick={wide ? () => setActive(i) : undefined}
            style={wide ? { flex: `${open ? 1 : 0} 0 clamp(96px, 11vw, 170px)` } : undefined}
            className={`relative outline-none focus-visible:bg-ink/[0.04] max-[760px]:border-t max-[760px]:border-border max-[760px]:first:border-t-0 min-[761px]:h-full min-[761px]:overflow-hidden min-[761px]:border-r min-[761px]:border-border min-[761px]:transition-[flex-grow] min-[761px]:duration-[900ms] min-[761px]:ease-[cubic-bezier(0.77,0,0.18,1)] min-[761px]:last:border-r-0 ${open ? "" : "cursor-pointer"}`}
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 120 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.1, delay: i * 0.12, ease: introEase }}
              className="flex items-end gap-[clamp(16px,2vw,30px)] max-[760px]:px-4 max-[760px]:py-7 min-[761px]:absolute min-[761px]:bottom-[8vh] min-[761px]:left-[clamp(14px,1.8vw,28px)] min-[761px]:w-max"
            >
              <span
                aria-hidden
                className={`font-display text-[clamp(170px,36vh,380px)] leading-[0.74] tracking-[-0.02em] max-[760px]:text-[150px] ${NUMBER_TONE[i % NUMBER_TONE.length]}`}
              >
                {i + 1}
              </span>
              <div
                aria-hidden={!open}
                className={`relative pb-1 max-[760px]:w-auto min-[761px]:w-[min(400px,30vw)] ${
                  open
                    ? "opacity-100 [filter:none] [transform:none] min-[761px]:[transition:opacity_.7s_.4s,transform_.9s_.35s_cubic-bezier(.2,.8,.2,1),filter_.7s_.4s]"
                    : "min-[761px]:pointer-events-none min-[761px]:-translate-x-6 min-[761px]:opacity-0 min-[761px]:blur-[6px] min-[761px]:[transition:opacity_.4s,transform_.5s,filter_.4s]"
                }`}
              >
                <div className="relative mb-6 aspect-[4/3] w-full max-w-[22rem] overflow-hidden rounded-[4px] shadow-[0_24px_60px_rgba(26,5,5,0.2)] max-[760px]:hidden">
                  <Image src={project.image} alt="" fill sizes="22rem" className="object-cover" />
                </div>
                <p className={`${metaLabel} text-subtle`}>
                  {project.year} · {project.tags.join(" · ")}
                </p>
                <h3 className="mt-3 font-serif text-[clamp(1.75rem,2.6vw,2.6rem)] leading-[1] tracking-[-0.03em]">{project.title}</h3>
                <p className="mt-3 max-w-[22rem] text-[15px] leading-[1.45] text-muted">{project.summary}</p>
                <Link
                  href={`/projects/${project.slug}`}
                  tabIndex={open ? 0 : -1}
                  className={`${metaText} group mt-5 inline-flex items-center gap-3 border-b border-ink pb-1 text-ink`}
                >
                  View project
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
    </div>
    </div>
  );
}
