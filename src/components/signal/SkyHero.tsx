"use client";

import { animate, cubicBezier, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { site } from "@/data/site";
import { HERO_COURIER, HERO_FIGURE_HEIGHT, HERO_FIGURE_LIFT_CLASS } from "@/lib/hero";
import { heroPinPhases } from "@/lib/heroPinScroll";
import { introEase } from "@/lib/motion";
import { HeroLines } from "./HeroLines";
import { HeroPanorama } from "./HeroPanorama";
import { CARPET_FLY_DOWN_S, CARPET_FLY_IN_S, CARPET_PERCH_S, HeroCarpet } from "./HeroCarpet";
import { HeroCourierCloth } from "./HeroCourierCloth";
import { HeroPlane } from "./HeroPlane";
import { HeroWireDecor } from "./HeroWireDecor";
import { useHeroCovered } from "./useHeroCovered";

const START = 0.15;
/** How long the painting waits after the loader, while the construction lines draw over the dark. */
const SCENE_DELAY = 1;
const settle = [0.16, 1, 0.3, 1] as const;
/** The carpet's entry: it waits out the loader's fade, then takes its time crossing the sky. */
const CARPET_DELAY = 0.7;
const CARPET_S = CARPET_FLY_IN_S + CARPET_PERCH_S + CARPET_FLY_DOWN_S;
/** The carpet's three beats, in seconds of its entry clock: fly in, perch (held), fly down. */
const CARPET_BEATS = [0, CARPET_FLY_IN_S, CARPET_FLY_IN_S + CARPET_PERCH_S, CARPET_S];
const CARPET_EASE = [cubicBezier(0.3, 0, 0.2, 1), (v: number) => v, cubicBezier(0.45, 0, 0.2, 1)];
/** The pull off to the right, in reveal progress: drift, dig in, yanked out, gone (held off-frame till the page covers). */
const PULL_BEATS = [0, 0.3, 0.42, 0.62, 1];
const PULL_EASE = [cubicBezier(0.25, 0.1, 0.25, 1), cubicBezier(0.45, 0, 0.55, 1), cubicBezier(0.6, 0, 0.85, 0.35), (v: number) => v];

/**
 * The opener: 360° desert panorama, floating figure cutout,
 * statement for screen readers (the visible title lives in the nav card).
 */
export function SkyHero() {
  const reduce = useReducedMotion() ?? false;
  const { phase } = useHeroIntro();
  const ready = reduce || phase !== "loading";
  // Once the page covers the pinned hero, its idle bob stops.
  const sectionRef = useRef<HTMLElement>(null);
  const covered = useHeroCovered(sectionRef);

  const { scrollY } = useScroll();
  const scrollT = useTransform(scrollY, (y) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return Math.min(1, Math.max(0, y / vh));
  });
  const figureScrollY = useTransform(scrollT, [0, 1], [0, -72]);
  // After the nav card flips to About, the figure steps right.
  const reveal = useTransform(scrollY, (y) => heroPinPhases(y).reveal);
  // How far through the hero's pin, 0 to 1: the desert spins on out over the whole of it.
  const pinT = useTransform(scrollY, (y) => {
    const { pinEnd } = heroPinPhases(y);
    return pinEnd <= 0 ? 1 : Math.min(1, Math.max(0, y / pinEnd));
  });
  // Then something off to the right takes hold of him: he drifts that way, digs in and leans
  // back against it, and is yanked out of frame, stretched along the pull. Transforms only, no blur:
  // a filter would repaint the layer (and the mat's canvas) every frame and soften him.
  // The mat rides the same layer, so it goes with him.
  const pull = useSpring(reveal, { stiffness: 140, damping: 28, mass: 0.5, restDelta: 0.0005 });
  const figureRevealX = useTransform(pull, PULL_BEATS, ["0vw", "12vw", "6vw", "125vw", "125vw"], { ease: PULL_EASE });
  const figureRevealScaleX = useTransform(pull, PULL_BEATS, [1, 1.05, 0.95, 1.2, 1.2], { ease: PULL_EASE });
  const figureRevealScaleY = useTransform(pull, PULL_BEATS, [1, 1.05, 1.05, 0.93, 0.93], { ease: PULL_EASE });
  const figureRevealRotate = useTransform(pull, PULL_BEATS, [0, 0, -6, 10, 10], { ease: PULL_EASE });
  const figureReveal = {
    x: figureRevealX,
    scaleX: figureRevealScaleX,
    scaleY: figureRevealScaleY,
    rotate: figureRevealRotate,
    originX: 0.3,
  };
  // The construction lines wind back off over the first stretch of the reveal.
  const linesErase = useTransform(reveal, [0, 0.35], [0, 1]);
  const decorScrollY = useTransform(scrollT, [0, 1], [0, -36]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 62, damping: 16, mass: 0.55 });
  const my = useSpring(rawY, { stiffness: 62, damping: 16, mass: 0.55 });
  const figureX = useTransform(mx, (v) => v * 130);
  const figureYPointer = useTransform(my, (v) => v * 76);
  // A small bob as the page scrolls: up and down 10px, twice a screen, over its own drift.
  const figureBob = useTransform(scrollY, (y) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return Math.sin((y / vh) * Math.PI * 4) * 10;
  });
  const figureY = useTransform([figureYPointer, figureScrollY, figureBob], ([p, s, b]: number[]) => p + s + b);
  const figureRotate = useTransform(mx, (v) => v * 4.5);

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
  // The carpet is hidden below md: don't mount its canvas there, or fetch its model.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  // The carpet's model is heavy; its entry waits for it as well as the loader,
  // so it's never played out over an empty canvas.
  const [carpetLoaded, setCarpetLoaded] = useState(false);
  const onCarpetLoad = useCallback(() => setCarpetLoaded(true), []);
  const carpetIn = ready && carpetLoaded;
  const [carpetLanded, setCarpetLanded] = useState(false);
  // One clock for the whole entry, in seconds: it moves the box here and poses
  // the model in HeroCarpet, so the stand-up always plays at the perch.
  const carpetT = useMotionValue(0);
  const carpetX = useTransform(carpetT, CARPET_BEATS, ["-52vw", "16vw", "16vw", "0vw"], { ease: CARPET_EASE });
  const carpetY = useTransform(carpetT, CARPET_BEATS, ["-46vh", "-40vh", "-40vh", "0vh"], { ease: CARPET_EASE });
  const carpetScale = useTransform(carpetT, CARPET_BEATS, [0.5, 1.55, 1.55, 1], { ease: CARPET_EASE });
  const carpetRotate = useTransform(carpetT, CARPET_BEATS, [-14, 0, 0, 0], {
    ease: CARPET_EASE,
  });
  const carpetOpacity = useTransform(carpetT, [0, 0.35], [0, 1]);
  // The mat's line: in once it has stood up at the perch, out before it lies back down.
  const BUBBLE_BEATS = [
    CARPET_FLY_IN_S + 0.3,
    CARPET_FLY_IN_S + 0.7,
    CARPET_FLY_IN_S + CARPET_PERCH_S - 0.5,
    CARPET_FLY_IN_S + CARPET_PERCH_S - 0.1,
  ];
  const bubbleOpacity = useTransform(carpetT, BUBBLE_BEATS, [0, 1, 1, 0]);
  const bubbleScale = useTransform(carpetT, BUBBLE_BEATS, [0.6, 1, 1, 0.85]);
  useEffect(() => {
    if (!carpetIn || reduce) return;
    const run = animate(carpetT, CARPET_S, {
      duration: CARPET_S,
      delay: CARPET_DELAY,
      ease: "linear",
      onComplete: () => setCarpetLanded(true),
    });
    return () => run.stop();
  }, [carpetIn, reduce, carpetT]);

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      data-nav-theme="dark"
      className="relative h-full w-full overflow-hidden bg-night text-cream"
    >
      <h1 className="sr-only">
        {site.name}: {site.hero.statementMain}
      </h1>
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 1.06, filter: "blur(14px)" }}
        animate={
          ready
            ? {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                transitionEnd: { filter: "none" },
              }
            : { opacity: 0, scale: 1.06, filter: "blur(14px)" }
        }
        // Held back a beat so the construction lines draw over the dark before the painting arrives.
        transition={{
          duration: 1.6,
          ease: settle,
          delay: reduce ? 0 : SCENE_DELAY,
        }}
        className="absolute inset-0 bg-night"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-night" />

        {/* The ground: a 360° desert with a gold portal, the camera whipping round to it as
            the loader lifts (HeroPanorama); plain brand red under it until the photograph is in. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-brand" />
        <HeroPanorama
          mx={mx}
          my={my}
          scroll={pinT}
          start={ready}
          still={reduce}
          paused={covered}
          className="pointer-events-none absolute inset-0 z-[1]"
        />

        {/* Scrims only where text sits: the top-right actions and the seam at the bottom.
            The chapters' paintings take the same (DissolvePainting), so every section shares one exposure. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(21,19,15,0.42)_0%,transparent_22%),linear-gradient(to_top,rgba(21,19,15,0.28)_0%,transparent_30%)]"
        />

        {/* The biplane crossing the sky behind everything but the panorama, trailing smoke;
            on scroll it dives at us and climbs out over the top left. */}
        {wide ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[3]">
            <HeroPlane still={reduce} scroll={scrollT} />
          </div>
        ) : null}

        {/* The carpet under the courier's feet, in a layer of its own that moves as the
            figure's does (reveal, pointer), under the figure.
            Once the loader has gone and the model is in, it sweeps in from the
            top left, turning (HeroCarpet spins it), and settles under the feet. */}
        <motion.div
          style={reduce ? undefined : figureReveal}
          className="pointer-events-none absolute inset-0 z-[4] will-change-transform max-md:hidden"
        >
          <motion.div style={reduce ? undefined : { x: figureX, y: figureY, rotate: figureRotate }} className="absolute inset-0">
            {/* In from the top left to a perch behind the courier, right of his reaching
                hand, where it stands up and talks (HeroCarpet); then down under his feet. */}
            <motion.div
              style={
                reduce
                  ? undefined
                  : {
                      x: carpetX,
                      y: carpetY,
                      scale: carpetScale,
                      rotate: carpetRotate,
                      opacity: carpetOpacity,
                    }
              }
              className="pointer-events-auto absolute right-[10%] bottom-[-7%] left-[30%] h-[34%] lg:translate-x-[9%]"
            >
              {wide ? (
                <HeroCarpet still={reduce} reveal={reveal} entry={carpetT} active={carpetIn && !carpetLanded} onLoad={onCarpetLoad} />
              ) : null}
              {/* What the mat says while it stands and talks: the words alone in white, no box,
                  just above its top left. */}
              {wide && !reduce ? (
                <motion.div
                  aria-hidden
                  style={{ opacity: bubbleOpacity, scale: bubbleScale }}
                  className="pointer-events-none absolute right-[59%] bottom-[80%] w-[8.5rem] origin-bottom-right"
                >
                  <p className="relative font-headline text-[9px] leading-[1.25] tracking-[-0.01em] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.45)]">
                    Yo Boss, so what are we cookin&rsquo; today?
                  </p>
                </motion.div>
              ) : null}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          style={reduce ? undefined : figureReveal}
          className="pointer-events-none absolute inset-0 z-[4] will-change-transform"
        >
          <motion.div
            style={reduce ? undefined : { x: figureX, y: figureY, rotate: figureRotate }}
            className="hero-figure absolute inset-0"
          >
            <motion.div
              className="absolute inset-0"
              animate={reduce ? undefined : covered ? { y: 0, rotate: 0 } : { y: [0, -12, 0], rotate: [0, -0.6, 0] }}
              transition={
                covered
                  ? { duration: 0 }
                  : {
                      duration: 6,
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: at(1.6),
                    }
              }
            >
              <div className={`absolute inset-0 lg:translate-x-[9%] ${HERO_FIGURE_LIFT_CLASS}`}>
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: "-55%", rotate: -5 }}
                  animate={ready ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: "-55%", rotate: -5 }}
                  transition={{
                    opacity: {
                      duration: 0.45,
                      delay: at(0.35),
                      ease: introEase,
                    },
                    y: {
                      type: "spring",
                      stiffness: 55,
                      damping: 12,
                      mass: 1.1,
                      delay: at(0.35),
                    },
                    rotate: {
                      type: "spring",
                      stiffness: 55,
                      damping: 12,
                      delay: at(0.35),
                    },
                  }}
                  style={{
                    height: `${HERO_FIGURE_HEIGHT * 100}%`,
                    bottom: "calc(var(--hero-lift) * 100%)",
                  }}
                  className="absolute inset-x-0 w-full"
                >
                  {/* Wide: the picture on a plane, its cape and hair streaming in the wind
                      (HeroCourierCloth). Phones keep the plain cutout: no second canvas. */}
                  {wide ? (
                    <div className="absolute inset-0">
                      <HeroCourierCloth still={reduce} />
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={HERO_COURIER.src}
                      alt=""
                      draggable={false}
                      width={HERO_COURIER.width}
                      height={HERO_COURIER.height}
                      className="absolute inset-0 h-full w-full object-contain object-bottom select-none [backface-visibility:hidden] [transform:translateZ(0)]"
                    />
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-[6]">
          <HeroWireDecor mx={mx} my={my} scrollY={decorScrollY} still={reduce} ready={ready} />
        </div>
      </motion.div>

      {/* Construction lines round the nav card, outside the scene's fade: as the loader lifts they
          draw in bright over the dark, and the painting comes up under them a beat later. They
          erase on scroll. */}
      <div className="pointer-events-none absolute inset-0 z-[5] max-md:hidden">
        <HeroLines active={ready} erase={linesErase} />
      </div>
    </section>
  );
}
