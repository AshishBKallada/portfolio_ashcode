"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

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
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  // Floating preview thumbnail — follows cursor smoothly
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      return;
    }

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
      id="projects"
      className="relative isolate z-10 w-full bg-white text-black px-6 md:px-12 lg:px-20 py-24 md:py-32"
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
          <p className="font-body text-[11px] uppercase tracking-[0.35em] text-black/40">
            003 — Index
          </p>
          <p className="font-body text-[11px] uppercase tracking-[0.35em] text-black/40 tabular-nums">
            {String(PROJECTS.length).padStart(2, "0")} Projects
          </p>
        </div>

        <h2 className="mt-8 font-headline italic leading-[0.95] tracking-[-0.02em] text-[clamp(2.5rem,7vw,6rem)]">
          Selected <span className="text-black/50">works.</span>
        </h2>

        <p className="mt-6 max-w-2xl font-body text-base md:text-lg leading-relaxed text-black/65">
          A small collection of the things I&apos;ve shipped — full-stack web apps, brand surfaces
          and motion systems. Each one taught me something the docs couldn&apos;t. Hover a title to
          peek at the work.
        </p>

        {/* Full-width list */}
        <ul className="mt-16 md:mt-20 border-t border-black/15">
          {PROJECTS.map((p, i) => {
            const isHovered = previewIdx === i;
            return (
              <li key={p.number} className="border-b border-black/15">
                <a
                  href={p.href}
                  onMouseEnter={() => setPreviewIdx(i)}
                  onMouseLeave={() => setPreviewIdx(null)}
                  className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto_auto] items-baseline gap-x-6 md:gap-x-10 py-6 md:py-8"
                >
                  <span
                    className={`font-body text-[10px] tracking-[0.3em] tabular-nums transition-colors duration-300 ${
                      isHovered ? "text-black" : "text-black/40"
                    }`}
                  >
                    {p.number}
                  </span>
                  <span
                    className={`font-headline italic leading-[1.05] tracking-[-0.01em] text-[clamp(1.75rem,4.5vw,3.5rem)] transition-all duration-500 ${
                      isHovered ? "text-black translate-x-2 md:translate-x-4" : "text-black/85"
                    }`}
                  >
                    {p.name}
                  </span>
                  <span
                    className={`hidden md:inline-block font-body text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                      isHovered ? "text-black" : "text-black/50"
                    }`}
                  >
                    {p.tag}
                  </span>
                  <span
                    className={`hidden md:inline-block font-body text-[10px] uppercase tracking-[0.22em] tabular-nums transition-colors duration-300 ${
                      isHovered ? "text-black" : "text-black/50"
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
