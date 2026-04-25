"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { ColorScheme } from "../lib/color-scheme";

export type ProjectShowcaseImage = {
  src: string | StaticImageData;
  alt: string;
  width: number;
  height: number;
};

const DEFAULT_PARAGRAPHS = [
  "Ashcode treats the storefront and the service layer as one surface: shipping MERN stacks where typography, motion, and error states carry the same intention as the schema behind them.",
  "Whether it is a commerce flow, a dashboard, or a small product with outsized ambition, the work stays editorial—clear hierarchy, confident restraint, and detail you notice when you scroll slowly.",
] as const;

type ProjectShowcaseProps = {
  leftImage?: ProjectShowcaseImage;
  centerImage?: ProjectShowcaseImage;
  rightImage?: ProjectShowcaseImage;
  bottomImage?: ProjectShowcaseImage;
  paragraphs?: readonly string[];
  eyebrow?: string;
  className?: string;
  id?: string;
  colorScheme?: ColorScheme;
};

const DEFAULT_LEFT_IMAGE: ProjectShowcaseImage = {
  src: "/project1.avif",
  alt: "Project 01 preview",
  width: 1600,
  height: 2000,
};

const DEFAULT_CENTER_IMAGE: ProjectShowcaseImage = {
  src: "/project2.avif",
  alt: "Project 02 preview",
  width: 1600,
  height: 2000,
};

const DEFAULT_RIGHT_IMAGE: ProjectShowcaseImage = {
  src: "/project3.avif",
  alt: "Project 03 preview",
  width: 1600,
  height: 2000,
};

const DEFAULT_BOTTOM_IMAGE: ProjectShowcaseImage = {
  src: "/project4.avif",
  alt: "Project 04 preview",
  width: 1600,
  height: 2000,
};

export default function ProjectShowcase({
  leftImage = DEFAULT_LEFT_IMAGE,
  centerImage = DEFAULT_CENTER_IMAGE,
  rightImage = DEFAULT_RIGHT_IMAGE,
  bottomImage = DEFAULT_BOTTOM_IMAGE,
  paragraphs = DEFAULT_PARAGRAPHS,
  eyebrow,
  className = "",
  id = "project",
  colorScheme = "dark",
}: ProjectShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const light = colorScheme === "light";
  const cards = [leftImage, centerImage, rightImage, bottomImage];

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.fromTo(
      text,
      { yPercent: -18 },
      {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const gridStyle = light
    ? {
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(0,0,0,0.06) calc(8.333333% - 1px), rgba(0,0,0,0.06) 8.333333%)",
      }
    : {
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(255,255,255,0.06) calc(8.333333% - 1px), rgba(255,255,255,0.06) 8.333333%)",
      };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative isolate w-full overflow-hidden py-16 transition-colors duration-300 md:py-24 lg:py-28  ${className}`}
      aria-label="Featured project"
    >
      <div className="pointer-events-none absolute inset-0 z-0" style={gridStyle} aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-[min(100%,90rem)]">
        <div className="w-full md:w-[68vw] lg:w-[64vw]">
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:gap-5 lg:gap-6">
            {cards.map((card, index) => (
              <figure key={`${card.alt}-${index}`}>
                <div className={`relative aspect-[4/5] w-full overflow-hidden ${light ? "bg-black/[0.04]" : "bg-white/[0.04]"}`}>
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={card.width}
                    height={card.height}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 62vw, 29vw"
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>

        <div
          ref={textRef}
          className="mt-6 flex w-full flex-col items-end justify-end gap-2.5 text-right md:mt-7 md:gap-3 lg:absolute lg:bottom-[12%] lg:right-0 lg:mt-0 lg:w-[min(32vw,22rem)] lg:gap-3"
        >
          {eyebrow ? (
            <p
              className={`max-w-full text-right font-mono text-[9px] font-medium uppercase tracking-[0.18em] md:text-[10px] ${light ? "text-black/45" : "text-white/45"}`}
            >
              {eyebrow}
            </p>
          ) : null}
          <div className="flex max-w-full flex-col items-end gap-2 text-right md:gap-2.5">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`max-w-[min(100%,24rem)] text-right font-safiro text-[12px] font-500 leading-[1.4] md:max-w-[min(100%,22rem)] md:text-[13px] md:leading-[1.42] lg:max-w-[min(100%,20rem)] lg:text-[14px] lg:leading-[1.45] ${light ? "text-black/88 hover:text-black" : "text-white/80 hover:text-white"}`}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
