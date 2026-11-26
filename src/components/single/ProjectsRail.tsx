"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { Marquee } from "./Marquee";

const github = site.socials.find((s) => s.label === "GitHub")?.href ?? "https://github.com";
const ease = [0.16, 1, 0.3, 1] as const;

// Right edge: the projects running downward. "View all" grows the rail into a full-screen
// panel with every project laid out at once; Close or Escape folds it back into the rail.
export function ProjectsRail() {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    window.setTimeout(() => openRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Captured first, so the rails' own Escape (fold to titles) doesn't fire as well.
        e.stopImmediatePropagation();
        setOpen(false);
        window.setTimeout(() => openRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);

  const layout = reduce ? {} : { layoutId: "projects-panel", transition: { duration: 0.7, ease } };

  return (
    <>
      {!open && (
        <motion.aside {...layout} id="projects" className="sg-rail sg-rail--right" aria-labelledby="projects-title">
          <div className="sg-rail__head">
            <h2 id="projects-title" className="font-headline text-[15px] leading-none tracking-[-0.01em]">
              Projects
            </h2>
            <button
              ref={openRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={false}
              aria-controls="projects-all"
              className="font-headline text-[12px] leading-none text-cream/70 transition-colors hover:text-cream"
            >
              View all ↗
            </button>
          </div>
          <Marquee label="Projects" direction="down" seconds={30}>
            {projects.map((p, i) => (
              <li key={p.slug} className="sg-project" data-preview-kind="project" data-preview-index={i}>
                <a href={p.liveUrl ?? p.githubUrl ?? github} target="_blank" rel="noreferrer" className="group block">
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
        </motion.aside>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="projects-backdrop"
            className="sg-full-backdrop"
            aria-hidden
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            {...layout}
            key="projects-all"
            id="projects-all"
            role="dialog"
            aria-modal="true"
            aria-labelledby="projects-all-title"
            className="sg-full"
            initial={reduce ? { opacity: 0 } : undefined}
            animate={reduce ? { opacity: 1 } : undefined}
            exit={reduce ? { opacity: 0 } : undefined}
          >
            <motion.div
              className="flex h-full flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: reduce ? 0 : 0.35, duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <div className="flex items-baseline justify-between gap-6">
                <h2
                  id="projects-all-title"
                  className="font-headline text-[clamp(40px,5vw,72px)] leading-none tracking-[-0.04em]"
                >
                  Projects
                </h2>
                <div className="flex items-center gap-5">
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className="font-headline text-[14px] text-cream/75 transition-colors hover:text-cream"
                  >
                    GitHub ↗
                  </a>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    className="inline-flex min-h-10 items-center rounded-[4px] bg-cream px-4 font-headline text-[14px] text-ink transition-colors hover:bg-white"
                  >
                    Close
                  </button>
                </div>
              </div>

              <ul className="sg-full__grid">
                {projects.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: reduce ? 0 : 0.4 + i * 0.08, duration: 0.6, ease },
                    }}
                  >
                    <a href={p.liveUrl ?? p.githubUrl ?? github} target="_blank" rel="noreferrer" className="group block">
                      <span className="sg-full__img">
                        <Image
                          src={p.image}
                          alt={`${p.title}: ${p.summary}`}
                          fill
                          sizes="(max-width: 1023px) 100vw, 33vw"
                        />
                      </span>
                      <span className="mt-4 flex items-baseline justify-between gap-3">
                        <span className="font-headline text-[34px] leading-none tracking-[-0.04em]">{p.title}</span>
                        <span className="font-headline text-[13px] text-cream/60 tabular-nums">{p.year}</span>
                      </span>
                      <span className="mt-3 block font-narrative text-[18px] leading-[1.3] text-cream/90">{p.summary}</span>
                      <span className="mt-2 block font-narrative text-[15px] leading-[1.4] text-cream/70">
                        {p.description}
                      </span>
                      <span className="mt-3 block font-headline text-[12px] leading-none text-cream/55">
                        {p.tags.join(" · ")}
                      </span>
                    </a>
                    <span className="mt-4 flex gap-4 font-headline text-[13px]">
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-cream/80 hover:text-cream">
                          Live ↗
                        </a>
                      )}
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-cream/80 hover:text-cream">
                          Code ↗
                        </a>
                      )}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
