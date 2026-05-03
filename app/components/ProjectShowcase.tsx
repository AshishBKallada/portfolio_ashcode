"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { ColorScheme } from "../lib/color-scheme";
import { mainScrollScroller, prefersReducedMotion } from "../lib/main-scroller";

gsap.registerPlugin(ScrollTrigger);

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
  colorScheme = "light",
}: ProjectShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const light = colorScheme === "light";
  const cards = [leftImage, centerImage, rightImage, bottomImage];

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    const scroller = mainScrollScroller();
    const sc = scroller ? { scroller } : {};
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) return;

      gsap.fromTo(
        text,
        { yPercent: -12 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.85,
            ...sc,
          },
        },
      );

      const cardEls = section.querySelectorAll<HTMLElement>(".project-card-reveal");
      cardEls.forEach((card, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        gsap.fromTo(
          card,
          {
            y: 72,
            x: 28 * dir,
            scale: 0.9,
            rotation: 2.2 * dir,
            autoAlpha: 0,
            clipPath: "inset(10% 8% 12% 8%)",
            filter: "blur(10px)",
          },
          {
            y: 0,
            x: 0,
            scale: 1,
            rotation: 0,
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            filter: "blur(0px)",
            duration: 1.15,
            ease: "power4.out",
            delay: i * 0.1,
            immediateRender: false,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
              ...sc,
            },
          },
        );

        const media = card.querySelector<HTMLElement>(".project-card-media");
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -4, scale: 1.06 },
            {
              yPercent: 4,
              scale: 1.06,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.15,
                ...sc,
              },
            },
          );
        }
      });

      const textParts = text.querySelectorAll<HTMLElement>(".project-text-reveal");
      if (textParts.length) {
        gsap.from(textParts, {
          x: 36,
          autoAlpha: 0,
          filter: "blur(6px)",
          stagger: 0.11,
          duration: 0.85,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: text,
            start: "top 90%",
            toggleActions: "play none none reverse",
            ...sc,
          },
        });
      }

    }, section);

    return () => ctx.revert();
  }, []);

  const gridStyle = light
    ? {
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(0,0,0,0.05) calc(8.333333% - 1px), rgba(0,0,0,0.05) 8.333333%)",
      }
    : {
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(255,255,255,0.034) calc(8.333333% - 1px), rgba(255,255,255,0.034) 8.333333%)",
      };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative isolate w-full overflow-x-hidden overflow-y-visible py-16 pb-24 pt-16 transition-colors duration-300 md:pb-32 md:pt-24 lg:pb-40 lg:pt-28 ${light ? "bg-white text-black" : ""} ${className}`}
      aria-label="Featured project"
    >
      <div className="pointer-events-none absolute inset-0 z-0" style={gridStyle} aria-hidden />
      <div
        className={`pointer-events-none absolute inset-0 z-[1] ${light ? "bg-transparent" : "bg-black/[0.3]"}`}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[min(100%,90rem)]">
        <div className="w-full md:w-[68vw] lg:w-[64vw]">
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:gap-5 lg:gap-6">
            {cards.map((card, index) => (
              <figure key={`${card.alt}-${index}`}>
                <div
                  className={`project-card-reveal relative aspect-[4/5] w-full overflow-hidden will-change-transform ${light ? "bg-black/[0.04]" : "bg-white/[0.04]"}`}
                >
                  <div className="project-card-media absolute inset-0 will-change-transform">
                    <Image
                      src={card.src}
                      alt={card.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 62vw, 29vw"
                    />
                  </div>
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
              className={`project-text-reveal max-w-full text-right font-mono text-[9px] font-medium uppercase tracking-[0.18em] md:text-[10px] ${light ? "text-black/45" : "text-white/45"}`}
            >
              {eyebrow}
            </p>
          ) : null}
          <Link
            href="/projects"
            className={`project-text-reveal relative mt-1 inline-flex min-h-11 items-end justify-start border bg-transparent px-4 pb-2 pr-10 pt-3 font-safiro text-[11px] font-medium uppercase tracking-[0.14em] transition-[transform,opacity,border-color] duration-300 hover:scale-[1.02] hover:opacity-90 md:min-h-12 md:px-5 md:pb-2.5 md:pr-12 md:pt-3.5 md:text-xs ${
              light
                ? "border-black/35 text-black hover:border-black/55"
                : "border-white text-white hover:opacity-80"
            }`}
          >
            See All
            <span
              className={`pointer-events-none absolute right-2 top-1 font-mono text-[14px] leading-none md:right-2.5 md:top-1.5 md:text-[16px] ${light ? "text-black" : "text-white"}`}
            >
              ↗
            </span>
          </Link>
          <div className="flex max-w-full flex-col items-end gap-2 text-right md:gap-2.5">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`project-text-reveal max-w-[min(100%,24rem)] text-right font-safiro text-[12px] font-500 leading-[1.4] md:max-w-[min(100%,22rem)] md:text-[13px] md:leading-[1.42] lg:max-w-[min(100%,20rem)] lg:text-[14px] lg:leading-[1.45] ${light ? "text-black/85 hover:text-black" : "text-white/80 hover:text-white"}`}
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
