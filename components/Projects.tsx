"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useScrollReveal } from "@/lib/useScrollReveal";

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
    name: "KADA",
    tag: "Gov · Full-stack",
    year: "2025",
    impactLabel: "Citizens served",
    impactValue: "1M+",
    description:
      "Digital platform for the Kuppam Area Development Authority — a Government of Andhra Pradesh initiative — unifying citizen services, land records and project tracking into a single surface.",
    tech: ["Next.js", "Node", "PostgreSQL"],
    image: "/project1.avif",
    alt: "KADA Andhra Pradesh government platform",
    bg: "bg-[#1f3bff]",
    href: "#",
  },
  {
    number: "02",
    name: "Curengo",
    tag: "HealthTech · SaaS",
    year: "2025",
    impactLabel: "Patients managed",
    impactValue: "50K+",
    description:
      "Hospital management system handling OPD, IPD, billing, lab and pharmacy in one place — built so small clinics and mid-size hospitals get the same operating leverage as the big chains.",
    tech: ["Next.js", "Node", "MongoDB"],
    image: "/project2.avif",
    alt: "Curengo hospital management system",
    bg: "bg-[#0f2a1e]",
    href: "#",
  },
  {
    number: "03",
    name: "Verdura",
    tag: "Sustainability · Web",
    year: "2025",
    impactLabel: "Trees pledged",
    impactValue: "120K+",
    description:
      "Green culture platform connecting urban communities with reforestation drives, native plant guides and a transparent tracker for every sapling pledged and planted.",
    tech: ["Next.js", "Tailwind", "Sanity"],
    image: "/bali.webp",
    alt: "Verdura green culture website",
    bg: "bg-[#1a3a22]",
    href: "#",
  },
  {
    number: "04",
    name: "Womarpools",
    tag: "Brand · Web",
    year: "2025",
    impactLabel: "Bookings lift",
    impactValue: "+3.4×",
    description:
      "Marketing site and lead pipeline for a luxury pool design studio — cinematic galleries, quote flow and a CMS the team actually wants to use.",
    tech: ["Next.js", "Tailwind", "Sanity"],
    image: "/hero-image.png",
    alt: "Womarpools luxury pool design website",
    bg: "bg-[#0a2540]",
    href: "#",
  },
];

const LEDE_TEXT =
  "A few of the ones I'm proud of. I didn't build these alone — but on each one I played a crucial role and took the risky calls that kept the requirements landing on time. The kind of bets you only make when the deadline is real.";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  useScrollReveal(sectionRef);

  // Floating preview thumbnail — follows cursor smoothly
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.65, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.65, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX + 28);
      yTo(e.clientY - 150);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative isolate z-10 w-full bg-black text-[#E1E0CC] px-6 md:px-12 lg:px-20 py-24 md:py-32"
    >
      {/* Floating hover preview — follows cursor over project list */}
      <div
        ref={previewRef}
        aria-hidden
        className={`pointer-events-none hidden md:block fixed top-0 left-0 z-50 w-[240px] h-[300px] overflow-hidden transition-opacity duration-300 ${
          previewIdx === null ? "opacity-0" : "opacity-100"
        }`}
        style={{ transform: "translate3d(-9999px, 0, 0)" }}
      >
        {PROJECTS.map((p, i) => (
          <div
            key={p.number}
            className={`absolute inset-0 ${p.bg} transition-[clip-path] duration-[520ms] ease-[cubic-bezier(0.65,0,0.35,1)]`}
            style={{
              clipPath:
                previewIdx === i ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
            }}
          >
            <Image
              src={p.image}
              alt=""
              fill
              sizes="240px"
              className="object-cover opacity-95"
            />
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-baseline justify-between">
          <p data-reveal="fade" className="font-body text-[11px] uppercase tracking-[0.35em] text-[#E1E0CC]/40">
            003 — Index
          </p>
          <p data-reveal="fade" className="font-body text-[11px] uppercase tracking-[0.35em] text-[#E1E0CC]/40 tabular-nums">
            {String(PROJECTS.length).padStart(2, "0")} Projects
          </p>
        </div>

        <h2 className="mt-8 font-headline italic leading-[0.95] tracking-[-0.02em] text-[clamp(2.5rem,7vw,6rem)]">
          <span className="inline-block overflow-hidden mr-[0.18em]">
            <span data-reveal="word" className="inline-block">Selected</span>
          </span>
          <span className="inline-block overflow-hidden">
            <span data-reveal="word" className="inline-block text-[#E1E0CC]/50">works.</span>
          </span>
        </h2>

        <p
          data-reveal="char"
          className="mt-6 max-w-2xl font-body text-base md:text-lg leading-relaxed text-[#E1E0CC]"
        >
          {LEDE_TEXT}
        </p>

        {/* Full-width list */}
        <ul className="mt-16 md:mt-20 border-t border-[#E1E0CC]/15">
          {PROJECTS.map((p, i) => {
            const isHovered = previewIdx === i;
            return (
              <li key={p.number} data-reveal="line" className="border-b border-[#E1E0CC]/15">
                <a
                  href={p.href}
                  onMouseEnter={() => setPreviewIdx(i)}
                  onMouseLeave={() => setPreviewIdx(null)}
                  className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto_auto] items-baseline gap-x-6 md:gap-x-10 py-6 md:py-8"
                >
                  <span
                    className={`font-body text-[10px] tracking-[0.3em] tabular-nums transition-colors duration-300 ${
                      isHovered ? "text-[#E1E0CC]" : "text-[#E1E0CC]/40"
                    }`}
                  >
                    {p.number}
                  </span>
                  <span
                    className={`font-headline italic leading-[1.05] tracking-[-0.01em] text-[clamp(1.75rem,4.5vw,3.5rem)] transition-all duration-500 ${
                      isHovered ? "text-[#E1E0CC] translate-x-2 md:translate-x-4" : "text-[#E1E0CC]/85"
                    }`}
                  >
                    {p.name}
                  </span>
                  <span
                    className={`hidden md:inline-block font-body text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                      isHovered ? "text-[#E1E0CC]" : "text-[#E1E0CC]/50"
                    }`}
                  >
                    {p.tag}
                  </span>
                  <span
                    className={`hidden md:inline-block font-body text-[10px] uppercase tracking-[0.22em] tabular-nums transition-colors duration-300 ${
                      isHovered ? "text-[#E1E0CC]" : "text-[#E1E0CC]/50"
                    }`}
                  >
                    {p.year}
                  </span>
                  <span
                    aria-hidden
                    className={`font-body text-lg md:text-xl transition-all duration-300 ${
                      isHovered
                        ? "opacity-100 translate-x-0"
                        : "opacity-40 -translate-x-1"
                    }`}
                  >
                    ↗
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
