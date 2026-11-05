"use client";

import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ImageTrail } from "@/components/ui/image-trail";
import { optimizedSrc } from "@/lib/images";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/data/site";
import { DropCap } from "./Editions";
import { SectionLines } from "./SectionLines";
import { frame } from "./primitives";

const linkedinUrl = site.socials.find((s) => s.label === "LinkedIn")?.href ?? "";
// Shown small (180×232 in the trail, a quarter of the width in the grid), so served resized, not as the full JPEGs.
const posts = site.signal.linkedin.posts.map((post) => ({
  ...post,
  src: optimizedSrc({ src: post.src, width: 180, height: 232 }, 70),
}));
const contact = site.contactStatement;
/** The courier in flight, marble, reaching left (1376×768), cut out on transparency. */
const FLIGHT_MARBLE = "/images/linkedin/flight-marble.png";
/** The laptop he reaches for, winged and haloed in marble (1088×991). */
const LAPTOP_ANGEL = "/images/linkedin/laptop-angel.png";

/**
 * The flight and the laptop as one piece, after the Creation of Adam: the figure spans
 * the frame, the laptop floats just past his fingertip on its own, out-of-step bob.
 */
function Flight({ sizes, shadow, laptop = true }: { sizes: string; shadow: string; laptop?: boolean }) {
  return (
    // The figure takes the right 86%, the laptop the left 20%: a clear gap opens past the fingertip.
    <div className="relative aspect-[1376/680] w-full">
      <div
        style={{ "--dur": "7s", "--delay": "0s" } as CSSProperties}
        className="kw-float absolute right-0 bottom-0 aspect-[1376/768] w-[86%]"
      >
        <Image src={FLIGHT_MARBLE} alt="" fill sizes={`calc(${sizes} * 0.86)`} className={`object-contain ${shadow}`} />
      </div>
      {laptop && (
        <div
          style={{ "--dur": "5s", "--delay": "-2s" } as CSSProperties}
          className="kw-float absolute top-[30%] left-0 aspect-[1088/991] w-[20%]"
        >
          <Image src={LAPTOP_ANGEL} alt="" fill sizes={`calc(${sizes} * 0.2)`} className={`object-contain ${shadow}`} />
        </div>
      )}
    </div>
  );
}
const [nameA, nameB] = ["Ash", "Code"];
/**
 * The fingertip in the flight frame (1376×680): the figure fills its right 86% and
 * bottom 97%, the tip 15.3% across it and 52% down.
 */
const FINGERTIP = { x: 0.14 + 0.86 * 0.153, y: 0.029 + 0.971 * 0.52 };
/** The near-touch gap left between fingertip and laptop, in px. */
const TOUCH_GAP = 18;
/** Scroll through the stage over which he flies in from the right and reaches the laptop. */
const REACH = [0.08, 0.5] as const;

/*
 * Scroll timeline (0 → 1 over the pinned section, after the posts):
 *   0    – 0.45  The name grows from low on the screen to fill the top.
 *   0.42 – 0.65  Contact fades up under it as it lands. Then a short hold.
 * Kept short, with something always moving, so the pin never reads as the page sticking.
 */
const GROW = [0, 0.45] as const;
const BIO = [0.42, 0.65] as const;

/**
 * Index: the LinkedIn posts as an image trail, each post dropping in under the pointer
 * as it moves (a grid on touch screens), with a link to the profile, in a classical hall;
 * then a pinned stretch where the name grows from the bottom across the top over the
 * contact line and email. Scrolling back reverses it.
 */
export function ListTransition() {
  /** The animated stretch, the whole pinned run of the list → about transition. */
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [view, setView] = useState<"list" | "about">("list");

  // Starts as the panel's top passes mid-screen, so the name is already growing as it
  // arrives under the comments, with no empty beat.
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start 0.5", "end end"],
  });
  useMotionValueEvent(p, "change", (v) => setView(v > 0.42 ? "about" : "list"));

  const nameScale = useTransform(p, [...GROW], [0.32, 1]);
  const nameY = useTransform(p, [...GROW], ["40svh", "0svh"]);
  // Small, the name sits together as one word; it spreads to the edges as it grows.
  const nameSpread = useTransform(p, [...GROW], [0, 1]);
  // A function transform: a plain scroll-linked opacity gets handed to the browser's
  // scroll timeline, which ignores this section's offsets.
  const bioOpacity = useTransform(p, (v) => Math.min(1, Math.max(0, (v - BIO[0]) / (BIO[1] - BIO[0]))));
  const bioY = useTransform(p, [...BIO], [24, 0]);

  const about = view === "about";

  // The LinkedIn stage's depth: scroll carries the lines slowest, the statue a little
  // faster (and a touch nearer), the text fastest; the pointer pushes the statue and
  // the lines the other way, the statue further.
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stage } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  // Hero-matched hover parallax: full -1…1 pointer range, spring, and depth-separated travel.
  const pointerSpring = { stiffness: 62, damping: 16, mass: 0.55 } as const;
  const sx = useSpring(px, pointerSpring);
  const sy = useSpring(py, pointerSpring);
  const linesX = useTransform(sx, (v) => v * -72);
  const linesY = useTransform([stage, sy], ([s, v]: number[]) => (0.5 - s) * 40 + v * -52);
  const statueRotate = useTransform(sx, (v) => v * -3);
  const statueScale = useTransform(stage, [0, 1], [0.94, 1.04]);
  const textX = useTransform(sx, (v) => v * 85);
  const textY = useTransform([stage, sy], ([s, v]: number[]) => (0.5 - s) * 140 + v * 55);
  // The flight: from high off to the right, he dives on the diagonal toward the laptop
  // as the stage scrolls in, easing out so the last stretch slows to a near-touch.
  // `reach` is the measured shift that sets the fingertip TOUCH_GAP off the laptop's
  // keyboard edge; `fly` the run-in on top of it.
  const flightRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLSpanElement>(null);
  const reachX = useMotionValue(0);
  const reachY = useMotionValue(0);
  const fly = useMotionValue(600);
  useEffect(() => {
    const measure = () => {
      const flight = flightRef.current;
      const laptop = laptopRef.current;
      if (!flight || !laptop) return;
      // Layout boxes, with the text layer's parallax shift taken back out.
      const f = flight.getBoundingClientRect();
      const l = laptop.getBoundingClientRect();
      reachX.set(l.left - textX.get() + l.width * 0.93 + TOUCH_GAP - (f.left + f.width * FINGERTIP.x));
      reachY.set(l.top - textY.get() + l.height * 0.55 - (f.top + f.height * FINGERTIP.y));
      fly.set(window.innerWidth * 0.45);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (flightRef.current) ro.observe(flightRef.current);
    if (laptopRef.current) ro.observe(laptopRef.current);
    return () => ro.disconnect();
  }, [reachX, reachY, fly, textX, textY]);
  const run = (s: number) => {
    const t = Math.min(1, Math.max(0, (s - REACH[0]) / (REACH[1] - REACH[0])));
    return 1 - (1 - t) ** 3;
  };
  // Both ride the text layer's scroll and pointer shift, so the gap holds wherever the cursor is.
  const statueX = useTransform([sx, stage, reachX, fly], ([v, s, r, f]: number[]) => r + f * (1 - run(s)) + v * 85);
  const statueY = useTransform([sy, stage, reachY, fly], ([v, s, r, f]: number[]) =>
    r - f * 0.5 * (1 - run(s)) + (0.5 - s) * 140 + v * 55,
  );

  return (
    <section
      id="index-list"
      aria-label="Index"
      // Over Work's cream the rail reads ink, as over the cream title screen and panel.
      data-nav-theme="light"
      className="signal-rail-bleed relative bg-background text-ink"
    >
      {/* The LinkedIn section on plain brand red, cut straight in: no painting, no ripple. */}
      <div
        id="linkedin"
        data-nav-theme="light"
        // The whole section is the pointer's stage: every layer shifts against it, by depth.
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width * 2 - 1);
          py.set((e.clientY - r.top) / r.height * 2 - 1);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
        className="relative z-10 bg-brand text-ink"
      >
        <div ref={stageRef} className="relative md:h-[min(72svh,42rem)]">
          {/* Faint construction lines behind it all, after the hero's: the deepest layer.
              White on the red, whichever theme the navbar switch sets. */}
          <motion.div style={reduce ? undefined : { x: linesX, y: linesY }} className="pointer-events-none absolute inset-0 hidden md:block">
            <SectionLines className="text-white!" />
          </motion.div>
          {/* The courier in marble, centred under the line and bobbing slowly, lifted off the
              red by a warm shadow; the posts fly across in front of him. Rises in as the
              section arrives, then drifts with the scroll and against the pointer. */}
          {/* Set right of centre; on desktop the laptop rides the heading instead, off the N. */}
          <div ref={flightRef} aria-hidden className="pointer-events-none absolute top-0 right-[-6%] z-0 hidden w-[min(90vw,70rem)] md:block">
            <motion.div
              // Scales and turns about the fingertip, so the near-touch holds through both.
              style={
                reduce
                  ? undefined
                  : { x: statueX, y: statueY, scale: statueScale, rotate: statueRotate, originX: FINGERTIP.x, originY: FINGERTIP.y }
              }
              className="w-full"
            >
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <Flight sizes="min(90vw, 70rem)" shadow="drop-shadow-[0_32px_40px_rgba(80,14,0,0.38)]" laptop={false} />
              </motion.div>
            </motion.div>
          </div>
          <div className={`${frame} relative h-full py-8 md:pt-24`}>
            {/* The posts: an image trail on a pointer, a grid on touch screens. */}
            <div className="flex flex-col gap-6 md:absolute md:inset-0 md:block">
              <div className="absolute inset-0 z-10 hidden md:block">
                <ImageTrail images={posts.map((post) => post.src)} imageWidth={180} imageHeight={232} threshold={70} intro />
              </div>
              <ul className="grid grid-cols-4 gap-2 md:hidden">
                {posts.map((post) => (
                  <li key={post.src} className="relative aspect-[4/5] overflow-hidden bg-ink/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.src} alt={post.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </li>
                ))}
              </ul>
              {/* The line and link, centred over the statue, in ink so they read on the red and the marble alike. */}
              {/* The nearest layer: it rises fastest with the scroll. */}
              <motion.div
                style={reduce ? undefined : { x: textX, y: textY }}
                className="pointer-events-none relative z-20 flex flex-col items-start gap-5 md:absolute md:inset-x-0 md:top-[28svh] md:items-center md:text-center md:text-ink"
              >
                {/* The hint, for a pointer only. */}
                <RevealItem delay={0.5} className="hidden md:block">
                  <p className="inline-flex items-center gap-2 font-headline text-[12px] tracking-[0.14em] text-ink/60 uppercase">
                    <span aria-hidden>↔</span> Move your cursor
                  </p>
                </RevealItem>
                <p className="font-headline text-[clamp(2.2rem,4.4vw,4rem)] leading-[0.92] tracking-[-0.045em]">
                  {/* Shrunk to the line, so the laptop sits just off the N's top-left corner. */}
                  <span className="relative inline-block">
                    <span
                      ref={laptopRef}
                      aria-hidden
                      style={{ "--dur": "5s", "--delay": "-2s" } as CSSProperties}
                      className="kw-float absolute right-[94%] bottom-[62%] hidden aspect-[1088/991] w-[clamp(6rem,9vw,9rem)] md:block"
                    >
                      <Image
                        src={LAPTOP_ANGEL}
                        alt=""
                        fill
                        sizes="9rem"
                        className="object-contain drop-shadow-[0_24px_30px_rgba(80,14,0,0.38)]"
                      />
                    </span>
                    <TextReveal text="Notes from the build," className="block" />
                  </span>
                  <TextReveal text="shipped in public." delay={0.2} className="block font-narrative tracking-[-0.04em]" />
                </p>
                <RevealItem delay={0.4}>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-headline text-[15px] tracking-[-0.02em] text-cream transition-colors hover:bg-ink/85"
                >
                  {site.signal.linkedin.cta}
                  <span aria-hidden>↗</span>
                </a>
                </RevealItem>
              </motion.div>
              {/* Phones: the statue under the line, smaller. */}
              <div aria-hidden className="relative mx-auto w-full md:hidden">
                <Flight sizes="100vw" shadow="drop-shadow-[0_24px_30px_rgba(80,14,0,0.38)]" />
              </div>
            </div>
          </div>
        </div>
        {/* The comments (KindWords) are left out for now; they go back in here, under the posts. */}
      </div>
      {/* The pinned stretch: the name grows over the contact line. */}
      <div id="contact-pin" className="relative z-10 h-[150svh]">
        <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0" />
        {/* The panel runs full width; its content clears the top bar. */}
        <div data-nav-theme="light" className="sticky top-0 h-[100svh] overflow-hidden bg-background">
          <div className={`${frame} relative flex h-full flex-col py-8 md:pt-24`}>
            <div className="relative flex-1">
              {/* Contact, under the grown name. */}
              <motion.div
                id="contact-card"
                aria-hidden={!about}
                style={reduce ? { opacity: about ? 1 : 0 } : { opacity: bioOpacity, y: bioY }}
                className={`absolute inset-x-0 top-[clamp(9rem,24vw,21rem)] z-30 mx-auto max-w-[36rem] px-4 ${about ? "pointer-events-auto" : "pointer-events-none"}`}
              >
                <p className="font-headline text-[13px] uppercase tracking-[0.12em] text-ink/50">Contact</p>
                <p className="mt-3 text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.02] tracking-[-0.03em] text-pretty">
                  <DropCap>{`${contact.lines.join(" ")} ${contact.script}.`}</DropCap>
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <a
                    href={`mailto:${site.email}`}
                    tabIndex={about ? 0 : -1}
                    className="font-narrative text-[clamp(1.2rem,1.6vw,1.5rem)] tracking-[-0.03em] underline decoration-ink/25 underline-offset-[0.18em] transition-colors hover:decoration-ink"
                  >
                    {site.email}
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    tabIndex={about ? 0 : -1}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-headline text-[15px] tracking-[-0.02em] text-cream transition-colors hover:bg-ink/85"
                  >
                    {contact.cta}
                    <span aria-hidden>↗</span>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* The name, set at full size and scaled: small along the bottom, full across the top.
                The padding sits outside the scale, so it shrinks toward the content's centre. */}
            <div className="pointer-events-none absolute inset-x-0 top-20 z-0 px-5 sm:px-10 md:top-36">
              <motion.div
                role="img"
                aria-label={site.name}
                style={reduce ? undefined : { scale: nameScale, y: nameY }}
                className="flex origin-top items-baseline justify-center text-[clamp(4rem,15vw,15rem)] leading-[0.8] will-change-transform"
              >
                <span className="font-headline tracking-[-0.05em]">{nameA}</span>
                <motion.span aria-hidden style={reduce ? { flexGrow: 1 } : { flexGrow: nameSpread }} />
                <span className="font-narrative tracking-[-0.04em]">
                  <span className="mr-[-0.06em] font-flourish text-[1.35em] leading-none tracking-normal">{nameB[0]}</span>
                  {nameB.slice(1)}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
