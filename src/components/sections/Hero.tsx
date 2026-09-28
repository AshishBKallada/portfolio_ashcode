"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { MaskLine } from "@/components/motion/MaskLine";
import { introEase } from "@/components/motion/intro";
import { site } from "@/data/site";
import { HeroCta } from "@/components/sections/hero/HeroCta";
import { HeroOverlay } from "@/components/sections/hero/HeroOverlay";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const { phase } = useHeroIntro();
  const reduce = useReducedMotion();
  const show = phase === "text" || phase === "done";
  const contentRef = useRef<HTMLDivElement>(null);

  // Copy lifts away faster than the hero slides, opposite to the backdrop.
  useEffect(() => {
    const el = contentRef.current;
    if (!el || reduce) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: () => -window.innerHeight * 0.25,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: () => window.innerHeight,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => ctx.revert();
  }, [reduce]);

  const fade = (i: number) => ({
    initial: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: {
      duration: reduce ? 0 : 0.55,
      ease: introEase,
      delay: reduce ? 0 : 0.35 + i * 0.07,
    },
  });

  return (
    <section className="relative h-full w-full bg-white">
      <HeroOverlay />
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex h-full w-full flex-col px-6 pt-24 pb-12 md:px-12 md:pt-28 md:pb-14 lg:px-20"
      >
        <div className="mt-auto grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end md:gap-6">
          <div className="md:col-span-4 lg:col-span-3">
            <motion.p
              {...fade(0)}
              className="text-[10px] uppercase tracking-[0.3em] text-white/70"
            >
              — Chapter 01 / Portfolio 2026
            </motion.p>
            <motion.div {...fade(1)} className="mt-3 h-px w-full bg-white/40" />
            <motion.p
              {...fade(2)}
              className="my-4 max-w-xs text-xs leading-relaxed text-white/85"
            >
              {site.hero.sublineBefore}{" "}
              <span className="font-semibold text-white">
                {site.hero.sublineHighlightOne}
              </span>{" "}
              {site.hero.sublineMiddle}{" "}
              <span className="font-semibold text-white">
                {site.hero.sublineHighlightTwo}
              </span>
              . {site.bio}
            </motion.p>
            <motion.div {...fade(3)} className="h-px w-full bg-white/40" />
            <motion.div
              {...fade(4)}
              className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/70"
            >
              <span>{site.location}</span>
              <span className="mx-3 h-px flex-1 bg-white/25" />
              <span>{site.role}</span>
            </motion.div>
            <motion.p
              {...fade(5)}
              className="mt-4 max-w-xs text-[11px] italic leading-relaxed text-white/70"
            >
              &ldquo;{site.hero.note}&rdquo;
            </motion.p>
          </div>

          <div className="md:col-span-8 md:text-right lg:col-span-9">
            <motion.p
              {...fade(0)}
              className="mb-4 text-[10px] uppercase tracking-[0.35em] text-white/70"
            >
              <span className="mr-3 inline-block h-px w-8 bg-white/50 align-middle" />
              {site.hero.greeting} — I&apos;m {site.hero.name}
              <span className="ml-3 inline-block h-px w-8 bg-white/50 align-middle" />
            </motion.p>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,5.75rem)] leading-[0.95] tracking-tight text-white">
              <MaskLine
                as="div"
                active={show}
                reduce={reduce ?? false}
                delay={0}
                duration={0.9}
              >
                {site.hero.headlineLineOne}
              </MaskLine>
              <MaskLine
                as="div"
                active={show}
                reduce={reduce ?? false}
                delay={0.12}
                duration={0.9}
              >
                {site.hero.headlineLineTwoBefore}{" "}
                <em className="font-serif font-extralight italic">
                  {site.hero.headlineItalic}
                </em>
                {site.hero.headlineLineTwoAfter}
              </MaskLine>
              <MaskLine
                as="div"
                active={show}
                reduce={reduce ?? false}
                delay={0.24}
                duration={0.9}
              >
                {site.hero.headlineLineThree}
              </MaskLine>
            </h1>
            <motion.div {...fade(4)}>
              <HeroCta />
            </motion.div>
          </div>
        </div>

        <motion.div
          {...fade(5)}
          className="mt-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/70"
        >
          <span className="h-px flex-1 bg-white/25" />
          <span>Scroll to explore</span>
          <span className="h-px w-8 bg-white/50" />
          <span>Selected work · About · Contact</span>
          <span className="h-px flex-1 bg-white/25" />
        </motion.div>
      </div>
    </section>
  );
}
