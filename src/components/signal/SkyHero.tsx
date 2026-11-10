"use client";

import { animate, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { site } from "@/data/site";
import { heroPinPhases } from "@/lib/heroPinScroll";
import { HeroLines } from "./HeroLines";
import { CARPET_FLY_IN_S, CARPET_PERCH_S, CARPET_S, COURIER_INTRO_S, HeroWorld } from "./HeroWorld";
import { HeroWireDecor } from "./HeroWireDecor";
import { useHeroCovered } from "./useHeroCovered";

/** How long the painting waits after the loader, while the construction lines draw over the dark. */
const SCENE_DELAY = 1;
const settle = [0.16, 1, 0.3, 1] as const;
/** The courier's entry: held back so he arrives as the painting comes up. */
const COURIER_DELAY = 1.1;
/** The carpet's entry: it waits out the loader's fade, then takes its time crossing the sky. */
const CARPET_DELAY = 0.7;

/**
 * The opener: a 3D desert the visitor stands in (HeroWorld), the caped courier flying
 * in over it and his carpet flying in after him; the statement for screen readers (the
 * visible title lives in the nav card).
 */
export function SkyHero() {
  const reduce = useReducedMotion() ?? false;
  const { phase } = useHeroIntro();
  const ready = reduce || phase !== "loading";
  // Once the page covers the pinned hero, its idle motion and its drawing stop.
  const sectionRef = useRef<HTMLElement>(null);
  const covered = useHeroCovered(sectionRef);

  const { scrollY } = useScroll();
  const scrollT = useTransform(scrollY, (y) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return Math.min(1, Math.max(0, y / vh));
  });
  // After the nav card flips to About, the courier flies off on his mat.
  const reveal = useTransform(scrollY, (y) => heroPinPhases(y).reveal);
  // The flight out, smoothed off the scroll: straight ahead with the camera falling in
  // behind him, then the hard bank right out of frame (HeroWorld flies it).
  const flight = useSpring(reveal, { stiffness: 140, damping: 28, mass: 0.5, restDelta: 0.0005 });
  // The construction lines wind back off over the first stretch of the reveal.
  const linesErase = useTransform(reveal, [0, 0.35], [0, 1]);
  const decorScrollY = useTransform(scrollT, [0, 1], [0, -36]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 62, damping: 16, mass: 0.55 });
  const my = useSpring(rawY, { stiffness: 62, damping: 16, mass: 0.55 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  // The carpet is hidden below md: don't mount it there, or fetch its model.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // The models are heavy; each entry waits for its model as well as the loader, so it's
  // never played out over an empty stage.
  const [groundLoaded, setGroundLoaded] = useState(false);
  const [courierLoaded, setCourierLoaded] = useState(false);
  const [carpetLoaded, setCarpetLoaded] = useState(false);
  const onGroundLoad = useCallback(() => setGroundLoaded(true), []);
  const onCourierLoad = useCallback(() => setCourierLoaded(true), []);
  const onCarpetLoad = useCallback(() => setCarpetLoaded(true), []);
  // Under reduced motion he's simply there, landed.
  const [courierLandedState, setCourierLanded] = useState(false);
  const courierLanded = courierLandedState || reduce;

  // The courier's clock, in seconds: he glides in from the left and settles where he
  // stands (HeroWorld flies him). Scrolling on doesn't wait for him.
  const courierClock = useMotionValue(0);
  const courierIn = ready && groundLoaded && courierLoaded;
  useEffect(() => {
    if (!courierIn) return;
    if (reduce) {
      courierClock.set(COURIER_INTRO_S);
      return;
    }
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setCourierLanded(true);
    };
    const run = animate(courierClock, COURIER_INTRO_S, { duration: COURIER_INTRO_S, delay: COURIER_DELAY, ease: "linear", onComplete: finish });
    const onScroll = () => {
      if (window.scrollY < 40 || finished) return;
      run.stop();
      courierClock.set(COURIER_INTRO_S);
      finish();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      run.stop();
      window.removeEventListener("scroll", onScroll);
    };
  }, [courierIn, reduce, courierClock]);

  // The carpet's clock: in from the far upper left to a perch off the courier's right, where
  // it stands up and talks, then down under his feet (HeroWorld flies and poses it).
  const carpetClock = useMotionValue(0);
  const carpetIn = courierIn && carpetLoaded;
  useEffect(() => {
    if (!carpetIn) return;
    if (reduce) {
      carpetClock.set(CARPET_S);
      return;
    }
    const run = animate(carpetClock, CARPET_S, { duration: CARPET_S, delay: CARPET_DELAY, ease: "linear" });
    return () => run.stop();
  }, [carpetIn, reduce, carpetClock]);
  // The mat's line: in once it has stood up at the perch, out before it lies back down.
  const BUBBLE_BEATS = [
    CARPET_FLY_IN_S + 0.3,
    CARPET_FLY_IN_S + 0.7,
    CARPET_FLY_IN_S + CARPET_PERCH_S - 0.5,
    CARPET_FLY_IN_S + CARPET_PERCH_S - 0.1,
  ];
  const bubbleSaid = useTransform(carpetClock, BUBBLE_BEATS, [0, 1, 1, 0]);
  // And gone the moment the flight out begins, should the scroll come first.
  const bubbleOpacity = useTransform([bubbleSaid, reveal], ([said, r]: number[]) => said * (1 - Math.min(1, r * 5)));
  const bubbleScale = useTransform(carpetClock, BUBBLE_BEATS, [0.6, 1, 1, 0.85]);

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

        {/* The world: sky, dunes and gold portal, the courier and his carpet, all in one
            canvas with one camera, whipping round to the portal as the loader lifts;
            plain brand red under it until the sky photograph is in. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-brand" />
        <HeroWorld
          mx={mx}
          my={my}
          flight={flight}
          reveal={reveal}
          courierClock={courierClock}
          carpetClock={carpetClock}
          start={ready}
          still={reduce}
          paused={covered}
          carpet={wide}
          courierLanded={courierLanded}
          onGroundLoad={onGroundLoad}
          onCourierLoad={onCourierLoad}
          onCarpetLoad={onCarpetLoad}
          bubble={
            reduce ? null : (
              <motion.p
                style={{ opacity: bubbleOpacity, scale: bubbleScale }}
                className="w-[8.5rem] origin-bottom-right font-headline text-[9px] leading-[1.25] tracking-[-0.01em] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.45)]"
              >
                Yo Boss, so what are we cookin&rsquo; today?
              </motion.p>
            )
          }
          className="pointer-events-none absolute inset-0 z-[1]"
        />

        {/* Scrims only where text sits: the top-right actions and the seam at the bottom.
            The chapters' paintings take the same (DissolvePainting), so every section shares one exposure. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(21,19,15,0.42)_0%,transparent_22%),linear-gradient(to_top,rgba(21,19,15,0.28)_0%,transparent_30%)]"
        />

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
