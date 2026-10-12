"use client";

import { motion } from "motion/react";
import type { RefObject } from "react";
import { introEase } from "@/components/motion/intro";
import { site } from "@/data/site";

const WORD = site.hero.statementScript.toUpperCase();
// The scroll exit flies through the counter of this letter.
const PIVOT = WORD.indexOf("O");

/**
 * Towering Anton word between the cloud and the figure, so the character
 * overlaps it. Letters rise out of a mask once the figure has landed. The
 * outer wrapper belongs to the scroll exit (it swells around the pivot
 * letter), the inner one to the cursor parallax, so the tweens never fight.
 * Decorative: the statement below carries the same word for readers.
 */
export function HeroWord({
  wordRef,
  mouseRef,
  pivotRef,
  show,
  reduce,
  handoff,
}: {
  wordRef: RefObject<HTMLDivElement | null>;
  mouseRef: RefObject<HTMLDivElement | null>;
  pivotRef: RefObject<HTMLSpanElement | null>;
  show: boolean;
  reduce: boolean;
  handoff: boolean;
}) {
  // After a loader handoff the figure flies in first; let it land.
  const lead = handoff ? 1.05 : 0.5;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[44%] -translate-y-1/2 select-none max-md:top-[34%]"
    >
      <div ref={wordRef} className="will-change-transform">
        <div ref={mouseRef} className="will-change-transform">
          <p className="flex justify-center font-display text-[24vw] leading-[0.8] tracking-[-0.01em] text-ink uppercase">
            {WORD.split("").map((char, i) => (
              <span key={i} className="block overflow-hidden pb-[0.02em]">
                <motion.span
                  ref={i === PIVOT ? pivotRef : undefined}
                  className="block"
                  initial={{ y: reduce ? "0%" : "105%" }}
                  animate={{ y: show || reduce ? "0%" : "105%" }}
                  transition={{
                    duration: reduce ? 0 : 0.9,
                    ease: introEase,
                    delay: reduce ? 0 : lead + i * 0.045,
                  }}
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
