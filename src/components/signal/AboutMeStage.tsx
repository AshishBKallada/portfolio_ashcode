"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/data/site";
import { introEase } from "@/lib/motion";
import { frame, metaLabel } from "./primitives";

const copy = site.aboutEdition;

const CARD_LAYOUT = [
  "left-[4%] top-[18%] max-w-[14rem] -rotate-3 opacity-55 max-md:left-[2%] max-md:top-[8%] max-md:max-w-[11rem]",
  "left-[28%] top-[2%] z-10 max-w-[min(22rem,42vw)] max-md:left-[12%] max-md:top-[28%]",
  "right-[8%] top-[22%] max-w-[13rem] rotate-2 opacity-45 max-md:hidden",
  "right-[18%] top-[48%] max-w-[12rem] -rotate-1 opacity-40 max-md:right-[4%] max-md:top-[52%] max-md:max-w-[10rem]",
] as const;

/**
 * About opener — Editions-style layout: drop-cap serif
 * headline, kicker + body, doc-style CTA, floating prompt cards below.
 */
export function AboutMeStage() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-background text-foreground">
      <div className={`${frame} relative flex min-h-[100svh] flex-col pt-[clamp(5.5rem,14vh,8rem)] pb-16 md:pb-20`}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: introEase }}
          className="relative z-10 max-w-[42rem]"
        >
          <h2 className="font-serif text-[clamp(2.75rem,7.5vw,5.75rem)] leading-[0.92] tracking-[-0.035em] text-balance text-ink">
            <span
              aria-hidden
              className="float-left mt-[0.06em] mr-[0.08em] font-serif text-[1.45em] leading-[0.78] tracking-[-0.04em]"
            >
              {copy.dropCap}
            </span>
            {copy.headline}
          </h2>

          <p className="mt-8 font-sans text-[15px] font-semibold tracking-[-0.01em] text-ink/90">
            {copy.kicker}
          </p>
          <p className="mt-4 max-w-[34rem] font-serif text-[clamp(1.05rem,1.45vw,1.25rem)] leading-[1.45] tracking-[-0.01em] text-ink/80">
            {copy.body}
          </p>

          <Link
            href={copy.cta.href}
            className={`${metaLabel} mt-8 inline-flex min-h-10 items-center gap-2 rounded-[4px] border border-ink/30 bg-white/40 px-4 text-ink transition-colors hover:border-ink/50 hover:bg-white/70`}
          >
            {copy.cta.label}
            <span aria-hidden className="text-[11px]">
              ↗
            </span>
          </Link>
        </motion.div>

        {/* Floating prompt cards */}
        <div
          aria-hidden
          className="pointer-events-none relative mt-10 min-h-[clamp(16rem,38vh,22rem)] flex-1 md:mt-6"
        >
          {copy.cards.map((card, i) => {
            const featured = card.featured;
            return (
              <motion.div
                key={card.text}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: featured ? 1 : 0.55, y: 0 }}
                transition={{ duration: 0.7, delay: reduce ? 0 : 0.15 + i * 0.08, ease: introEase }}
                className={`absolute rounded-[18px] border border-white/60 bg-white/85 px-4 py-3.5 font-sans text-[13px] leading-snug tracking-[-0.01em] text-ink/80 shadow-[0_16px_40px_rgba(26,5,5,0.08)] backdrop-blur-sm ${CARD_LAYOUT[i] ?? ""} ${
                  featured
                    ? "scale-[1.02] border-violet-200/80 bg-white shadow-[0_24px_70px_rgba(124,58,237,0.18)] ring-1 ring-violet-300/40"
                    : ""
                }`}
              >
                {card.text}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
