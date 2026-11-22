"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { linkedinSection as copy } from "@/data/home";
import { riseAt } from "@/lib/motion/rise";
import { Reveal } from "./Reveal";

/** Where the triptych rests (svh from the stage top) and where it starts, low in the screen. */
const REST = 34;
const START = 78;
/** The outer two stand this much lower than the centre (px), and lag it by this share of the run. */
const OUTER_DROP = 55;
const OUTER_LAG = 0.15;

/**
 * LinkedIn: a held stage on the plain ground. The heading and one line sit at the top; three
 * posts rise from the bottom edge at their own speeds, the middle one larger, growing as it
 * comes, cut off by the screen's foot and edges. Nothing ever crosses the heading.
 */
export function LinkedInSection() {
  const wrap = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const centreY = useTransform(scrollYProgress, (p) => `${reduce ? REST : riseAt(p, START, REST)}svh`);
  const outerY = useTransform(
    scrollYProgress,
    (p) => `calc(${reduce ? REST : riseAt(p, START, REST, OUTER_LAG)}svh + ${OUTER_DROP}px)`,
  );
  const centreScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.82, 1]);
  const [left, centre, right] = copy.posts;

  return (
    <section ref={wrap} aria-labelledby="linkedin-title" data-nav-theme="light" className="relative h-[200svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="relative z-10 flex flex-col items-center px-4 pt-[12svh] text-center md:pt-[9svh]">
          <Reveal>
            <h2 id="linkedin-title" className="font-sans text-[28px] leading-[1.05] font-medium tracking-[-0.02em] text-ink md:text-[clamp(32px,2.8vw,44px)]">
              {copy.title[0]}
              <br />
              {copy.title[1]}
            </h2>
          </Reveal>
          <Reveal order={1} className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <p className="text-[16px] text-ink md:text-[18px]">{copy.lede}</p>
            <a
              href={copy.href}
              target="_blank"
              rel="noreferrer"
              className="text-[16px] font-medium text-brand underline-offset-4 transition-colors hover:underline md:text-[18px]"
            >
              {copy.cta} →
            </a>
          </Reveal>
        </div>
        <div className="absolute inset-x-0 top-0 flex justify-center gap-[10px]">
          <Post src={left.src} alt={left.alt} y={outerY} className="w-[40vw] shrink-0 md:w-[360px]" ratio="aspect-[360/530]" />
          <motion.div style={{ y: centreY, scale: centreScale }} className="w-[60vw] shrink-0 origin-top md:w-[min(760px,53vw)]">
            <Frame src={centre.src} alt={centre.alt} ratio="aspect-[4/5]" sizes="(min-width: 768px) 760px, 60vw" />
          </motion.div>
          <Post src={right.src} alt={right.alt} y={outerY} className="w-[40vw] shrink-0 md:w-[360px]" ratio="aspect-[360/530]" />
        </div>
      </div>
    </section>
  );
}

function Post({
  src,
  alt,
  y,
  className,
  ratio,
}: {
  src: string;
  alt: string;
  y: ReturnType<typeof useTransform<number, string>>;
  className: string;
  ratio: string;
}) {
  return (
    <motion.div style={{ y }} className={className}>
      <Frame src={src} alt={alt} ratio={ratio} sizes="(min-width: 768px) 360px, 40vw" />
    </motion.div>
  );
}

function Frame({ src, alt, ratio, sizes }: { src: string; alt: string; ratio: string; sizes: string }) {
  return (
    <div className={`relative overflow-hidden bg-ink/5 ${ratio}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
