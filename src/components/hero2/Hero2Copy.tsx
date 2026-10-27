"use client";

import { motion, useReducedMotion } from "motion/react";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { Dot, metaLabel, metaText } from "@/components/signal/primitives";
import { site } from "@/data/site";
import { introEase } from "@/lib/motion";
import s from "./HeroSection2.module.css";

const START = 0.15;

/**
 * The words around the cloth: the statement and its link beside it, the
 * card and blurb bottom right, the cloth's dare under the link and the scroll
 * button bottom left. They land in turn once the loader lifts.
 */
export function Hero2Copy() {
  const reduce = useReducedMotion() ?? false;
  const { phase } = useHeroIntro();
  const ready = reduce || phase !== "loading";

  const at = (delay: number) => (reduce ? 0 : START + delay);
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: 0.7, delay: at(delay), ease: introEase },
  });
  const line = (delay: number) => ({
    initial: reduce ? false : { y: "110%" },
    animate: ready ? { y: "0%" } : { y: "110%" },
    transition: { duration: 0.95, delay: at(delay), ease: introEase },
  });

  return (
    <div className={s.copy}>
      <div className={s.statement}>
        <h1 className="font-serif text-[clamp(2.4rem,4.1vw,4.6rem)] leading-[0.92] tracking-[-0.035em] text-ink">
          <span className="block overflow-hidden">
            <motion.span {...line(0.6)} className="block">
              {site.hero.statementLineOne}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.2em]">
            <motion.span {...line(0.7)} className="block">
              {site.hero.statementLineTwo}
            </motion.span>
          </span>
        </h1>
        <motion.div {...fade(0.9)} className="mt-5">
          <AnchorLink
            href={site.hero.link.href}
            className={`${metaLabel} group inline-flex w-[15rem] items-center justify-between border-b border-ink pb-3 text-ink`}
          >
            {site.hero.link.label}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </AnchorLink>
        </motion.div>
        <motion.p {...fade(1.0)} aria-hidden className={`${metaText} ${s.hint} text-ink`}>
          <span className="flex items-center gap-2">
            Grab me · I dare you <Dot className="bg-script" />
          </span>
          <span className="block text-subtle">Scroll to meet the work</span>
        </motion.p>
      </div>

      <motion.div {...fade(1.1)} className={s.card}>
        <div className="grid grid-cols-[6.5rem_1fr] border border-ink/30 text-ink">
          <div className="flex flex-col items-center justify-center gap-2 border-r border-ink/30 px-3 py-4">
            <svg aria-hidden viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.25">
              <circle cx="12" cy="12" r="9.25" />
              <ellipse cx="12" cy="12" rx="4" ry="9.25" />
              <path d="M2.75 12h18.5" />
            </svg>
            <span className={metaLabel}>{site.hero.card.place}</span>
          </div>
          <p className={`${metaText} flex items-center px-4 py-4`}>{site.hero.card.claim}</p>
        </div>
        <p className="mt-5 text-[15px] leading-[1.55] text-pretty text-ink">{site.hero.blurb}</p>
      </motion.div>


      <motion.a
        {...fade(1.3)}
        href="#about"
        aria-label="Scroll to About"
        className={`${s.scroll} grid size-9 place-items-center rounded-full border border-ink/40 text-ink transition-colors hover:bg-ink hover:text-cream`}
      >
        <motion.svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          animate={reduce ? undefined : { y: [0, 2.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M8 2.5v10M3.5 8.5 8 13l4.5-4.5" />
        </motion.svg>
      </motion.a>
    </div>
  );
}
