"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Project = {
  number: string;
  name: string;
  tag: string;
  year: string;
  impactLabel: string;
  impactValue: string;
  description: string;
  tech: string[];
  image: string;
  alt: string;
  bg: string;
  href: string;
};

const PROJECTS: Project[] = [
  {
    number: "01",
    name: "P2P.org",
    tag: "Brand · Motion",
    year: "2024",
    impactLabel: "TVL surpassed",
    impactValue: "$10B+",
    description:
      "Contributed to brand efforts across social media, motion graphics and client offers during a period when the company crossed ten billion in total value locked.",
    tech: ["After Effects", "Figma", "Lottie"],
    image: "/project1.avif",
    alt: "P2P.org brand design",
    bg: "bg-[#1f3bff]",
    href: "#",
  },
  {
    number: "02",
    name: "Kelp DAO",
    tag: "Brand · Motion",
    year: "2024",
    impactLabel: "Revenue lift",
    impactValue: "$250K+",
    description:
      "Shaped the visual identity and motion language for Kelp's product surface — from launch teaser to docs — a system that scales without losing its voice.",
    tech: ["Figma", "Rive", "Webflow"],
    image: "/project2.avif",
    alt: "Kelp DAO brand",
    bg: "bg-[#0f2a1e]",
    href: "#",
  },
  {
    number: "03",
    name: "Blockwiz",
    tag: "UI / UX",
    year: "2025",
    impactLabel: "Conversion",
    impactValue: "+42%",
    description:
      "Rebuilt the marketing and dashboard surfaces around a clear narrative — intentional motion and copy that earns trust before it asks for it.",
    tech: ["Next.js", "Tailwind", "Framer"],
    image: "/bali.webp",
    alt: "Blockwiz product surface",
    bg: "bg-[#7a4a2a]",
    href: "#",
  },
  {
    number: "04",
    name: "Bitfinity Network",
    tag: "Graphic System",
    year: "2025",
    impactLabel: "Lighthouse",
    impactValue: "98 / 100",
    description:
      "Editorial graphic system — typography, grid and a small library of motifs that survive translation across web, social and print.",
    tech: ["Figma", "Illustrator", "Web"],
    image: "/hero-image.png",
    alt: "Bitfinity Network graphic system",
    bg: "bg-[#111]",
    href: "#",
  },
];

export default function Projects() {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const items = rail.querySelectorAll<HTMLElement>("[data-project-index]");
    if (!items.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        let bestIdx = -1;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = Number(entry.target.getAttribute("data-project-index"));
          }
        });
        if (bestIdx >= 0) setActive(bestIdx);
      },
      { threshold: [0.3, 0.5, 0.7], rootMargin: "-20% 0px -20% 0px" }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="projects"
      className="relative isolate z-10 w-full bg-white text-black"
    >
      <div className="relative grid grid-cols-1 md:grid-cols-12">
        {/* LEFT — sticky index with editorial header + sliding indicator */}
        <aside className="md:col-span-5 lg:col-span-5 border-r border-black/10">
          <div className="md:sticky md:top-0 md:h-screen flex flex-col justify-between px-6 md:px-10 lg:px-14 py-16 md:py-20">
            <div>
              <div className="flex items-baseline justify-between">
                <p className="font-body text-[11px] uppercase tracking-[0.35em] text-black/40">
                  003 — Index
                </p>
                <p className="font-body text-[11px] uppercase tracking-[0.35em] text-black/40">
                  {String(active + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                </p>
              </div>

              <h2 className="mt-6 font-headline italic leading-[0.95] tracking-[-0.02em] text-[clamp(2.25rem,4.5vw,3.75rem)]">
                Selected
                <br />
                <span className="text-black/50">works.</span>
              </h2>
            </div>

            {/* Sliding indicator + list */}
            <div className="relative">
              {/* Sliding accent bar — vertical, moves to active row */}
              <div
                className="absolute left-0 w-[2px] bg-black transition-all duration-500 ease-out"
                style={{
                  top: `calc(${active} * (100% / ${PROJECTS.length}))`,
                  height: `calc(100% / ${PROJECTS.length})`,
                }}
                aria-hidden
              />

              <ul className="flex flex-col">
                {PROJECTS.map((p, i) => {
                  const isActive = i === active;
                  return (
                    <li key={p.number}>
                      <a
                        href={`#project-${p.number}`}
                        className="group flex items-center gap-4 md:gap-6 pl-6 md:pl-8 py-4 md:py-5"
                      >
                        <span
                          className={`font-body text-[10px] tracking-[0.3em] tabular-nums transition-colors ${
                            isActive ? "text-black" : "text-black/30"
                          }`}
                        >
                          {p.number}
                        </span>
                        <span className="flex-1 flex flex-col">
                          <span
                            className={`font-headline transition-all duration-500 ${
                              isActive
                                ? "not-italic text-black text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.1]"
                                : "italic text-black/45 text-[clamp(1.1rem,1.7vw,1.35rem)] leading-[1.1]"
                            }`}
                          >
                            {p.name}
                          </span>
                          <span
                            className={`mt-1 font-body text-[10px] uppercase tracking-[0.22em] transition-colors ${
                              isActive ? "text-black/60" : "text-black/30"
                            }`}
                          >
                            {p.tag} · {p.year}
                          </span>
                        </span>
                        <span
                          className={`font-body text-[10px] transition-all duration-300 ${
                            isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                          }`}
                          aria-hidden
                        >
                          →
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-black/35">
              Scroll right column ↓
            </p>
          </div>
        </aside>

        {/* RIGHT — scrolling project cards */}
        <div ref={railRef} className="md:col-span-7 lg:col-span-7 flex flex-col">
          {PROJECTS.map((p, i) => (
            <article
              key={p.number}
              id={`project-${p.number}`}
              data-project-index={i}
              className="min-h-screen flex flex-col justify-center px-6 md:px-8 lg:px-14 py-20"
            >
              {/* Top eyebrow */}
              <div className="flex items-baseline justify-between mb-5 md:mb-6">
                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-black/40">
                  Case · {p.number}
                </p>
                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-black/40">
                  {p.year}
                </p>
              </div>

              {/* Image card — portrait, thin border, blueprint corners */}
              <div
                className={`relative aspect-[5/4] w-full overflow-hidden rounded-[0.75rem] md:rounded-[1rem] border border-black/10 ${p.bg}`}
              >
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="object-cover mix-blend-screen opacity-90"
                />

                {/* Blueprint corner marks */}
                <Corner className="top-3 left-3" />
                <Corner className="top-3 right-3 rotate-90" />
                <Corner className="bottom-3 right-3 rotate-180" />
                <Corner className="bottom-3 left-3 -rotate-90" />

                {/* Editorial impact — bottom-left, thin lines, no box */}
                <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 text-white">
                  <p className="font-body text-[9px] uppercase tracking-[0.3em] text-white/70">
                    {p.impactLabel}
                  </p>
                  <p className="mt-1 font-headline italic text-2xl md:text-3xl leading-none">
                    {p.impactValue}
                  </p>
                </div>
              </div>

              {/* Title row */}
              <div className="mt-6 md:mt-8 flex items-end justify-between gap-6">
                <h3 className="font-headline italic text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.05] tracking-[-0.01em]">
                  {p.name}
                </h3>
                <a
                  href={p.href}
                  className="group/link shrink-0 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 font-body text-[11px] font-medium tracking-[0.04em] text-white transition hover:bg-black/85"
                >
                  Live
                  <span className="transition-transform group-hover/link:translate-x-0.5">↗</span>
                </a>
              </div>

              {/* Description */}
              <p className="mt-4 max-w-xl font-body text-[14px] md:text-[15px] leading-[1.65] text-black/70">
                {p.description}
              </p>

              {/* Tech chips */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-black/15 px-3 py-1 font-body text-[10px] uppercase tracking-[0.2em] text-black/60"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Next hint — except last */}
              {i < PROJECTS.length - 1 && (
                <div className="mt-12 md:mt-16 flex items-center gap-3 border-t border-black/10 pt-5">
                  <span className="font-body text-[10px] uppercase tracking-[0.3em] text-black/40">
                    Next
                  </span>
                  <span className="font-headline italic text-base text-black/55">
                    {PROJECTS[i + 1].name}
                  </span>
                  <span className="ml-auto font-body text-[10px] text-black/35">↓</span>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Corner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-3 w-3 border-l border-t border-white/40 ${className}`}
    />
  );
}
