"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { ColorScheme } from "../lib/color-scheme";
import { mainScrollScroller, prefersReducedMotion } from "../lib/main-scroller";

gsap.registerPlugin(ScrollTrigger);

const glassPill =
  "inline-flex items-center rounded-full border border-white/35 bg-white/15 px-4 py-2 font-safiro text-[11px] font-medium tracking-[0.04em] text-white backdrop-blur-md transition hover:bg-white/25 md:px-5 md:py-2.5 md:text-xs";

type PanelImage = {
  kind: "image";
  src: string;
  fallback?: string;
  alt: string;
  logo?: boolean;
  pills?: { href: string; label: string }[];
  title: string;
  body: string;
};

type PanelGradient = {
  kind: "gradient";
  gradient: string;
  pills?: { href: string; label: string }[];
  title: string;
  body: string;
  quote?: string;
};

type Panel = PanelImage | PanelGradient;

const PANELS: Panel[] = [
  {
    kind: "image",
    src: "/projects/latest.png",
    fallback: "/project1.avif",
    alt: "Featured project",
    logo: true,
    pills: [
      { href: "/#skills", label: "Skills" },
      { href: "/projects", label: "Work" },
    ],
    title: "Get your stack off your mind.",
    body: "Ashcode ships MERN products where the UI and the API share the same intent—clear hierarchy, confident motion, and detail you notice when you scroll slowly.",
  },
  {
    kind: "gradient",
    gradient: "from-[#9aab7a] via-[#5f7d52] to-[#2a4530]",
    pills: [{ href: "/projects", label: "See all projects" }],
    quote:
      "Full-stack builds with editorial type, sticky sections, and interfaces that feel finished—not like a template with new colors.",
    title: "More intentional than most demos.",
    body: "Commerce flows, dashboards, and small products with outsized ambition—shaped around real constraints like auth, performance, and the micro-interactions that stick.",
  },
  {
    kind: "image",
    src: "/project2.avif",
    alt: "Management system project",
    pills: [{ href: "/projects/management-system", label: "View project" }],
    title: "Systems that stay calm under load.",
    body: "Dashboards and admin tools with clear data hierarchy, fast queries, and UI states that never leave operators guessing.",
  },
  {
    kind: "gradient",
    gradient: "from-[#8b7355] via-[#5c4a3a] to-[#2f241c]",
    pills: [{ href: "/projects/ecommerce-platform", label: "E-commerce" }],
    quote: "Storefront, cart, and fulfillment logic treated as one surface—not three repos pretending to be a product.",
    title: "Commerce without the clutter.",
    body: "Checkout flows, inventory, and auth wired together so the experience feels editorial, not like a theme with a logo swap.",
  },
];

type ProjectShowcaseProps = {
  className?: string;
  id?: string;
  colorScheme?: ColorScheme;
};

function ShowcasePanel({
  panel,
  isFirstInRow = false,
}: {
  panel: Panel;
  isFirstInRow?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(panel.kind === "image" ? panel.src : "");

  return (
    <article
      className={`relative h-full min-h-0 overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem] ${
        isFirstInRow ? "rounded-br-none md:rounded-br-none" : ""
      } ${panel.kind === "gradient" ? `bg-gradient-to-b ${panel.gradient}` : ""}`}
    >
      {panel.kind === "image" ? (
        <>
          <Image
            src={imgSrc}
            alt={panel.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => {
              if (panel.fallback) setImgSrc(panel.fallback);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" aria-hidden />
        </>
      ) : (
        <div
          className="pointer-events-none absolute left-1/2 top-[38%] z-0 w-[min(88%,20rem)] -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border border-white/10 bg-white/[0.07] px-5 py-6 backdrop-blur-[2px] md:top-[40%]"
          aria-hidden
        >
          {panel.quote ? (
            <p className="font-safiro text-[14px] leading-[1.45] text-white/25 md:text-[15px]">
              {panel.quote}
            </p>
          ) : null}
        </div>
      )}

      <header className="absolute left-0 right-0 top-0 z-10 flex items-start justify-between gap-2 p-4 md:p-5">
        {panel.kind === "image" && panel.logo ? (
          <span className="inline-flex items-center rounded-full border border-dashed border-white/55 bg-black/10 px-3.5 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm md:text-[10px]">
            ashcode
          </span>
        ) : (
          <span aria-hidden className="w-px shrink-0" />
        )}
        {panel.pills?.length ? (
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {panel.pills.map((pill) => (
              <Link
                key={pill.href}
                href={pill.href}
                className={`${glassPill} ${panel.kind === "gradient" ? "border-white/40 bg-white/20" : ""}`}
              >
                {pill.label}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <div className="absolute bottom-0 left-0 z-10 max-w-[min(100%,26rem)] p-4 md:max-w-md md:p-5 lg:max-w-lg">
        <h2 className="font-safiro text-[clamp(1.35rem,3.5vw,2.25rem)] font-medium leading-[1.08] tracking-[-0.02em] text-white">
          {panel.title}
        </h2>
        <p className="mt-2.5 font-safiro text-[12px] leading-[1.55] text-white/88 md:mt-3 md:text-[13px]">
          {panel.body}
        </p>
      </div>
    </article>
  );
}

export default function ProjectShowcase({
  className = "",
  id = "project",
  colorScheme: _colorScheme = "light",
}: ProjectShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid || prefersReducedMotion()) return;

    const scroller = mainScrollScroller();
    const sc = scroller ? { scroller } : {};

    const ctx = gsap.context(() => {
      gsap.fromTo(
        grid,
        { y: 48, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none reverse",
            ...sc,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative isolate w-full overflow-hidden bg-white py-0 text-black ${className}`}
      aria-label="Featured projects"
    >
      <div className="relative z-10 flex w-full flex-col gap-2 px-1 sm:px-1.5 md:gap-2.5 md:px-2">
        <div ref={gridRef} className="flex flex-col gap-2 md:gap-2.5">
          {[0, 2].map((rowStart) => (
            <div
              key={rowStart}
              className="grid min-h-[100dvh] grid-cols-1 grid-rows-2 gap-1.5 md:grid-cols-2 md:grid-rows-1 md:gap-2"
            >
              {PANELS.slice(rowStart, rowStart + 2).map((panel, i) => (
                <ShowcasePanel key={rowStart + i} panel={panel} isFirstInRow={i === 0} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
