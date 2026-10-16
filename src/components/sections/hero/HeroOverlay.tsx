"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroFigureReveal } from "@/components/sections/hero/HeroFigureReveal";
import { Laptop, laptopPose } from "@/components/sections/hero/Laptop";
import { aboutGallery } from "@/components/sections/hero/screenFeed";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { introEase } from "@/lib/motion";
import {
  EXIT_FIGURES,
  EXIT_LAPTOP,
  FEED,
  HERO_FIGURE,
  HERO_FIGURE_HEIGHT,
  HERO_FIGURE_LIFT_CLASS,
  HERO_FIGURE_URL,
  HERO_MARBLE_URL,
  HERO_SEAT_CLOUD,
  HERO_SEAT_CLOUD_URL,
  exitAt,
} from "@/lib/hero";

gsap.registerPlugin(ScrollTrigger);

// How much further than the character the cloud travels, as a share of the
// character's move: its scroll drift and the cursor parallax both use it.
const CLOUD_LEAD = 0.12;
/** Scale the figure eases back to as the laptop comes forward. */
const FIGURE_SETTLE = 0.86;
/** How far the figure drifts left meanwhile, as a share of the stage width. */
const FIGURE_SHIFT = 0.04;

/** How asleep the laptop's screen looks at rest: blur (px) and brightness. */
const SCREEN_BLUR = 1.5;
const SCREEN_DIM = 0.72;
/** The final zoom carries the screen a touch past the stage's edges, so no
    sliver of bezel shows at the sides before the screen spills out. */
const ZOOM_OVERSHOOT = 1.06;
/** The framed shot the laptop holds while its screen plays the About pages:
    the screen's width as a share of the stage's, and its centre's height. */
const FRAME = { width: 0.76, y: 0.49 };

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
const zoomEase = gsap.parseEase("power2.inOut");

type Point = { x: number; y: number };
type Homography = [number, number, number, number, number, number, number, number];

// Projective map from a w×h rectangle onto a quad (TL, TR, BR, BL): the
// unit-square-to-quad solution (Heckbert), rescaled to the rectangle.
function homography(w: number, h: number, [p0, p1, p2, p3]: Point[]): Homography {
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const dy3 = p0.y - p1.y + p2.y - p3.y;
  const det = dx1 * dy2 - dx2 * dy1 || 1e-9;
  const g = (dx3 * dy2 - dx2 * dy3) / det;
  const k = (dx1 * dy3 - dx3 * dy1) / det;
  return [
    (p1.x - p0.x + g * p1.x) / w,
    (p3.x - p0.x + k * p3.x) / h,
    p0.x,
    (p1.y - p0.y + g * p1.y) / w,
    (p3.y - p0.y + k * p3.y) / h,
    p0.y,
    g / w,
    k / h,
  ];
}

function project([a, b, c, d, e, f, g, k]: Homography, x: number, y: number): Point {
  const z = g * x + k * y + 1;
  return { x: (a * x + b * y + c) / z, y: (d * x + e * y + f) / z };
}

// Column-major CSS matrix3d for a 2D homography (origin at top-left).
const toMatrix3d = ([a, b, c, d, e, f, g, k]: Homography) =>
  `matrix3d(${[a, d, 0, g, b, e, 0, k, 0, 0, 1, 0, c, f, 0, 1].map((n) => +n.toFixed(8)).join(",")})`;

type Props = {
  /** Shown live on the laptop's screen, then zoomed into full view. */
  screen: React.ReactNode;
};

export function HeroOverlay({ screen }: Props) {
  const { phase } = useHeroIntro();
  const reduce = useReducedMotion();
  const figureRef = useRef<HTMLDivElement>(null);
  const figureMouseRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const cloudMouseRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const sideScrollRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const screenLayerRef = useRef<HTMLDivElement>(null);
  const screenInnerRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const cornerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const sideLinkRef = useRef<HTMLAnchorElement>(null);
  const sideBadgeRef = useRef<HTMLSpanElement>(null);

  const zoomed = phase === "zoom" || phase === "text" || phase === "done";

  // As the laptop comes forward the figure (whose reaching hand presents
  // it) eases back a little, shrinking toward his feet and drifting a touch
  // to the left, and his cloud slides a little further left with a slight
  // tilt, so the pair give way to the laptop without leaving the stage.
  // Scroll-only wrappers keep these tweens off the intro/mouse ones.
  useEffect(() => {
    const el = figureRef.current;
    const cloud = cloudRef.current;
    if (!el || !cloud || reduce) return;
    const ctx = gsap.context(() => {
      const scrollTrigger = {
        start: () => exitAt(EXIT_FIGURES[0]),
        end: () => exitAt(EXIT_FIGURES[1]),
        scrub: true,
        invalidateOnRefresh: true,
      };
      gsap.fromTo(
        el,
        { scale: 1, x: 0 },
        {
          scale: FIGURE_SETTLE,
          x: () => -window.innerWidth * FIGURE_SHIFT,
          ease: "power1.inOut",
          scrollTrigger,
        },
      );
      gsap.fromTo(
        cloud,
        { x: 0, rotate: 0 },
        {
          x: () => -window.innerWidth * FIGURE_SHIFT * (1 + CLOUD_LEAD) * 1.5,
          rotate: -2,
          ease: "power1.inOut",
          scrollTrigger,
        },
      );
    });
    return () => ctx.revert();
  }, [reduce]);

  // The laptop's screen is a live window onto the About pages. Every frame
  // they are mapped in perspective onto the glass's four corners (read back
  // from the DOM, so the 3D pose, entrance spring and zoom all carry them
  // along) and clipped to them. On scroll the laptop turns to face the
  // viewer and glides in until it is framed large in the centre; it holds
  // there while the screen plays the pages (a beat on the About-me poster,
  // a scroll up to the About section, its gallery sliding by); then the
  // display zooms out to fill the stage as the frame falls away, and the
  // stage releases into Projects.
  useEffect(() => {
    const root = rootRef.current;
    const side = sideScrollRef.current;
    const sideIntro = sideRef.current;
    const link = sideLinkRef.current;
    const laptop = laptopRef.current;
    const body = bodyRef.current;
    const lid = lidRef.current;
    const screenEl = screenRef.current;
    const layer = screenLayerRef.current;
    const inner = screenInnerRef.current;
    const feed = feedRef.current;
    const corners = cornerRefs.current;
    if (
      !root || !side || !sideIntro || !link || !laptop || !body || !lid || !screenEl || !layer ||
      !inner || !feed || corners.length < 4 || corners.some((c) => !c)
    ) {
      return;
    }

    // The screen matches the stage's shape (within laptop-like limits), so
    // at full zoom it covers the stage exactly.
    const sizeScreen = () => {
      const aspect = Math.min(Math.max(window.innerWidth / window.innerHeight, 1.3), 1.8);
      root.style.setProperty("--screen-aspect", aspect.toFixed(3));
    };
    sizeScreen();
    window.addEventListener("resize", sizeScreen);

    // The run after the exit: the feed's beats plus the gallery's travel.
    // The pin's spacer grows to match (--feed-extra), before each refresh
    // measures the page.
    const H = () => window.innerHeight;
    const slideLength = () => aboutGallery.distance?.() ?? 0;
    const feedLength = () => (FEED.hold + FEED.rise + FEED.spill) * H() + slideLength();
    const sizeSpacer = () => {
      document.documentElement.style.setProperty("--feed-extra", `${Math.round(feedLength())}px`);
    };
    sizeSpacer();
    ScrollTrigger.addEventListener("refreshInit", sizeSpacer);

    const st = ScrollTrigger.create({
      start: () => exitAt(0),
      end: () => exitAt(1) + feedLength(),
      invalidateOnRefresh: true,
    });
    // Let everything below (Projects' scroll effects too) re-measure now
    // that the spacer is its full length.
    ScrollTrigger.refresh();
    window.dispatchEvent(new Event("resize"));

    // Where the screen sits once faced front-on, and the moves that frame
    // it and later fill the stage with it. Measured with the pose and zoom
    // cleared, fresh on every zooming frame: the zoom multiplies any error
    // several times over, so a stale reading (taken while the entrance was
    // still settling, say) would throw the framed shot well off centre.
    type Shot = { scale: number; dx: number; dy: number };
    let target: { cx: number; cy: number; frame: Shot; full: Shot } | null = null;
    const measure = () => {
      const saved = [side, body, lid].map((el) => el.style.transform);
      for (const el of [side, body, lid]) el.style.transform = "none";
      const r = screenEl.getBoundingClientRect();
      const o = root.getBoundingClientRect();
      [side, body, lid].forEach((el, i) => (el.style.transform = saved[i]));
      const cx = r.left + r.width / 2 - o.left;
      const cy = r.top + r.height / 2 - o.top;
      const dx = o.width / 2 - cx;
      return {
        cx,
        cy,
        frame: { scale: (o.width * FRAME.width) / screenEl.offsetWidth, dx, dy: o.height * FRAME.y - cy },
        full: { scale: (o.width / screenEl.offsetWidth) * ZOOM_OVERSHOOT, dx, dy: o.height / 2 - cy },
      };
    };
    let lastKey = "";
    let settled = false;

    const update = () => {
      const p = Math.max(st.scroll() - st.start, 0);
      // Past the end the stage has released; hold the final frame.
      const done = p >= st.end - st.start;
      if (done && settled) return;
      settled = done;
      const vh = H();
      const exit = exitAt(1) - exitAt(0);
      const zoom = clamp01((p / exit - EXIT_LAPTOP[0]) / (EXIT_LAPTOP[1] - EXIT_LAPTOP[0]));
      const after = p - exit;
      const hold = FEED.hold * vh;
      const riseLen = FEED.rise * vh;
      const slideLen = slideLength();
      const rise = clamp01((after - hold) / riseLen);
      const slide = slideLen ? clamp01((after - hold - riseLen) / slideLen) : after >= hold + riseLen ? 1 : 0;
      const spill = clamp01((after - hold - riseLen - slideLen) / (FEED.spill * vh));

      const key = `${zoom}|${spill}`;
      if (key !== lastKey || zoom > 0) {
        lastKey = key;
        // The laptop turns to face the viewer over the first half of the
        // zoom, so the screen is square-on before it is framed.
        const pose = laptopPose(1 - zoomEase(clamp01(zoom / 0.55)));
        body.style.transform = pose.body;
        lid.style.transform = pose.lid;
        if (zoom === 0) {
          target = null;
          gsap.set(side, { x: 0, y: 0, scale: 1 });
        } else {
          target = measure();
          const { frame, full } = target;
          const e = zoomEase(zoom);
          const f = zoomEase(spill);
          // Set directly: GSAP would compensate x/y for a moved origin.
          side.style.transformOrigin = `${target.cx}px ${target.cy}px`;
          gsap.set(side, {
            x: frame.dx * e,
            y: frame.dy * e + (full.dy - frame.dy) * f,
            // Geometric, so each zoom feels even rather than rushing at the end.
            scale: frame.scale ** e * (full.scale / frame.scale) ** f,
          });
        }
        // Once the laptop leaves its corner it is a stage, not a link.
        link.style.pointerEvents = zoom > 0 ? "none" : "";
      }
      // The frame falls away as the display spills out to the stage.
      side.style.opacity = String(1 - spill);
      side.style.visibility = spill >= 1 ? "hidden" : "";

      // The feed: pages scroll up the screen, then the gallery slides.
      feed.style.transform = `translate3d(0,${(-rise * vh).toFixed(1)}px,0)`;
      aboutGallery.set?.(slide);

      const o = root.getBoundingClientRect();
      const quad = corners.map((c) => {
        const r = c!.getBoundingClientRect();
        return { x: r.left - o.left, y: r.top - o.top };
      });
      const W = o.width;
      const SH = o.height;
      const lw = screenEl.offsetWidth;
      const lh = screenEl.offsetHeight;
      if (!lw || !lh || !W || !SH) return;

      // Pages → glass. In the glass's own flat box the stage-sized page is
      // centred, fitting whole at rest (a tall phone stage shows as a
      // miniature with red bands either side) and easing to the glass's
      // width as it zooms. Its corners there are projected through the
      // glass's perspective, then blended out to the stage's corners as the
      // display spills.
      const fit = Math.min(lw / W, lh / SH);
      const s = fit + (lw / W - fit) * zoomEase(zoom);
      const glass = homography(lw, lh, quad);
      const stage = [
        { x: 0, y: 0 },
        { x: W, y: 0 },
        { x: W, y: SH },
        { x: 0, y: SH },
      ];
      const page = stage.map((pt, i) => {
        const at = project(glass, lw / 2 + (pt.x - W / 2) * s, lh / 2 + (pt.y - SH / 2) * s);
        return { x: at.x + (stage[i].x - at.x) * spill, y: at.y + (stage[i].y - at.y) * spill };
      });
      inner.style.transform = toMatrix3d(homography(W, SH, page));

      // Clip to the glass, opening out to the full stage.
      layer.style.clipPath =
        spill >= 1
          ? "none"
          : `polygon(${quad
              .map((pt, i) => `${(pt.x + (stage[i].x - pt.x) * spill).toFixed(1)}px ${(pt.y + (stage[i].y - pt.y) * spill).toFixed(1)}px`)
              .join(",")})`;

      // The screen fades in and out with the laptop's own entrance.
      const shown =
        Number(getComputedStyle(sideIntro).opacity) * Number(getComputedStyle(laptop).opacity);
      layer.style.opacity = String(Math.max(shown, spill));
      // At rest the screen is asleep: blurred and dim, so it only hints at
      // what's on it. It wakes, sharp and bright, as the laptop turns in.
      const wake = zoomEase(clamp01(zoom / 0.6));
      layer.style.filter =
        wake >= 1
          ? "none"
          : `blur(${(SCREEN_BLUR * (1 - wake)).toFixed(2)}px) brightness(${(SCREEN_DIM + (1 - SCREEN_DIM) * wake).toFixed(3)})`;
      // The pages are live once the laptop is framed.
      layer.style.pointerEvents = zoom >= 1 ? "auto" : "none";
    };

    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("resize", sizeScreen);
      ScrollTrigger.removeEventListener("refreshInit", sizeSpacer);
      st.kill();
      link.style.pointerEvents = "";
      gsap.set(side, { clearProps: "transform,transformOrigin,opacity,visibility" });
    };
  }, [reduce]);

  // Mouse parallax: the figure and its cloud follow the cursor. Mouse
  // wrappers are separate from the scroll-driven ones so the tweens never
  // fight over `y`.
  useEffect(() => {
    const fig = figureMouseRef.current;
    const cloud = cloudMouseRef.current;
    if (!fig || !cloud || reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    gsap.set(fig, { transformPerspective: 1200 });
    const opts = { duration: 1.1, ease: "power3.out" };
    const figX = gsap.quickTo(fig, "x", opts);
    const figY = gsap.quickTo(fig, "y", opts);
    const figR = gsap.quickTo(fig, "rotationY", opts);
    const cloudX = gsap.quickTo(cloud, "x", opts);
    const cloudY = gsap.quickTo(cloud, "y", opts);

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      figX(nx * 36);
      figY(ny * 20);
      figR(nx * 6);
      cloudX(nx * 36 * (1 + CLOUD_LEAD));
      cloudY(ny * 20 * (1 + CLOUD_LEAD));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf([fig, cloud]);
      gsap.set([fig, cloud], { clearProps: "transform" });
    };
  }, [reduce]);

  // The "Resume" badge stands in for the cursor over the laptop: it snaps to
  // the pointer on enter and trails it while hovering. Position is in the
  // link's own box, so ancestor parallax/translate don't skew it.
  useEffect(() => {
    const link = sideLinkRef.current;
    const badge = sideBadgeRef.current;
    if (!link || !badge) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Centre the badge on the pointer via GSAP's own percent offsets.
    gsap.set(badge, { xPercent: -50, yPercent: -50 });
    const opts = { duration: 0.35, ease: "power3.out" };
    const toX = gsap.quickTo(badge, "x", opts);
    const toY = gsap.quickTo(badge, "y", opts);
    const local = (e: PointerEvent) => {
      const r = link.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onEnter = (e: PointerEvent) => {
      const { x, y } = local(e);
      gsap.set(badge, { x, y });
    };
    const onMove = (e: PointerEvent) => {
      const { x, y } = local(e);
      toX(x);
      toY(y);
    };

    link.addEventListener("pointerenter", onEnter);
    link.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      link.removeEventListener("pointerenter", onEnter);
      link.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(badge);
      gsap.set(badge, { clearProps: "transform" });
    };
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-[5] [--screen-aspect:1.6]">
      {/* The About-me poster, mapped onto the laptop's screen each frame
          (see the zoom effect). Above the figure and cloud so they never
          show through the glass, below the laptop's frame. */}
      <div
        ref={screenLayerRef}
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden bg-brand"
      >
        <div ref={screenInnerRef} className="absolute inset-0 origin-top-left overflow-hidden">
          {/* The pages, stacked; the feed scrolls them up the screen. */}
          <div ref={feedRef} className="absolute inset-x-0 top-0 will-change-transform">
            {screen}
          </div>
        </div>
      </div>
      {/* Stacked above the figure and the screen layer. */}
      <div
        ref={sideScrollRef}
        // No will-change: the zoom scales this up several times, and a
        // promoted layer would stay rastered at its small resting size.
        className="absolute inset-0 z-[1]"
      >
        {/* Laptop anchors by its top edge at 36% down the hero; centering
            lives on the CSS-only child below so it never mixes with the
            transforms GSAP writes to the wrappers. */}
        <div
          ref={sideRef}
          className="absolute top-[36%] left-[76%] w-[clamp(10rem,min(18vw,30svh),18rem)] max-md:top-[13%] max-md:left-[74%] max-md:w-[8rem]"
        >
          <div className="-translate-x-1/2">
            <a
              ref={sideLinkRef}
              href="/resume"
              target="_blank"
              rel="noopener"
              aria-label="Open résumé in a new tab"
              className="group pointer-events-auto relative block cursor-pointer [@media(pointer:fine)]:cursor-none"
            >
              <motion.div
                ref={laptopRef}
                initial={reduce ? { opacity: 1 } : { opacity: 0, x: 160, y: 40 }}
                animate={
                  zoomed || reduce
                    ? { opacity: 1, x: 0, y: 0 }
                    : { opacity: 0, x: 160, y: 40 }
                }
                // Last of the cast: glides in from the right and settles.
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        opacity: { duration: 0.5, delay: 1.05, ease: introEase },
                        x: { type: "spring", stiffness: 70, damping: 15, delay: 1.05 },
                        y: { type: "spring", stiffness: 60, damping: 11, delay: 1.05 },
                      }
                }
                className="relative"
              >
                <Laptop screenRef={screenRef} cornerRefs={cornerRefs} bodyRef={bodyRef} lidRef={lidRef} />
              </motion.div>
              {/* Outer span is GSAP's: it only carries the cursor position.
                  Inner span is CSS's: fade/pop on hover. Kept apart because
                  GSAP bakes Tailwind's `scale`/`translate` into its own
                  transform the first time it writes to an element. */}
              <span
                ref={sideBadgeRef}
                className="pointer-events-none absolute top-0 left-0 z-[1]"
              >
                <span
                  className="flex size-24 scale-50 items-center justify-center rounded-full bg-cream text-brand font-sans text-[13px] font-semibold tracking-[0.08em] uppercase opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                >
                  Resume ↗
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
      {/* Big cloud at the back of the figure stack: exits left just ahead
          of the character. */}
          <div ref={cloudRef} className="absolute inset-0 origin-bottom will-change-transform">
            <div ref={cloudMouseRef} className="absolute inset-0 will-change-transform">
            <motion.img
              src={HERO_SEAT_CLOUD_URL}
              alt=""
              draggable={false}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 110, scale: 0.86 }}
              animate={
                zoomed || reduce
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 110, scale: 0.86 }
              }
              // Rises into place as the gates part, ready for the figure.
              transition={{
                duration: reduce ? 0 : 1.1,
                ease: [0.16, 1, 0.3, 1],
                delay: reduce ? 0 : 0.55,
              }}
              className="absolute top-1/2 left-1/2 h-auto w-[clamp(24rem,92vw,84rem)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none will-change-transform max-md:top-auto max-md:bottom-[calc(32%+46vw)] max-md:w-[170vw] max-md:translate-y-1/2"
              decoding="async"
              width={HERO_SEAT_CLOUD.width}
              height={HERO_SEAT_CLOUD.height}
            />
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
              className={`absolute inset-0 will-change-transform ${HERO_FIGURE_LIFT_CLASS}`}
            >
              <motion.div
                initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: "-55%", rotate: -5 }}
                animate={
                  zoomed || reduce
                    ? { opacity: 1, y: 0, rotate: 0 }
                    : { opacity: 0, y: "-55%", rotate: -5 }
                }
                // Descends from above and lands on the cloud with a soft
                // spring, as if settling its weight.
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        opacity: { duration: 0.45, delay: 0.75, ease: introEase },
                        y: { type: "spring", stiffness: 55, damping: 12, mass: 1.1, delay: 0.75 },
                        rotate: { type: "spring", stiffness: 55, damping: 12, delay: 0.75 },
                      }
                }
                style={{
                  height: `${HERO_FIGURE_HEIGHT * 100}%`,
                  bottom: "calc(var(--hero-lift) * 100%)",
                }}
                className="absolute inset-x-0 w-full"
              >
                {/* Hovering reveals the marble twin under a pixel-rimmed lens. */}
                <HeroFigureReveal
                  base={HERO_FIGURE_URL}
                  reveal={HERO_MARBLE_URL}
                  width={HERO_FIGURE.width}
                  height={HERO_FIGURE.height}
                  reduce={!!reduce}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
