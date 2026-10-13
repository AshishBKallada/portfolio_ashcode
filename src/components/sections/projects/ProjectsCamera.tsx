"use client";

import {
  cubicBezier,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { CLOUDS, CloudVeil } from "@/components/sections/projects/CloudVeil";

/**
 * Beats of the shot, as shares of the pinned scroll. The camera opens inside
 * a cloud bank on the headline, then twice flies forward into the scene in
 * front of it. Each fly-through runs in three beats: the scene swells at the
 * lens and fades, clouds rush past and cover the cut, and the next scene
 * comes up small out of the depth and grows to full size. Opacity ranges run
 * explicitly from 0 to 1 so they hold their end values however motion drives
 * them (a native scroll timeline drops back to the first keyframe past the
 * last offset).
 */
/**
 * One pace for the whole shot: the clouds parting and both fly-throughs each
 * take one beat of scroll, and each framed scene holds for a short rest.
 */
const BEAT = 1 / (3 + 3 * 0.35);
const REST = BEAT * 0.35;
const PART = [0, BEAT] as const;
const ZOOM_ONE = [BEAT + REST, 2 * BEAT + REST] as const;
const ZOOM_TWO = [2 * BEAT + 2 * REST, 3 * BEAT + 2 * REST] as const;
/** How much of the stage has to be on screen before the shot starts. */
const START_SHOWN = 0.5;
/** Where each scene sits fully framed, for jumping the camera on focus. */
const HOLD = [PART[1] + REST / 2, ZOOM_ONE[1] + REST / 2, ZOOM_TWO[1] + REST / 2];
/**
 * How far a leaving scene sweeps left: past the edge even at 2.4× its size,
 * so it leaves the frame without fading.
 */
const EXIT_X = "-165cqw";
/** Slow push-in while a scene is framed, so a hold never feels parked. */
const CREEP = 1.05;

/**
 * Within a fly-through: the outgoing scene swells past the lens first...
 */
const OUT = [0, 0.45] as const;
/** ...the clouds behind it come at the lens once it's out of the way... */
const RUSH = [0.3, 0.92] as const;
/** ...and the incoming scene grows in behind them as they clear. */
const IN = [0.55, 1] as const;

/** Flying in: picks up speed toward the lens. */
const dive = cubicBezier(0.45, 0, 0.75, 0.5);
/** The opening part: eases in and out evenly, so it never lurches. */
const drift = cubicBezier(0.45, 0, 0.55, 1);
/** Arrivals: quick start, long soft landing (the site's reveal curve). */
const settle = cubicBezier(0.22, 1, 0.36, 1);
/** Cards: lands with a hair of overshoot, like it was thrown. */
const toss = cubicBezier(0.34, 1.35, 0.64, 1);
const linear = (v: number) => v;

/** A point `t` of the way through a fly-through range. */
const along = (r: readonly [number, number], t: number) => r[0] + (r[1] - r[0]) * t;

// Mobile fans the three cards like a dealt hand; sm+ lines them up.
const CARD_SLOTS = [
  "left-[3%] top-[2%] -rotate-6",
  "left-[26%] top-[18%] rotate-2",
  "left-[47%] top-[34%] rotate-6",
];

/**
 * Motion for one scene: it grows from small out of the depth over the back
 * half of `enter`, drifting in from the right, creeps closer while it's
 * framed, and over the front half of `leave` swells toward the lens while
 * sweeping off to the left as the camera pushes in and turns right.
 */
function useScene(
  p: MotionValue<number>,
  enter?: readonly [number, number],
  leave?: readonly [number, number],
) {
  const at = [0];
  const scales = [enter ? 0.3 : 1];
  const xs = [enter ? "8cqw" : "0cqw"];
  const eases = [];
  if (enter) {
    at.push(along(enter, IN[0]), along(enter, IN[1]));
    scales.push(0.3, 1);
    xs.push("8cqw", "0cqw");
    eases.push(linear, settle);
  }
  if (leave) {
    at.push(along(leave, OUT[0]), along(leave, OUT[1]));
    scales.push(CREEP, 2.4);
    xs.push("0cqw", EXIT_X);
    eases.push(linear, dive);
  }
  at.push(1);
  scales.push(leave ? 2.4 : CREEP);
  xs.push(xs[xs.length - 1]);
  eases.push(linear);

  // Fades in over the first third of its growth while still small. It never
  // fades on the way out: it swells and sweeps clear of the frame instead.
  const fadeAt = [0];
  const fades = [enter ? 0 : 1];
  if (enter) {
    fadeAt.push(along(enter, IN[0]), along(enter, IN[0] + 0.18));
    fades.push(0, 1);
  }
  fadeAt.push(1);
  fades.push(1);

  const scale = useTransform(p, at, scales, { ease: eases });
  const x = useTransform(p, at, xs, { ease: eases });
  const opacity = useTransform(p, fadeAt, fades);
  // Drawn only between arriving and having swept off-screen, and clickable
  // only while it's the scene in frame.
  const shownFrom = enter ? along(enter, IN[0]) : 0;
  const goneAt = leave ? along(leave, OUT[1]) : Infinity;
  const visibility = useTransform(p, (v) => (v >= shownFrom && v < goneAt ? "visible" : "hidden"));
  const liveFrom = enter ? along(enter, 0.8) : 0;
  const liveTo = leave ? along(leave, 0.1) : Infinity;
  const pointerEvents = useTransform(p, (v) => (v >= liveFrom && v < liveTo ? "auto" : "none"));
  return { scale, x, opacity, visibility, pointerEvents };
}

type Puff = {
  img: keyof typeof CLOUDS;
  /** Where it waits in the distance behind the scene, in cqw / cqh from the centre. */
  from: [number, number];
  /** Where it flies out to, in cqw / cqh from the centre. */
  to: [number, number];
  /** Base width in cqw; it swells to SWELL × this at the lens. */
  w: number;
  flip?: boolean;
  /** Skipped on phones, where two puffs already fill the frame. */
  wide?: boolean;
};

/** How much a puff grows from its listed width as it reaches the lens. */
const SWELL = 3;
/** A puff's scale while it waits in the distance, as a share of full swell. */
const DISTANT = 0.1;

const PUFFS: Puff[] = [
  // Exits clear the frame at full swell, so nothing has to fade.
  // They wait above and below the band the copy sits in, so it stays legible.
  { img: "cumulus", from: [-32, 30], to: [-230, 30], w: 100 },
  { img: "wisp", from: [34, -30], to: [245, -30], w: 110, flip: true },
  { img: "cumulus", from: [8, 36], to: [20, 220], w: 85, flip: true, wide: true },
];

/**
 * Clouds that rush at the lens during a fly-through. They sit in the depth
 * between the outgoing and incoming scenes, so they surface from behind the
 * scene as it swells out of frame, then balloon past the edges and uncover
 * the next one.
 */
function Rush({
  progress,
  range,
  since,
  className,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number];
  /** When the clouds are already out there in the distance. */
  since: number;
  className: string;
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {PUFFS.map((puff, i) => (
        <RushPuff key={i} puff={puff} progress={progress} range={range} since={since} lag={i * 0.04} />
      ))}
    </div>
  );
}

function RushPuff({
  puff,
  progress,
  range,
  since,
  lag,
}: {
  puff: Puff;
  progress: MotionValue<number>;
  range: readonly [number, number];
  since: number;
  lag: number;
}) {
  const { src, ratio } = CLOUDS[puff.img];
  const a = along(range, RUSH[0] + lag);
  const b = along(range, RUSH[1] + lag);
  // Drawn at full swell and scaled down from there, so it stays crisp. It
  // never fades: from `since` it's already out in the distance behind the
  // scene, drifts a touch closer while the scene is framed, then rushes past
  // the lens and clear of the frame.
  const at = [since, a, b];
  const ease = { ease: [linear, dive] };
  const scale = useTransform(progress, at, [DISTANT, DISTANT * 1.25, 1], ease);
  const x = useTransform(progress, at, [`${puff.from[0]}cqw`, `${puff.from[0]}cqw`, `${puff.to[0]}cqw`], ease);
  const y = useTransform(progress, at, [`${puff.from[1]}cqh`, `${puff.from[1]}cqh`, `${puff.to[1]}cqh`], ease);
  const visibility = useTransform(progress, (v) => (v >= since && v < b ? "visible" : "hidden"));

  return (
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${puff.wide ? "hidden sm:block" : ""}`}
      style={{ width: `${puff.w * SWELL}cqw`, aspectRatio: ratio }}
    >
      <motion.div style={{ x, y, scale, visibility }} className="relative size-full">
        <Image
          src={src}
          alt=""
          fill
          loading="eager"
          sizes="240vw"
          className={`object-contain ${puff.flip ? "-scale-x-100" : ""}`}
        />
      </motion.div>
    </div>
  );
}

function Card({
  i,
  progress,
  children,
}: {
  i: number;
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  const start = along(ZOOM_ONE, IN[0] + 0.1) + i * 0.02;
  const end = start + 0.1;
  const y = useTransform(progress, [start, end], ["40%", "0%"], { ease: settle });
  const rotate = useTransform(progress, [start, end], [(i - 1) * 14, 0], { ease: settle });
  const scale = useTransform(progress, [start, end], [0.75, 1], { ease: toss });

  return (
    <div className={`absolute w-[48cqw] sm:static sm:w-auto sm:rotate-0 ${CARD_SLOTS[i]}`}>
      <motion.div style={{ y, rotate, scale }}>
        {children}
      </motion.div>
    </div>
  );
}

type Content = {
  headline: ReactNode;
  cards: ReactNode[];
  closing: ReactNode;
};

function CardRow({ cards, progress }: { cards: ReactNode[]; progress?: MotionValue<number> }) {
  return (
    <div className="relative mx-auto h-[min(72svh,36rem)] w-full sm:grid sm:h-auto sm:max-w-[min(64rem,calc((100svh-14rem)*2.25))] sm:grid-cols-3 sm:gap-1">
      {cards.map((card, i) =>
        progress ? (
          <Card key={i} i={i} progress={progress}>
            {card}
          </Card>
        ) : (
          <div key={i} className={`absolute w-[48cqw] sm:static sm:w-auto sm:rotate-0 ${CARD_SLOTS[i]}`}>
            {card}
          </div>
        ),
      )}
    </div>
  );
}

function Caption({ count }: { count: number }) {
  return (
    <p className="mb-4 flex w-full max-w-[min(64rem,calc((100svh-14rem)*2.25))] justify-between font-sans text-[11px] leading-none font-medium tracking-[0.14em] uppercase">
      <span>Selected work</span>
      <span className="tabular-nums">01 — {String(count).padStart(2, "0")}</span>
    </p>
  );
}

const COARSE = "(pointer: coarse)";
const subscribeCoarse = (onChange: () => void) => {
  const media = window.matchMedia(COARSE);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const isCoarse = () => window.matchMedia(COARSE).matches;

/** Everything that moves, driven by one progress value `p`. */
function Shot({
  p,
  mx,
  my,
  frame,
  headline,
  cards,
  closing,
}: Content & {
  p: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  frame: (scene: number) => () => void;
}) {
  // Clouds part on the headline, then swell away as the camera dives in.
  const veil = useTransform(p, [PART[0], PART[1]], [0, 1], { ease: drift });
  // The haze left framing the headline flies out past the edges with the
  // camera as it dives in, rather than fading.
  const veilScale = useTransform(p, [along(ZOOM_ONE, 0), along(ZOOM_ONE, OUT[1])], [1, 2.6], { ease: dive });
  // Once it's flown out, stop drawing it.
  const veilVisibility = useTransform(p, (v) => (v < along(ZOOM_ONE, OUT[1]) ? "visible" : "hidden"));

  // First arrival: the headline grows out of the haze as the clouds part.
  const headOpacity = useTransform(p, [0, along(PART, 0.15), along(PART, 0.55), 1], [0, 0, 1, 1]);
  const headScale = useTransform(p, [along(PART, 0.1), PART[1]], [0.3, 1], { ease: settle });

  const intro = useScene(p, undefined, ZOOM_ONE);
  const work = useScene(p, ZOOM_ONE, ZOOM_TWO);
  const end = useScene(p, ZOOM_TWO);

  // No will-change on anything that zooms: Chrome would freeze its raster at
  // the starting size and stretch it, which shows as blocky pixels mid-zoom.
  const scene = "absolute inset-0 flex items-center justify-center px-4 sm:px-5";

  return (
    <>
      {/* Three scenes stacked along the camera's path, front to back. */}
      <motion.div role="group" aria-label="Intro" onFocusCapture={frame(0)} style={intro} className={`${scene} z-[30]`}>
        <motion.div
          style={{ opacity: headOpacity, scale: headScale }}>
          {headline}
        </motion.div>
      </motion.div>
      <motion.div role="group" aria-label="Selected work" onFocusCapture={frame(1)} style={work} className={`${scene} z-[20] flex-col pt-14`}>
        <Caption count={cards.length} />
        <CardRow cards={cards} progress={p} />
      </motion.div>
      <motion.div role="group" aria-label="Closing" onFocusCapture={frame(2)} style={end} className={`${scene} z-[10]`}>
        {closing}
      </motion.div>

      <motion.div style={{ scale: veilScale, visibility: veilVisibility }} className="pointer-events-none absolute inset-0 z-[40]">
        <CloudVeil progress={veil} mx={mx} my={my} still={false} />
      </motion.div>

      {/* Each rush sits between the scene it leaves and the one it reveals. */}
      {/* The first set is out there from the start, behind the opening bank;
          the second slips in while the first covers the screen. */}
      <Rush progress={p} range={ZOOM_ONE} since={0} className="z-[25]" />
      <Rush progress={p} range={ZOOM_TWO} since={along(ZOOM_ONE, 0.6)} className="z-[15]" />
    </>
  );
}

/**
 * The projects section as one continuous camera move over a pinned stage:
 * clouds part on the headline, the camera flies through it into the three
 * cards (which land as they grow in), then through those onto the closing
 * line, with clouds rushing past the lens on each fly-through. Tabbing into
 * a scene jumps the scroll to where it's framed. Reduced motion stacks the
 * three scenes as plain blocks.
 */
export function ProjectsCamera({ headline, cards, closing }: Content) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    // The shot starts once the stage is half on screen, so the clouds are
    // already parting as it slides up into place.
    offset: [`start ${100 - START_SHOWN * 100}%`, "end end"],
  });
  // Lenis already smooths the wheel, so desktops drive the shot straight from
  // the scroll (which motion can hand to the compositor). Touch scrolling
  // stays native, so phones get a light spring to steady it; the shot is
  // remounted when that choice lands, since transforms bind to their source.
  const springy = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: 0.3, restDelta: 0.0001 });
  const touch = useSyncExternalStore(subscribeCoarse, isCoarse, () => false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 50, damping: 18, mass: 0.6 };
  const mx = useSpring(rawX, spring);
  const my = useSpring(rawY, spring);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  // Keyboard users tabbing into a scene that isn't in front: scroll to it.
  const frame = (scene: number) => () => {
    const el = ref.current;
    if (!el) return;
    const lead = window.innerHeight * START_SHOWN;
    const start = el.getBoundingClientRect().top + window.scrollY - lead;
    const travel = el.offsetHeight - window.innerHeight + lead;
    window.scrollTo({ top: start + travel * HOLD[scene] });
  };

  if (reduce) {
    return (
      <div className="@container relative -mx-4 sm:-mx-5">
        <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 sm:px-5">
          <CloudVeil progress={scrollYProgress} mx={mx} my={my} still />
          <div className="relative z-[3]">{headline}</div>
        </div>
        <div className="flex flex-col items-center px-4 py-16 sm:px-5">
          <Caption count={cards.length} />
          <CardRow cards={cards} />
        </div>
        <div className="flex min-h-[70svh] items-center justify-center px-4 sm:px-5">{closing}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative -mx-4 h-[420svh] sm:-mx-5">
      <div className="@container sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(230,58,38,0.35),transparent_70%)]"
        />
        <Shot
          key={touch ? "touch" : "wheel"}
          p={touch ? springy : scrollYProgress}
          mx={mx}
          my={my}
          frame={frame}
          headline={headline}
          cards={cards}
          closing={closing}
        />
      </div>
    </div>
  );
}
