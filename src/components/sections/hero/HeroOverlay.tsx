"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { introEase } from "@/components/motion/intro";
import {
  HERO_CLOUD,
  HERO_INTRO_CYCLE,
  HERO_INTRO_FRAME,
  HERO_EXIT_START,
  HERO_INTRO_STEP_MS,
  HERO_OVERLAY,
  HERO_SIDE,
} from "@/components/sections/hero/heroIntroCycle";
import {
  peekHeroHandoff,
  takeHeroHandoff,
} from "@/components/sections/hero/heroHandoff";

gsap.registerPlugin(ScrollTrigger);

const CYCLE = HERO_INTRO_CYCLE;
// Temporarily hide the hero backdrop once the intro cycle hands off.
const SHOW_HERO_BG = false;
// Guitar cutout to the right of the figure — hidden for now. Its wrappers stay
// mounted so the handoff, exit and mouse tweens keep their targets.
const SHOW_HERO_SIDE = false;
const STEP_MS = HERO_INTRO_STEP_MS;

export function HeroOverlay() {
  const { phase } = useHeroIntro();
  const reduce = useReducedMotion();
  const [cycleTick, setCycleTick] = useState(0);
  const figureRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const backdropMouseRef = useRef<HTMLDivElement>(null);
  const figureMouseRef = useRef<HTMLDivElement>(null);
  const handoffRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const sideScrollRef = useRef<HTMLDivElement>(null);
  const sideMouseRef = useRef<HTMLDivElement>(null);
  const handoffRectRef = useRef<DOMRect | null>(null);

  const cycling = phase === "loading" || phase === "cycle";
  const zoomed = phase === "zoom" || phase === "text" || phase === "done";
  const imageSrc = reduce || !cycling ? HERO_INTRO_FRAME : CYCLE[cycleTick];
  // When the loader handed its character off, the figure is visible at once
  // and GSAP flies it into place instead of the fade-up entrance.
  const handoff = zoomed && !reduce && peekHeroHandoff() !== null;

  useEffect(() => {
    if (reduce || phase !== "cycle") return;
    const timers: number[] = [];
    for (let i = 1; i < CYCLE.length; i++) {
      timers.push(window.setTimeout(() => setCycleTick(i), i * STEP_MS));
    }
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [phase, reduce]);

  // After the navbar hold, the figure exits to the left and the side cutout
  // to the right over one screen of scroll, before Intro stacks over the
  // hero. Scroll-only wrappers keep these tweens off the intro/mouse ones.
  useEffect(() => {
    const el = figureRef.current;
    const side = sideScrollRef.current;
    if (!el || !side || reduce) return;
    const ctx = gsap.context(() => {
      const scrollTrigger = {
        start: () => window.innerHeight * HERO_EXIT_START,
        end: () => window.innerHeight * (HERO_EXIT_START + 1),
        scrub: true,
        invalidateOnRefresh: true,
      };
      gsap.fromTo(
        el,
        { x: 0, rotate: 0 },
        {
          x: () => -window.innerWidth,
          rotate: -8,
          ease: "power1.in",
          scrollTrigger,
        },
      );
      gsap.fromTo(
        side,
        { x: 0, rotate: 0 },
        {
          x: () => window.innerWidth * 0.6,
          rotate: 14,
          ease: "power1.in",
          scrollTrigger,
        },
      );
    });
    return () => ctx.revert();
  }, [reduce]);

  // Intro timeline: FLIP the figure from the loader's character rect to its
  // drawn rect here, and only once it lands bring the backdrop in behind it.
  // The img is object-contain + bottom-aligned inside the lower 82% of the
  // wrapper, so its drawn rect is derived from the image's aspect ratio. The
  // rect is kept in a ref so a Strict Mode effect re-run can replay it.
  useLayoutEffect(() => {
    const el = handoffRef.current;
    const reveal = revealRef.current;
    const side = sideRef.current;
    const cloud = cloudRef.current;
    if (!zoomed || !el || !reveal || !side || !cloud || reduce) return;
    const from = handoffRectRef.current ?? takeHeroHandoff();
    if (!from) return;
    handoffRectRef.current = from;

    const box = el.getBoundingClientRect();
    const boxH = box.height * 0.82;
    const fit = Math.min(box.width / 1445, boxH / 1089);
    const w = 1445 * fit;
    const h = 1089 * fit;
    const left = box.left + (box.width - w) / 2;
    const top = box.bottom - h;

    const tl = gsap.timeline({
      onComplete: () => {
        handoffRectRef.current = null;
      },
    });
    tl.set([reveal, side, cloud], { opacity: 0 })
      .fromTo(
        el,
        {
          x: from.left - left,
          y: from.top - top,
          scale: from.width / w,
          transformOrigin: `${left - box.left}px ${top - box.top}px`,
        },
        { x: 0, y: 0, scale: 1, duration: 1.15, ease: "power3.inOut" },
      )
      .fromTo(
        reveal,
        { opacity: 0, scale: 1.12 },
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
        "-=0.1",
      )
      .fromTo(
        cloud,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
        "-=0.9",
      )
      .fromTo(
        side,
        { opacity: 0, y: 60, rotate: -10 },
        { opacity: 1, y: 0, rotate: 0, duration: 1, ease: "power3.out" },
        "-=0.55",
      );

    return () => {
      tl.kill();
      gsap.set([el, reveal, side, cloud], { clearProps: "opacity,transform" });
    };
  }, [zoomed, reduce]);

  // Mouse parallax: backdrop drifts against the cursor, the figure follows it
  // further, so the two layers separate in depth. Mouse wrappers are separate
  // from the scroll-driven ones so the tweens never fight over `y`.
  useEffect(() => {
    const bg = backdropMouseRef.current;
    const fig = figureMouseRef.current;
    const side = sideMouseRef.current;
    if (!bg || !fig || !side || reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    gsap.set(bg, { scale: 1.06 });
    gsap.set(fig, { transformPerspective: 1200 });
    const opts = { duration: 1.1, ease: "power3.out" };
    const bgX = gsap.quickTo(bg, "x", opts);
    const bgY = gsap.quickTo(bg, "y", opts);
    const figX = gsap.quickTo(fig, "x", opts);
    const figY = gsap.quickTo(fig, "y", opts);
    const figR = gsap.quickTo(fig, "rotationY", opts);
    const sideX = gsap.quickTo(side, "x", opts);
    const sideY = gsap.quickTo(side, "y", opts);

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      bgX(nx * -28);
      bgY(ny * -18);
      figX(nx * 36);
      figY(ny * 20);
      figR(nx * 6);
      sideX(nx * 22);
      sideY(ny * 14);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf([bg, fig, side]);
      gsap.set([bg, fig, side], { clearProps: "transform" });
    };
  }, [reduce]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      <div
        ref={revealRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          initial={
            reduce
              ? { width: "100%", height: "100%", borderRadius: 0 }
              : {
                  width: "min(340px, 62vw)",
                  height: "min(200px, 36vh)",
                  borderRadius: 10,
                }
          }
          animate={
            zoomed || reduce
              ? { width: "100%", height: "100%", borderRadius: 0 }
              : {
                  width: "min(340px, 62vw)",
                  height: "min(200px, 36vh)",
                  borderRadius: 10,
                }
          }
          transition={{
            duration: reduce ? 0 : 0.9,
            ease: introEase,
          }}
          className="relative overflow-hidden bg-transparent will-change-[width,height]"
        >
          <div
            ref={backdropRef}
            className="absolute inset-0 origin-top will-change-transform"
          >
            <div
              ref={backdropMouseRef}
              className="absolute inset-0 will-change-transform"
            >
              <AnimatePresence mode="sync" initial={false}>
                {(SHOW_HERO_BG || (cycling && !reduce)) && (
                  <motion.img
                    key={imageSrc}
                    src={imageSrc}
                    alt=""
                    draggable={false}
                    initial={
                      reduce
                        ? { opacity: 1, scale: 1 }
                        : cycling
                          ? { opacity: 0, scale: 1.08 }
                          : { opacity: 1, scale: 1 }
                    }
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{
                      opacity: {
                        duration: cycling ? 0.18 : 0.4,
                        ease: introEase,
                      },
                      scale: {
                        duration: cycling ? 0.5 : 0.9,
                        ease: introEase,
                      },
                    }}
                    className={`absolute inset-0 h-full w-full bg-transparent select-none [backface-visibility:hidden] ${
                      cycling && !reduce
                        ? "object-contain object-bottom"
                        : "object-cover"
                    }`}
                    decoding="async"
                    fetchPriority="high"
                    width={1672}
                    height={941}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Stacked above the figure so the guitar paints in front of it. */}
      <div
        ref={sideScrollRef}
        className="absolute inset-0 z-[1] will-change-transform"
      >
        <div
          ref={sideRef}
          className="absolute top-[52%] left-3/4 w-[clamp(10rem,min(19vw,32svh),20rem)] -translate-x-1/2 -translate-y-1/2"
        >
          <div ref={sideMouseRef} className="will-change-transform">
            {SHOW_HERO_SIDE && (
            <a
              href="/resume"
              target="_blank"
              rel="noopener"
              aria-label="Open résumé in a new tab"
              className="group pointer-events-auto relative block cursor-pointer"
            >
            <motion.img
              src={HERO_SIDE}
              alt=""
              draggable={false}
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              animate={
                zoomed || reduce
                  ? {
                      opacity: 1,
                      y: reduce ? 0 : [0, -16, 0],
                      rotate: reduce ? -10 : [-12, -8, -12],
                    }
                  : { opacity: 0 }
              }
              transition={{
                opacity: {
                  duration: reduce || handoff ? 0 : 0.9,
                  ease: introEase,
                },
                y: { duration: 5, ease: "easeInOut", repeat: Infinity },
                rotate: { duration: 5, ease: "easeInOut", repeat: Infinity },
              }}
              className="block h-auto w-full select-none will-change-transform drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]"
              decoding="async"
              width={768}
              height={1365}
            />
              <span
                style={{ color: "#6b1414" }}
                className="pointer-events-none absolute top-1/2 left-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 scale-50 items-center justify-center rounded-full bg-white font-sans text-[13px] font-semibold tracking-[0.08em] uppercase opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
              >
                Resume ↗
              </span>
            </a>
            )}
          </div>
        </div>
      </div>
      <div
        ref={figureRef}
        className="absolute inset-0 origin-bottom will-change-transform"
      >
        <div
          ref={figureMouseRef}
          className="absolute inset-0 will-change-transform"
        >
          {/* Big cloud centered behind the figure: drifts on its own slower
              beat so the figure reads as floating in front of it. Exits left
              with the figure. */}
          <div ref={cloudRef} className="absolute inset-0">
            <motion.img
              src={HERO_CLOUD}
              alt=""
              draggable={false}
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              animate={
                zoomed || reduce
                  ? { opacity: 1, y: reduce ? 0 : [0, -9, 0] }
                  : { opacity: 0 }
              }
              transition={{
                opacity: {
                  duration: reduce || handoff ? 0 : 0.9,
                  ease: introEase,
                  delay: reduce || handoff ? 0 : 0.45,
                },
                y: { duration: 7.5, ease: "easeInOut", repeat: Infinity, delay: 0.8 },
              }}
              className="absolute top-1/2 left-1/2 h-auto w-[clamp(24rem,92vw,84rem)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none will-change-transform"
              decoding="async"
              width={1024}
              height={1024}
            />
          </div>
          <motion.div
            className="absolute inset-0 will-change-transform"
            animate={
              zoomed && !reduce
                ? { y: [0, -12, 0], rotate: [0, -0.6, 0] }
                : { y: 0, rotate: 0 }
            }
            transition={
              zoomed && !reduce
                ? {
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 1.2,
                  }
                : { duration: 0 }
            }
          >
            <div
              ref={handoffRef}
              className="absolute inset-0 will-change-transform"
            >
              <motion.img
                src={HERO_OVERLAY}
                alt=""
                draggable={false}
                initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                animate={
                  zoomed || reduce
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 40 }
                }
                transition={{
                  duration: reduce || handoff ? 0 : 0.9,
                  ease: introEase,
                  delay: reduce || handoff ? 0 : 0.25,
                }}
                className="absolute inset-x-0 bottom-0 h-[82%] w-full object-contain object-bottom select-none"
                decoding="async"
                width={1445}
                height={1089}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
