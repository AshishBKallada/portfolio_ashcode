"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useState } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { useInTrack } from "@/components/motion/HorizontalTrack";
import { site } from "@/data/site";
import { FlowPicture } from "./FlowPicture";
import { HeroHelmet } from "./HeroHelmet";

/** The samurai, cut out of his white ground (Photoroom), ink splatters kept, 736 × 890. */
const SAMURAI = {
  src: "/images/hero/hero-samurai.webp",
  /** R = sash and hem, G = braids (scripts/blender/make_samurai_flow.py). */
  flow: "/images/hero/hero-samurai-flow.png",
  width: 736,
  height: 890,
};

/**
 * Who stands on the right: the 3D cyber-samurai helmet (HeroHelmet), or the 2D samurai
 * picture with its floating cloth (FlowPicture). Flip to "samurai" to bring him back.
 */
const FIGURE: "helmet" | "samurai" = "helmet";
/** The figure's box: its shape, its height, and where it sits in the hero. */
const FIGURE_BOX = {
  helmet: {
    aspect: "1 / 1",
    height: "h-[min(80vh,64vw)]",
    place: "right-[1vw] bottom-[4vh]",
    origin: "50% 30%",
  },
  samurai: {
    aspect: `${736} / ${890}`,
    height: "h-[min(78vh,100vw)]",
    place: "right-[5vw] bottom-[-2vh]",
    origin: "50% 0%",
  },
}[FIGURE];

const WORD = "ASHCODE";
/** How long the scene waits before it rises in (there is no loader on this branch). */
const SCENE_DELAY = 0.15;
/**
 * The entrance, slow, in beats (s, after SCENE_DELAY): the giant kanji stamp down one after
 * the other; the samurai rises from below, huge and centred, up to his waist; holds; then
 * zooms out to his place on the right as the name rises behind him; the small Japanese last.
 */
const BEAT = {
  stamp1: 0.15,
  stamp2: 0.75,
  rise: 1.5,
  word: 4.1,
  kana: 4.9,
  line: 5.3,
};
/** The samurai's run: rise, hold, zoom out, as shares of its length (s). */
const RUN = { length: 4.4, risen: 0.3, held: 0.48 };
/** How big he stands at first, from the top of his head (so only the top half shows). */
const CLOSE = 2.3;
const settle = [0.16, 1, 0.3, 1] as const;

/**
 * The opener on the red branch: plain brand red, the name set huge and dead centre in white,
 * a few Japanese characters in white just above its left end, and the samurai standing on the
 * right in front of the name, his sash and braids floating.
 */
export function SkyHero() {
  const reduce = useReducedMotion() ?? false;
  const { phase } = useHeroIntro();
  const ready = reduce || phase !== "loading";

  const { scrollY } = useScroll();
  // The name and the Japanese drift up a little as the page scrolls.
  const wordY = useTransform(scrollY, (y) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return Math.min(1, Math.max(0, y / vh)) * -60;
  });
  // Sideways, the hero's layers lag the row by depth as it slides off: the name most (it
  // seems furthest), the Japanese a little less, the samurai least (nearest). The row
  // moves 1px left per px scrolled, so each lag is a share of the scroll, up to a screen.
  const across = useInTrack();
  const off = (y: number) =>
    across
      ? Math.min(
          Math.max(0, y),
          typeof window !== "undefined" ? window.innerWidth : 1280,
        )
      : 0;

  // The pointer, -1 to 1 across the screen, sprung: every layer's hover shift reads it.
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

  // The floating sash and braids are for wide screens; phones get the still picture.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Hover parallax, by depth: the deepest layer (the giant kanji) runs against the pointer,
  // the name a little against it, the small Japanese with it, and the samurai, nearest,
  // furthest with it. Each also keeps its share of the sideways scroll lag.
  const bigX = useTransform(
    [mx, scrollY],
    ([v, y]: number[]) => off(y) * 0.6 + v * -38,
  );
  const bigY = useTransform(my, (v) => v * -26);
  const wordX = useTransform(
    [mx, scrollY],
    ([v, y]: number[]) => off(y) * 0.45 + v * -14,
  );
  const wordHoverY = useTransform(
    [my, wordY],
    ([v, w]: number[]) => w + v * -9,
  );
  const kanaX = useTransform(
    [mx, scrollY],
    ([v, y]: number[]) => off(y) * -0.12 + v * 16,
  );
  const kanaY = useTransform(my, (v) => v * 10);
  const samuraiX = useTransform(
    [mx, scrollY],
    ([v, y]: number[]) => v * 44 + off(y) * 0.18,
  );
  const samuraiY = useTransform(
    [my, wordY],
    ([p, w]: number[]) => p * 26 + w * 0.6,
  );

  // How far left he stands at first to be centred on the screen: his box sits 5vw in from
  // the right; phones centre him anyway. Read when the entrance starts (after mount).
  const centreX = (() => {
    if (!wide || typeof window === "undefined") return 0;
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    if (FIGURE === "helmet") {
      const w = Math.min(vh * 0.8, vw * 0.64);
      return -(vw * 0.49 - w / 2);
    }
    const h = Math.min(vh * 0.78, vw);
    const w = (h * SAMURAI.width) / SAMURAI.height;
    return -(vw * 0.45 - w / 2);
  })();

  // The samurai, cut out of his white ground, standing on the right in front of the name:
  // he rises huge from below, then zooms out to his place, follows the pointer furthest of all and drifts up on scroll.
  // Wide screens: his sash and braids float in the wind (FlowPicture). Phones: the still picture.
  const samurai = (
    <motion.div
      style={reduce ? undefined : { x: samuraiX, y: samuraiY }}
      className={`pointer-events-none absolute ${FIGURE_BOX.place} max-md:right-1/2 max-md:translate-x-1/2`}
    >
      <motion.div
        // He rises from below the screen, huge and centred (his top half only), holds a
        // beat, then zooms out to his place on the right.
        initial={
          reduce ? false : { opacity: 1, scale: CLOSE, x: 0, y: "110vh" }
        }
        animate={
          reduce
            ? undefined
            : ready
              ? {
                  scale: [CLOSE, CLOSE, CLOSE, 1],
                  x: [centreX, centreX, centreX, 0],
                  y: ["110vh", "-6vh", "-6vh", "0vh"],
                }
              : { scale: CLOSE, x: 0, y: "110vh" }
        }
        transition={{
          duration: RUN.length,
          times: [0, RUN.risen, RUN.held, 1],
          ease: [settle, "linear", [0.7, 0, 0.2, 1]],
          delay: SCENE_DELAY + BEAT.rise,
        }}
        style={{
          aspectRatio: FIGURE_BOX.aspect,
          transformOrigin: FIGURE_BOX.origin,
        }}
        className={`relative ${FIGURE_BOX.height}`}
      >
        <div className="absolute inset-0">
          {FIGURE === "helmet" ? (
            <HeroHelmet still={reduce} />
          ) : wide ? (
            <FlowPicture
              src={SAMURAI.src}
              flow={SAMURAI.flow}
              width={SAMURAI.width}
              height={SAMURAI.height}
              amp={0.032}
              hairAmp={0.6}
              still={reduce}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={SAMURAI.src}
              width={SAMURAI.width}
              height={SAMURAI.height}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full select-none"
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  // The name layer: the big name, the small Japanese over it and the line under it.
  const word = (
    <motion.div
      aria-hidden
      style={reduce ? undefined : { x: wordX, y: wordHoverY }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div className="relative">
        {/* Japanese, in white, just above the name's left end: 灰 (ash) and 暗 (of 暗号, code)
                big, and the name in katakana beside them. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 1.2,
            ease: settle,
            delay: reduce ? 0 : SCENE_DELAY + BEAT.kana,
          }}
          style={reduce ? undefined : { x: kanaX, y: kanaY }}
          className="absolute bottom-[calc(100%+1.2vw)] left-[0.6vw] flex items-end gap-[1.4vw] select-none text-white [font-family:var(--font-yuji),'Hiragino_Mincho_ProN','Yu_Mincho',serif]"
        >
          <span className="text-[min(8vw,18vh)] leading-[0.85]">灰暗</span>
          <span className="pb-[0.4vw] text-[min(1.5vw,3.4vh)] leading-none tracking-[0.35em]">
            アッシュコード
          </span>
        </motion.div>

        {/* The name, huge across the red, dead centre: its letters rise in one by one as the loader lifts. */}
        <div className="flex select-none font-display text-[min(27vw,62vh)] leading-[0.8] tracking-[-0.01em] text-white uppercase">
          {WORD.split("").map((ch, i) => (
            <span
              key={i}
              className="relative inline-block overflow-hidden pb-[0.04em]"
            >
              <motion.span
                className="relative inline-block"
                initial={reduce ? false : { y: "140%" }}
                animate={ready ? { y: "0%" } : { y: "140%" }}
                transition={{
                  duration: 1.1,
                  ease: settle,
                  delay: reduce ? 0 : SCENE_DELAY + BEAT.word + i * 0.08,
                }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </div>

        {/* A line of brush Japanese under the name's left end: 灰からコードを,
                  "code, from the ashes". */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 1.2,
            ease: settle,
            delay: reduce ? 0 : SCENE_DELAY + BEAT.line,
          }}
          className="absolute top-[calc(100%+1.6vw)] left-[0.8vw] flex items-center gap-[1vw] text-[min(2.2vw,4.6vh)] leading-none tracking-[0.2em] text-white select-none [font-family:var(--font-yuji),'Hiragino_Mincho_ProN','Yu_Mincho',serif]"
        >
          <span aria-hidden className="h-px w-[3vw] bg-white/70" />
          灰からコードを
        </motion.p>
      </div>
    </motion.div>
  );

  return (
    <>
      <section
        aria-label="Introduction"
        data-nav-theme="dark"
        className="relative h-full w-full overflow-hidden bg-brand text-white"
      >
        <h1 className="sr-only">
          {site.name}: {site.hero.statementMain}
        </h1>
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: settle,
            delay: reduce ? 0 : SCENE_DELAY,
          }}
          className="absolute inset-0 bg-brand"
        >
          {/* Two giant brush kanji behind the name, near-black, the white letters laid across
              their strokes: 灰 (ash) over the left, 暗 (of 暗号, code) behind the right. */}
          <motion.div
            aria-hidden
            style={reduce ? undefined : { x: bigX, y: bigY }}
            className="pointer-events-none absolute inset-0 select-none text-[#1a0604] [font-family:var(--font-yuji),'Hiragino_Mincho_ProN','Yu_Mincho',serif]"
          >
            <motion.span
              // Pressed down like a hanko: big and faint, slammed down past its size, back.
              initial={reduce ? false : { opacity: 0, scale: 1.8 }}
              animate={
                ready
                  ? { opacity: [0, 1, 0.9], scale: [1.8, 0.94, 1] }
                  : { opacity: 0, scale: 1.8 }
              }
              transition={{
                duration: 0.62,
                times: [0, 0.55, 1],
                ease: ["easeIn", "easeOut"],
                delay: reduce ? 0 : SCENE_DELAY + BEAT.stamp1,
              }}
              className="absolute top-[4vh] left-[6vw] block -rotate-6 text-[min(64vh,44vw)] leading-none"
            >
              灰
            </motion.span>
            <motion.span
              // Pressed down like a hanko: big and faint, slammed down past its size, back.
              initial={reduce ? false : { opacity: 0, scale: 1.8 }}
              animate={
                ready
                  ? { opacity: [0, 1, 0.9], scale: [1.8, 0.94, 1] }
                  : { opacity: 0, scale: 1.8 }
              }
              transition={{
                duration: 0.62,
                times: [0, 0.55, 1],
                ease: ["easeIn", "easeOut"],
                delay: reduce ? 0 : SCENE_DELAY + BEAT.stamp2,
              }}
              className="absolute top-[22vh] right-[4vw] block rotate-[5deg] text-[min(70vh,48vw)] leading-none"
            >
              暗
            </motion.span>
          </motion.div>

          {word}

          {samurai}
        </motion.div>
      </section>
    </>
  );
}
