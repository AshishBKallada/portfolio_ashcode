"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { projects } from "@/app/data/projects";

/** Staggered sizes / offsets — lookbook-style rhythm */
const GALLERY_SLOTS = [
  { wrap: "mt-0 w-[min(72vw,240px)] sm:w-[min(42vw,260px)] md:w-[min(34vw,280px)]", aspect: "aspect-[3/4]" },
  { wrap: "mt-10 w-[min(78vw,260px)] sm:mt-16 sm:w-[min(50vw,300px)] md:w-[min(40vw,320px)]", aspect: "aspect-[3/5]" },
  { wrap: "mt-4 w-[min(85vw,280px)] sm:mt-6 sm:w-[min(55vw,340px)] md:w-[min(44vw,300px)]", aspect: "aspect-[5/4]" },
  { wrap: "mt-14 w-[min(70vw,220px)] sm:mt-20 sm:w-[min(38vw,240px)] md:w-[min(30vw,260px)]", aspect: "aspect-[2/3]" },
  { wrap: "mt-2 w-[min(80vw,260px)] sm:w-[min(48vw,320px)] md:w-[min(38vw,340px)]", aspect: "aspect-[4/3]" },
  { wrap: "mt-12 w-[min(75vw,250px)] sm:mt-14 sm:w-[min(44vw,280px)] md:w-[min(36vw,300px)]", aspect: "aspect-[3/4]" },
  { wrap: "mt-6 w-[min(88vw,270px)] sm:w-[min(52vw,360px)] md:w-[min(42vw,380px)]", aspect: "aspect-[16/10]" },
] as const;

const TIMELINE_MONTHS = ["MARCH", "FEBRUARY", "JANUARY"] as const;
const TICK_COUNT = 72;

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max <= 0 ? 0 : el.scrollLeft / max);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
    return () => {
      el.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress]);

  /** Vertical wheel (and horizontal trackpad) moves the gallery horizontally; avoids vertical scroll in Works. */
  useEffect(() => {
    const section = sectionRef.current;
    const track = scrollRef.current;
    if (!section || !track) return;

    const onWheel = (e: WheelEvent) => {
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;

      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;

      const atStart = track.scrollLeft <= 0.5;
      const atEnd = track.scrollLeft >= max - 0.5;

      if (delta < 0 && atStart) return;
      if (delta > 0 && atEnd) return;

      e.preventDefault();
      track.scrollLeft += delta;
    };

    section.addEventListener("wheel", onWheel, { passive: false });
    return () => section.removeEventListener("wheel", onWheel);
  }, []);

  const displayed = projects.slice(0, GALLERY_SLOTS.length);

  return (
    <section
      ref={sectionRef}
      id="works"
      className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-hidden bg-white text-black"
    >
      {/* Header — reference: left labels / center stack / right widget */}
      <header className="flex shrink-0 flex-col gap-6 px-6 pt-10 pb-6 md:flex-row md:items-start md:justify-between md:gap-4 md:px-10 md:pt-12 lg:px-14">
        <nav
          className="order-2 font-mono text-[10px] uppercase tracking-[0.16em] text-black/55 md:order-1 md:max-w-[8rem] md:pt-1 md:leading-relaxed"
          aria-label="Works sections"
        >
          <span className="font-semibold text-black">Works</span>
          <span className="text-black/35"> · </span>
          <span>Index</span>
          <span className="text-black/35"> · </span>
          <span>Stack</span>
          <span className="text-black/35"> · </span>
          <span>About</span>
        </nav>

        <div className="order-1 text-center md:order-2 md:flex-1 md:text-center">
          <h1 className="font-chaney text-[clamp(1.65rem,4.2vw,2.75rem)] font-bold uppercase leading-[1.02] tracking-[0.02em]">
            Ashcode
            <span className="align-super text-[0.45em]">®</span>
          </h1>
          <p className="mt-1 font-chaney text-[clamp(1.35rem,3.4vw,2.25rem)] font-bold uppercase leading-[1.02] tracking-[0.04em]">
            Selected work
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 md:text-[11px]">
            (AC/S/2026)
          </p>
        </div>

        <div className="order-3 hidden max-w-[11rem] border border-black/15 bg-white px-2.5 py-2 font-mono text-[9px] uppercase leading-snug tracking-[0.08em] text-black/70 sm:block md:pt-1">
          <span className="block text-black/45">Now shipping</span>
          <span className="mt-0.5 block font-semibold text-black">
            MERN · APIs · Interfaces
          </span>
        </div>
      </header>

      {/* Horizontal gallery */}
      <div
        ref={scrollRef}
        className="flex min-h-0 w-full min-w-0 flex-1 snap-x snap-mandatory gap-8 overflow-x-auto overflow-y-hidden overscroll-x-contain px-6 pb-4 pt-2 md:gap-12 md:px-10 md:pb-6 lg:gap-14 lg:px-14 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20"
      >
        {displayed.map((project, i) => {
          const slot = GALLERY_SLOTS[i] ?? GALLERY_SLOTS[GALLERY_SLOTS.length - 1];
          return (
            <article
              key={project.id}
              className={`shrink-0 snap-center first:pl-2 last:pr-6 md:first:pl-4 md:last:pr-10 ${slot.wrap}`}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group block"
              >
                <div
                  className={`relative w-full overflow-hidden bg-black/[0.06] ${slot.aspect}`}
                >
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 72vw, 40vw"
                  />
                </div>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-black/45">
                  {project.fullName.split("(")[0].trim()}
                  <span className="text-black/35"> · </span>
                  <span className="text-black/55">2026</span>
                </p>
              </Link>
            </article>
          );
        })}
      </div>

      {/* Timeline rail — reference: ticks + months + playhead */}
      <div className="shrink-0 border-t border-black/10 px-6 pb-8 pt-5 md:px-10 lg:px-14">
        <div className="relative">
          <div
            className="flex h-6 w-full items-end justify-between gap-px"
            aria-hidden
          >
            {Array.from({ length: TICK_COUNT }).map((_, i) => (
              <span
                key={i}
                className={`w-px shrink-0 bg-black/25 ${
                  i % 6 === 0 ? "h-4" : "h-2"
                }`}
              />
            ))}
          </div>
          <div
            className="pointer-events-none absolute bottom-0 h-8 w-0.5 -translate-x-1/2 bg-black transition-[left] duration-75 ease-out"
            style={{ left: `${scrollProgress * 100}%` }}
            aria-hidden
          />
          <div className="mt-3 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-black/40">
            {TIMELINE_MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
