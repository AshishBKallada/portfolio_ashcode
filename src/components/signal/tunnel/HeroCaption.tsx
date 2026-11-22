"use client";

import { AnimatePresence, motion } from "motion/react";
import type { HeroWork } from "@/data/hero";

const settle = [0.16, 1, 0.3, 1] as const;

/**
 * The hero's overlay: what you're walking past, centred at the foot, with a link to it; and
 * at the lower right, arrows to the previous and next work, and how to move.
 */
export function HeroCaption({
  work,
  onPrev,
  onNext,
  atStart,
  atEnd,
}: {
  work: HeroWork;
  onPrev: () => void;
  onNext: () => void;
  atStart: boolean;
  atEnd: boolean;
}) {
  const external = work.href.startsWith("http");
  return (
    <>
      <div className="pointer-events-none absolute inset-x-4 bottom-[8svh] flex flex-col items-center text-center text-ink">
        <p className="text-[14px] text-ink/60 md:text-[16px]">You&rsquo;re walking past</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={work.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: settle }}
            className="mt-1 font-display text-[32px] leading-none tracking-[0.01em] uppercase md:text-[clamp(36px,3.2vw,48px)]"
          >
            {work.title}
          </motion.p>
        </AnimatePresence>
        <a
          href={work.href}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className="pointer-events-auto mt-3 text-[16px] underline underline-offset-4 transition-colors hover:text-brand"
        >
          {external ? "Read the post" : "See the work"} →
        </a>
      </div>
      <div className="absolute right-4 bottom-[8svh] hidden flex-col items-end gap-4 md:right-8 md:flex">
        <div className="flex gap-3">
          <ArrowButton label="Previous work" onClick={onPrev} disabled={atStart}>
            ←
          </ArrowButton>
          <ArrowButton label="Next work" onClick={onNext} disabled={atEnd}>
            →
          </ArrowButton>
        </div>
        <p className="text-[14px] text-ink/60">Scroll to walk through</p>
      </div>
    </>
  );
}

function ArrowButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-11 place-items-center rounded-full bg-ink/[0.06] text-[18px] text-ink transition-[background-color,transform,opacity] duration-300 hover:bg-ink hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
