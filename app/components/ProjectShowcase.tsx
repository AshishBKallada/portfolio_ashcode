"use client";

import Image, { type StaticImageData } from "next/image";

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
  paragraphs?: readonly string[];
  eyebrow?: string;
  className?: string;
  id?: string;
  colorScheme?: ColorScheme;
};

const DEFAULT_LEFT_IMAGE: ProjectShowcaseImage = {
  src: "/contact-section.png",
  alt: "Ashcode — contact and presence",
  width: 1200,
  height: 1200,
};

const DEFAULT_CENTER_IMAGE: ProjectShowcaseImage = {
  src: "/cube-float.png",
  alt: "Ashcode — product and depth",
  width: 640,
  height: 640,
};

export default function ProjectShowcase({
  leftImage = DEFAULT_LEFT_IMAGE,
  centerImage = DEFAULT_CENTER_IMAGE,
  paragraphs = DEFAULT_PARAGRAPHS,
  eyebrow,
  className = "",
  id = "project",
  colorScheme = "dark",
}: ProjectShowcaseProps) {
  const light = colorScheme === "light";

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
      id={id}
      className={`relative isolate w-full overflow-hidden py-16 transition-colors duration-300 md:py-24 lg:py-28 ${light ? "bg-white text-black" : "bg-black text-white"} ${className}`}
      aria-label="Featured project"
    >
      <div className="pointer-events-none absolute inset-0 z-0" style={gridStyle} aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-[min(100%,90rem)] px-2 md:px-3 lg:px-4">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-3 lg:gap-y-0">
          <figure className="lg:col-span-4">
            <div
              className={`relative aspect-[3/4] w-full overflow-hidden ${light ? "bg-black/[0.04]" : "bg-white/[0.04]"}`}
            >
              <Image
                src={leftImage.src}
                alt={leftImage.alt}
                width={leftImage.width}
                height={leftImage.height}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </figure>

          <figure className="lg:col-span-4">
            <div
              className={`relative aspect-[3/4] w-full overflow-hidden`}
            >
              <Image
                src={centerImage.src}
                alt={centerImage.alt}
                width={centerImage.width}
                height={centerImage.height}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </figure>

          <div className="flex w-full flex-col items-end justify-end gap-2.5 text-right md:gap-3 lg:col-span-4 lg:h-full lg:min-h-0 lg:gap-3 lg:pl-0 lg:pr-0">
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
                  className={`max-w-[min(100%,24rem)] text-right font-safiro text-[12px] font-normal leading-[1.4] md:max-w-[min(100%,22rem)] md:text-[13px] md:leading-[1.42] lg:max-w-[min(100%,20rem)] lg:text-[14px] lg:leading-[1.45] ${light ? "text-black/88" : "text-white/88"}`}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
