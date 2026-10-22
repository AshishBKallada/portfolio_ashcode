"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { ImageRippleEffect, type RippleImageItem } from "@/components/ui/image-ripple-effect";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { HeroSky } from "@/components/sections/hero/HeroSky";
import { site } from "@/data/site";
import {
  HERO_FIGURE,
  HERO_FIGURE_HEIGHT,
  HERO_FIGURE_LIFT_CLASS,
  HERO_FIGURE_URL,
  HERO_SEAT_CLOUD,
  HERO_SEAT_CLOUD_URL,
} from "@/lib/hero";
import { introEase } from "@/lib/motion";
import { Dot, metaLabel, metaText } from "./primitives";

// The cumulus fills its ripple canvas edge to edge (heightScale is a share
// of the canvas width, so it carries the image's aspect).
const CLOUD_RIPPLE: RippleImageItem[] = [
  { src: HERO_SEAT_CLOUD_URL, x: 0, y: 0, widthScale: 1, heightScale: HERO_SEAT_CLOUD.height / HERO_SEAT_CLOUD.width },
];

// The stage settles on this beat; the cast lands in turn after it.
const START = 0.15;
const settle = [0.16, 1, 0.3, 1] as const;

/**
 * The opener. Once the loader lifts, the red sky comes into focus as a whole,
 * easing in from a soft blur and a touch too close. A cumulus rises into
 * place, the floating figure descends onto it with a soft spring and then
 * idles in the air. The statement and its link hold the top left; a
 * bordered card and a short blurb the bottom right, a cursor hint the bottom
 * centre and the scroll button the bottom left.
 */
export function SkyHero() {
  const reduce = useReducedMotion() ?? false;
  // Holds everything at its start state until the loader has lifted.
  const { phase } = useHeroIntro();
  const ready = reduce || phase !== "loading";

  // Cursor parallax: the figure leans furthest toward the pointer, his cloud
  // a little less, matching the depth of the sky layers behind them.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 50, damping: 18, mass: 0.7 });
  const my = useSpring(rawY, { stiffness: 50, damping: 18, mass: 0.7 });
  const figureX = useTransform(mx, (v) => v * 34);
  const figureY = useTransform(my, (v) => v * 20);
  const cloudX = useTransform(mx, (v) => v * 18);
  const cloudY = useTransform(my, (v) => v * 10);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);
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
    <section aria-label="Introduction" className="relative h-full w-full overflow-hidden bg-background text-foreground">
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 1.06, filter: "blur(14px)" }}
        // The filter is dropped once settled: even blur(0px) keeps the whole
        // stage, WebGL canvas included, compositing through a filter layer.
        animate={
          ready
            ? { opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }
            : { opacity: 0, scale: 1.06, filter: "blur(14px)" }
        }
        transition={{ duration: 1.6, ease: settle }}
        className="absolute inset-0 bg-background"
      >
        <HeroSky />

        {/* The cumulus the figure lands on. The cursor drags ripples through
            it (read from the window, as the figure and copy sit on top). */}
        <motion.div style={reduce ? undefined : { x: cloudX, y: cloudY }} className="pointer-events-none absolute inset-0 z-[3]">
        <motion.div
          aria-hidden
          initial={reduce ? false : { opacity: 0, y: 110, scale: 0.86 }}
          animate={ready ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 110, scale: 0.86 }}
          transition={{ duration: 1.1, delay: at(0.15), ease: [0.16, 1, 0.3, 1] }}
          style={{ aspectRatio: `${HERO_SEAT_CLOUD.width} / ${HERO_SEAT_CLOUD.height}` }}
          className="pointer-events-none absolute top-1/2 left-1/2 z-[3] w-[clamp(24rem,92vw,84rem)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none max-md:top-auto max-md:bottom-[calc(32%+46vw)] max-md:w-[170vw] max-md:translate-y-1/2"
        >
          <ImageRippleEffect
            images={CLOUD_RIPPLE}
            trackWindow
            still={reduce}
            distortionStrength={0.06}
            waveSize={80}
            sepia={0.12}
            saturation={1.15}
            className="h-full w-full"
            fallback={
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={HERO_SEAT_CLOUD_URL}
                alt=""
                draggable={false}
                width={HERO_SEAT_CLOUD.width}
                height={HERO_SEAT_CLOUD.height}
                className="h-full w-full select-none [filter:sepia(0.12)_saturate(1.15)]"
              />
            }
          />
        </motion.div>
        </motion.div>

        {/* The figure: descends, settles, then idles in the air. */}
        <motion.div style={reduce ? undefined : { x: figureX, y: figureY }} className="hero-figure absolute inset-0 z-[4]">
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { y: [0, -12, 0], rotate: [0, -0.6, 0] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: at(1.6) }}
        >
          <div className={`absolute inset-0 lg:translate-x-[9%] ${HERO_FIGURE_LIFT_CLASS}`}>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: "-55%", rotate: -5 }}
              animate={ready ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: "-55%", rotate: -5 }}
              transition={{
                opacity: { duration: 0.45, delay: at(0.35), ease: introEase },
                y: { type: "spring", stiffness: 55, damping: 12, mass: 1.1, delay: at(0.35) },
                rotate: { type: "spring", stiffness: 55, damping: 12, delay: at(0.35) },
              }}
              style={{ height: `${HERO_FIGURE_HEIGHT * 100}%`, bottom: "calc(var(--hero-lift) * 100%)" }}
              className="absolute inset-x-0 w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_FIGURE_URL}
                alt=""
                draggable={false}
                width={HERO_FIGURE.width}
                height={HERO_FIGURE.height}
                className="absolute inset-0 h-full w-full object-contain object-bottom select-none [backface-visibility:hidden] [transform:translateZ(0)]"
              />
            </motion.div>
          </div>
        </motion.div>
        </motion.div>

        {/* Statement and its link, top left. */}
        <div className="absolute inset-x-0 top-[clamp(6.5rem,15vh,9.5rem)] z-10 px-4 sm:px-8">
          <h1 className="max-w-[14ch] font-serif text-[clamp(3rem,7.2vw,7.25rem)] leading-[0.92] tracking-[-0.035em]">
            <span className="block overflow-hidden">
              <motion.span {...line(1.0)} className="block">
                {site.hero.statementLineOne}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.2em]">
              <motion.span {...line(1.1)} className="block">
                {site.hero.statementLineTwoBefore}{" "}
                <span className="font-script text-[1.12em] leading-none text-flame">{site.hero.statementScript}</span>
                {site.hero.statementLineTwoAfter}
              </motion.span>
            </span>
          </h1>
          <motion.div {...fade(1.3)} className="mt-6 sm:mt-8">
            <AnchorLink
              href={site.hero.link.href}
              className={`${metaLabel} group inline-flex w-[15rem] items-center justify-between border-b border-ink pb-3`}
            >
              {site.hero.link.label}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </AnchorLink>
          </motion.div>
        </div>

        {/* Card and blurb, bottom right. */}
        <motion.div
          {...fade(1.5)}
          className="absolute right-4 bottom-8 z-10 hidden w-[19.5rem] md:block sm:right-8 lg:bottom-10"
        >
          <div className="grid grid-cols-[6.5rem_1fr] border border-ink/30">
            <div className="flex flex-col items-center justify-center gap-2 border-r border-ink/30 px-3 py-4">
              <svg aria-hidden viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.25">
                <circle cx="12" cy="12" r="9.25" />
                <ellipse cx="12" cy="12" rx="4" ry="9.25" />
                <path d="M2.75 12h18.5" />
              </svg>
              <span className={metaLabel}>{site.hero.card.place}</span>
            </div>
            <p className={`${metaText} flex items-center px-4 py-4`}>
              {site.hero.card.claim}
            </p>
          </div>
          <p className="mt-5 text-[15px] leading-[1.55] text-pretty">{site.hero.blurb}</p>
        </motion.div>

        {/* Cursor hint, bottom centre. */}
        <motion.p
          {...fade(1.7)}
          aria-hidden
          className={`${metaText} absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-center whitespace-nowrap [@media(pointer:fine)]:md:block lg:bottom-10`}
        >
          <span className="flex items-center justify-center gap-2">
            {site.hero.hint[0]} <Dot className="bg-script" />
          </span>
          <span className="block text-subtle">{site.hero.hint[1]}</span>
        </motion.p>

        {/* Scroll button, bottom left. */}
        <motion.a
          {...fade(1.7)}
          href="#about"
          aria-label="Scroll to About"
          className="absolute bottom-8 left-4 z-10 grid size-9 place-items-center rounded-full border border-ink/40 transition-colors hover:bg-ink hover:text-cream sm:left-8 lg:bottom-10"
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
      </motion.div>
    </section>
  );
}
