"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { ImageRippleEffect, type RippleImageItem } from "@/components/ui/image-ripple-effect";
import { HeroSky } from "@/components/sections/hero/HeroSky";
import { site } from "@/data/site";
import {
  HERO_BG,
  HERO_FIGURE,
  HERO_FIGURE_HEIGHT,
  HERO_FIGURE_LIFT_CLASS,
  HERO_SEAT_CLOUD,
  HERO_SEAT_CLOUD_URL,
} from "@/lib/hero";
import { introEase } from "@/lib/motion";
import { DropCap } from "./Editions";
import { HeroLines } from "./HeroLines";
import { frame } from "./primitives";
import { HeroCarpet } from "./HeroCarpet";
import { HeroWireDecor } from "./HeroWireDecor";

const CLOUD_RIPPLE: RippleImageItem[] = [
  { src: HERO_SEAT_CLOUD_URL, x: 0, y: 0, widthScale: 1, heightScale: HERO_SEAT_CLOUD.height / HERO_SEAT_CLOUD.width },
];

const START = 0.15;
const settle = [0.16, 1, 0.3, 1] as const;
/** Scroll distance of the cloud/figure reveal, in viewport heights (HeroStage pins the hero for it). */
export const REVEAL_VH = 1.1;
/** Then a beat's hold, the camera push into the painting, and About over it. */
const CAM_START_VH = 1.35;
const CAM_VH = 1.15;
/** Total pinned scroll for the hero, in viewport heights (HeroStage's spacer). */
export const HERO_PIN_VH = CAM_START_VH + CAM_VH + 0.75;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** The carpet's entry: it waits out the loader's fade, then takes its time crossing the sky. */
const CARPET_DELAY = 0.7;
const CARPET_S = 2.8;

/**
 * The opener: hero photograph, cumulus with ripples, floating figure cutout,
 * statement for screen readers (the visible title lives in the nav card).
 */
export function SkyHero() {
  const reduce = useReducedMotion() ?? false;
  const { phase } = useHeroIntro();
  const ready = reduce || phase !== "loading";

  const { scrollY } = useScroll();
  const scrollT = useTransform(scrollY, (y) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return Math.min(1, Math.max(0, y / vh));
  });
  const bgScrollY = useTransform(scrollT, [0, 1], [0, 28]);
  const bgScrollScale = useTransform(scrollT, [0, 1], [1, 1.07]);
  const cloudScrollY = useTransform(scrollT, [0, 1], [0, -48]);
  const figureScrollY = useTransform(scrollT, [0, 1], [0, -72]);
  // The reveal: over the first REVEAL_VH of scroll (the hero is pinned for
  // it), the cloud parts left and swells, the figure steps right and swells
  // less, and the line behind them shows through.
  const reveal = useTransform(scrollY, (y) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return Math.min(1, Math.max(0, y / (vh * REVEAL_VH)));
  });
  const vw = () => (typeof window !== "undefined" ? window.innerWidth : 1280);
  // The camera push: the painting swells and slides left (the camera moving
  // right and in), the line, cloud and figure fly past the lens, and About
  // rises over the pushed-in painting. Function transforms throughout.
  const cam = useTransform(scrollY, (y) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return clamp01((y - vh * CAM_START_VH) / (vh * CAM_VH));
  });
  const ease = (v: number) => v * v * (3 - 2 * v);
  const camBgScale = useTransform(cam, (c) => 1 + ease(c) * 0.55);
  const camBgX = useTransform(cam, (c) => -ease(c) * 0.16 * vw());
  const flyOut = useTransform(cam, (c) => 1 - clamp01(c / 0.45));
  const aboutIn = useTransform(cam, (c) => ease(clamp01((c - 0.5) / 0.4)));
  const aboutY = useTransform(aboutIn, (a) => (1 - a) * 48);
  const aboutScrim = useTransform(aboutIn, (a) => a * 0.4);

  const cloudRevealX = useTransform([reveal, cam], ([r, c]: number[]) => (r * -0.62 - ease(c) * 0.5) * vw());
  const cloudRevealScale = useTransform([reveal, cam], ([r, c]: number[]) => (1 + r * 0.35) * (1 + ease(c) * 1.2));
  const figureRevealX = useTransform([reveal, cam], ([r, c]: number[]) => (r * 0.42 + ease(c) * 0.5) * vw());
  const figureRevealScale = useTransform([reveal, cam], ([r, c]: number[]) => (1 + r * 0.1) * (1 + ease(c) * 0.9));
  const lineOpacity = useTransform([reveal, cam], ([r, c]: number[]) => clamp01((r - 0.12) / 0.48) * (1 - clamp01(c / 0.4)));
  // The construction lines wind back off over the first stretch of the reveal.
  const linesErase = useTransform(reveal, [0, 0.35], [0, 1]);
  const lineScale = useTransform([reveal, cam], ([r, c]: number[]) => (0.92 + r * 0.08) * (1 + ease(c) * 1.4));
  const lineX = useTransform(cam, (c) => -ease(c) * 0.25 * vw());
  const decorScrollY = useTransform(scrollT, [0, 1], [0, -36]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 62, damping: 16, mass: 0.55 });
  const my = useSpring(rawY, { stiffness: 62, damping: 16, mass: 0.55 });
  const bgX = useTransform(mx, (v) => v * -36);
  const bgYPointer = useTransform(my, (v) => v * -24);
  const bgY = useTransform([bgYPointer, bgScrollY], ([p, s]: number[]) => p + s);
  const cloudX = useTransform(mx, (v) => v * 36);
  const cloudYPointer = useTransform(my, (v) => v * 22);
  const cloudY = useTransform([cloudYPointer, cloudScrollY], ([p, s]: number[]) => p + s);
  const figureX = useTransform(mx, (v) => v * 64);
  const figureYPointer = useTransform(my, (v) => v * 38);
  const figureY = useTransform([figureYPointer, figureScrollY], ([p, s]: number[]) => p + s);
  const figureRotate = useTransform(mx, (v) => v * 2.8);

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
  // The carpet's model is heavy; its entry waits for it as well as the loader,
  // so it's never played out over an empty canvas.
  const [carpetLoaded, setCarpetLoaded] = useState(false);
  const onCarpetLoad = useCallback(() => setCarpetLoaded(true), []);
  const carpetIn = ready && carpetLoaded;
  const [carpetLanded, setCarpetLanded] = useState(false);

  return (
    <section aria-label="Introduction" data-nav-theme="dark" className="relative h-full w-full overflow-hidden bg-night text-cream">
      <h1 className="sr-only">
        {site.name}: {site.hero.statementMain}
      </h1>
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 1.06, filter: "blur(14px)" }}
        animate={
          ready
            ? { opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }
            : { opacity: 0, scale: 1.06, filter: "blur(14px)" }
        }
        transition={{ duration: 1.6, ease: settle }}
        className="absolute inset-0 bg-night"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-night" />

        <motion.div
          aria-hidden
          style={reduce ? undefined : { x: camBgX, scale: camBgScale }}
          className="pointer-events-none absolute inset-0 z-[1] will-change-transform"
        >
        <motion.div
          aria-hidden
          style={reduce ? undefined : { x: bgX, y: bgY, scale: bgScrollScale }}
          className="pointer-events-none absolute top-1/2 left-1/2 h-[122%] w-[122%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_BG.src}
            alt=""
            width={HERO_BG.width}
            height={HERO_BG.height}
            draggable={false}
            className="h-full w-full select-none object-cover object-center"
          />
        </motion.div>
        </motion.div>

        {/* Scrims only where text sits: the top-right tags and the seam at the bottom. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(21,19,15,0.42)_0%,transparent_22%),linear-gradient(to_top,rgba(21,19,15,0.28)_0%,transparent_30%)]"
        />

        <HeroSky mx={mx} my={my} />

        {/* Revealed as the cloud and figure part. */}
        <motion.p
          aria-hidden
          style={reduce ? undefined : { opacity: lineOpacity, scale: lineScale, x: lineX }}
          className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center text-center leading-[0.86] text-cream will-change-transform [text-shadow:0_6px_60px_rgba(0,0,0,0.35)]"
        >
          {/* Editions heading style: a swash script capital, the rest in the narrative serif. */}
          <span className="font-narrative text-[clamp(4.5rem,13vw,13.5rem)] tracking-[-0.045em]">
            <span className="mr-[-0.08em] font-flourish text-[1.3em] leading-none tracking-normal">O</span>bsession
          </span>
          <span className="my-[0.04em] font-narrative text-[clamp(2rem,5vw,5rem)] tracking-[-0.03em] text-gold">
            beats
          </span>
          <span className="font-narrative text-[clamp(4.5rem,13vw,13.5rem)] tracking-[-0.045em]">
            <span className="mr-[-0.06em] font-flourish text-[1.3em] leading-none tracking-normal">T</span>alent
          </span>
        </motion.p>

        {/* The carpet under the courier's feet, in a layer of its own that moves as the
            figure's does (reveal, camera push, pointer), over the cloud and under the
            figure. Once the loader has gone and the model is in, it sweeps in from the
            top left over the cloud, turning (HeroCarpet spins it), and settles under the feet. */}
        <motion.div
          style={reduce ? undefined : { x: figureRevealX, scale: figureRevealScale, opacity: flyOut }}
          className="pointer-events-none absolute inset-0 z-[4] will-change-transform max-md:hidden"
        >
          <motion.div style={reduce ? undefined : { x: figureX, y: figureY, rotate: figureRotate }} className="absolute inset-0">
            <motion.div
              initial={reduce ? false : { x: "-52vw", y: "-46vh", scale: 0.5, rotate: -14, opacity: 0 }}
              animate={carpetIn ? { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 } : undefined}
              transition={{
                default: { duration: CARPET_S, delay: CARPET_DELAY, ease: [0.45, 0, 0.2, 1] },
                // Drops in a long arc rather than a straight line.
                y: { duration: CARPET_S, delay: CARPET_DELAY, ease: [0.3, 0, 0.15, 1] },
                opacity: { duration: 0.35, delay: CARPET_DELAY, ease: "easeOut" },
              }}
              onAnimationComplete={() => setCarpetLanded(true)}
              className="pointer-events-none absolute right-[10%] bottom-[-7%] left-[30%] h-[34%] lg:translate-x-[9%]"
            >
              <HeroCarpet still={reduce} reveal={reveal} ready={carpetIn} active={carpetIn && !carpetLanded} onLoad={onCarpetLoad} />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div style={reduce ? undefined : { x: cloudRevealX, scale: cloudRevealScale, opacity: flyOut }} className="pointer-events-none absolute inset-0 z-[3] will-change-transform">
          <motion.div style={reduce ? undefined : { x: cloudX, y: cloudY }} className="pointer-events-none absolute inset-0">
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
        </motion.div>

        <motion.div
          style={reduce ? undefined : { x: figureRevealX, scale: figureRevealScale, opacity: flyOut }}
          className="absolute inset-0 z-[4] will-change-transform"
        >
          <motion.div
            style={reduce ? undefined : { x: figureX, y: figureY, rotate: figureRotate }}
            className="hero-figure absolute inset-0"
          >
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
                    src={HERO_FIGURE.src}
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
        </motion.div>

        {/* Construction lines round the nav card; they draw in as the loader lifts and erase on scroll. */}
        <div className="pointer-events-none absolute inset-0 z-[5] max-md:hidden">
          <HeroLines active={ready} erase={linesErase} />
        </div>

        <motion.div style={reduce ? undefined : { opacity: flyOut }} className="pointer-events-none absolute inset-0 z-[6]">
          <HeroWireDecor mx={mx} my={my} scrollY={decorScrollY} still={reduce} ready={ready} />
        </motion.div>

        {/* About, over the pushed-in painting. */}
        <motion.div
          aria-hidden
          style={{ opacity: reduce ? 0 : aboutScrim }}
          className="pointer-events-none absolute inset-0 z-[7] bg-night"
        />
        <motion.div
          style={reduce ? { opacity: 0 } : { opacity: aboutIn, y: aboutY }}
          className="pointer-events-none absolute inset-0 z-[8] text-cream"
        >
          <div className={`${frame} flex h-full flex-col justify-end pb-[clamp(5rem,14vh,9rem)] md:justify-center md:pl-[calc(var(--nav-sidebar-w)+1.5rem)]`}>
            <h2 className="py-8 font-headline text-[clamp(4.5rem,13vw,13rem)] leading-[0.88] tracking-[-0.045em] [text-shadow:0_6px_60px_rgba(0,0,0,0.35)] md:py-16">
              About
            </h2>
            <p className="max-w-[44rem] text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.02] text-pretty [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]">
              <DropCap>{site.aboutEdition.body}</DropCap>
            </p>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
