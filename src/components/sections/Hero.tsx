"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { site } from "@/data/site";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <div ref={ref} aria-hidden className="relative h-svh w-full">
      <motion.section
        style={{ y }}
        className="fixed inset-x-0 top-0 z-20 h-svh w-full overflow-hidden bg-background"
      >
        <Image
          src="/images/hero/bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="relative z-10 flex h-full w-full flex-col px-6 pt-24 pb-8 md:px-12 md:pt-28 lg:px-20">
          <div className="mt-auto grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end md:gap-6">
            <div className="md:col-span-4 lg:col-span-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">
                — Chapter 01 / Portfolio 2026
              </p>
              <div className="mt-3 h-px w-full bg-white/40" />
              <p className="my-4 max-w-xs text-xs leading-relaxed text-white/85">
                {site.hero.sublineBefore}{" "}
                <span className="font-semibold text-white">
                  {site.hero.sublineHighlightOne}
                </span>{" "}
                {site.hero.sublineMiddle}{" "}
                <span className="font-semibold text-white">
                  {site.hero.sublineHighlightTwo}
                </span>
                . {site.bio}
              </p>
              <div className="h-px w-full bg-white/40" />
              <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/70">
                <span>{site.location}</span>
                <span className="mx-3 h-px flex-1 bg-white/25" />
                <span>{site.role}</span>
              </div>
              <p className="mt-4 max-w-xs text-[11px] italic leading-relaxed text-white/70">
                &ldquo;{site.hero.note}&rdquo;
              </p>
            </div>

            <div className="md:col-span-8 md:text-right lg:col-span-9">
              <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-white/70">
                <span className="mr-3 inline-block h-px w-8 bg-white/50 align-middle" />
                {site.hero.greeting} — I&apos;m {site.hero.name}
                <span className="ml-3 inline-block h-px w-8 bg-white/50 align-middle" />
              </p>
              <h1 className="font-serif text-[clamp(2.5rem,6vw,5.75rem)] leading-[0.95] tracking-tight text-white">
                {site.hero.headlineLineOne}
                <br />
                {site.hero.headlineLineTwoBefore}{" "}
                <em className="font-serif font-extralight italic">
                  {site.hero.headlineItalic}
                </em>
                {site.hero.headlineLineTwoAfter}
                <br />
                {site.hero.headlineLineThree}
              </h1>
              <div className="mt-6 ml-auto h-px w-full max-w-md bg-white/40" />
              <p className="mt-3 ml-auto max-w-md text-xs uppercase tracking-[0.25em] text-white/80">
                {site.tagline}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/70">
            <span className="h-px flex-1 bg-white/25" />
            <span>Scroll to explore</span>
            <span className="h-px w-8 bg-white/50" />
            <span>Selected work · About · Contact</span>
            <span className="h-px flex-1 bg-white/25" />
          </div>
        </div>
      </motion.section>
    </div>
  );
}
