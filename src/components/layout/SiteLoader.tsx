"use client";

import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { metaLabel } from "@/components/signal/primitives";
import { HERO_FIGURE_URL, HERO_SEAT_CLOUD_URL } from "@/lib/hero";

/**
 * Boot sequence, all on one screen:
 *   1. a percentage counter in the centre ramps 0 → 92 while the page, fonts
 *      and hero images load, then snaps to 100, a hairline under it filling in
 *      step and the wordmark and status label framing it;
 *   2. the counter lifts out through its mask, the hairline draws back to its
 *      centre, and "Obsession beats talent" rises in, one line at a time;
 *   3. the lines leave the way they came and the red curtain lifts off the
 *      hero, which starts its own intro underneath.
 * Off the home page, or with reduced motion, only the counter runs and the
 * screen fades out.
 */

// The counter will not pass this until the assets are confirmed.
const RAMP_TO = 92;
const RAMP_S = 1.8;
const FINISH_S = 0.35;
const PHRASE_HOLD_S = 0.7;
// Dismiss even if `load` or `fonts.ready` never resolve (a stalled asset).
const MAX_WAIT_MS = 8000;

const PRELOAD = [HERO_FIGURE_URL, HERO_SEAT_CLOUD_URL];

export function SiteLoader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduce = useReducedMotion();
  const { markLoaded } = useHeroIntro();
  const [mounted, setMounted] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const digitsRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Read at outro time, so a late reduced-motion value never restarts the ramp.
  const reduceRef = useRef(reduce);
  useEffect(() => {
    reduceRef.current = reduce;
  }, [reduce]);

  useEffect(() => {
    const root = rootRef.current;
    const counter = counterRef.current;
    const digits = digitsRef.current;
    const bar = barRef.current;
    const chrome = chromeRef.current;
    const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!root || !counter || !digits || !bar || !chrome) return;

    let cancelled = false;
    let assetsReady = false;
    let rampDone = false;
    let finishing = false;
    let cap = 0;
    const value = { v: 0 };
    const render = () => {
      digits.textContent = String(Math.round(value.v)).padStart(2, "0");
      bar.style.transform = `scaleX(${value.v / 100})`;
    };

    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 135, skewY: 6, visibility: "visible" });

      const outro = () => {
        if (cancelled) return;
        const quick = reduceRef.current || !isHome;
        if (quick) {
          markLoaded();
          gsap.to(root, {
            autoAlpha: 0,
            duration: reduceRef.current ? 0 : 0.4,
            ease: "power2.out",
            onComplete: () => setMounted(false),
          });
          return;
        }

        gsap
          .timeline({ onComplete: () => setMounted(false) })
          // Counter lifts out through its mask; the hairline and its labels
          // draw back to the centre.
          .to(counter, { yPercent: -110, duration: 0.55, ease: "power3.in" })
          .to(bar, { scaleX: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "power3.inOut" }, "<")
          .to(chrome, { autoAlpha: 0, duration: 0.3, ease: "power2.out" }, "<")
          // Phrase rises through its masks, one line after another.
          .fromTo(
            lines,
            { yPercent: 135, skewY: 6 },
            {
              yPercent: 0,
              skewY: 0,
              duration: 1,
              ease: "power4.out",
              stagger: 0.12,
            },
            "-=0.15",
          )
          // Second beat: the lines leave upward, last in first out.
          .to(
            lines,
            {
              yPercent: -135,
              skewY: -6,
              duration: 0.7,
              ease: "power4.in",
              stagger: { each: 0.1, from: "end" },
            },
            `+=${PHRASE_HOLD_S}`,
          )
          // The loader steps aside and the hero opens from a window in the
          // centre of its own red, the same move About me opens with.
          .add(() => markLoaded())
          .to(root, { autoAlpha: 0, duration: 0.35, ease: "power2.out" }, "-=0.1");
      };

      const maybeFinish = () => {
        if (cancelled || finishing || !assetsReady || !rampDone) return;
        finishing = true;
        gsap.to(value, {
          v: 100,
          duration: FINISH_S,
          ease: "power1.out",
          onUpdate: render,
          onComplete: outro,
        });
      };

      gsap.to(value, {
        v: RAMP_TO,
        duration: RAMP_S,
        ease: "power2.inOut",
        onUpdate: render,
        onComplete: () => {
          rampDone = true;
          maybeFinish();
        },
      });

      const waitForLoad = () =>
        new Promise<void>((resolve) => {
          if (document.readyState === "complete") return resolve();
          window.addEventListener("load", () => resolve(), { once: true });
        });
      const waitForFonts = () =>
        document.fonts?.ready
          ? document.fonts.ready.then(() => undefined)
          : Promise.resolve();
      const waitForImage = (src: string) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve();
          img.src = src;
        });

      Promise.all([
        waitForLoad(),
        waitForFonts(),
        ...PRELOAD.map(waitForImage),
      ]).then(() => {
        assetsReady = true;
        maybeFinish();
      });

      cap = window.setTimeout(() => {
        assetsReady = true;
        rampDone = true;
        maybeFinish();
      }, MAX_WAIT_MS);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
      ctx.revert();
    };
  }, [isHome, markLoaded]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="site-loader fixed inset-0 z-[999] overflow-hidden bg-bone text-brand"
      role="status"
      aria-label="Loading"
    >
      {/* The counter, dead centre, with a hairline under it that fills as
          the page loads. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="overflow-hidden">
          <div
            ref={counterRef}
            className="flex items-start font-display leading-[0.86] tabular-nums will-change-transform"
          >
            <span ref={digitsRef} className="text-[clamp(7rem,22vw,19rem)] tracking-[-0.01em]">
              00
            </span>
            <span className="mt-[0.35em] ml-2 text-[clamp(1.5rem,4vw,3.5rem)]">%</span>
          </div>
        </div>
        <span className="relative mt-6 block h-px w-[min(26rem,62vw)] bg-brand/20">
          <span
            ref={barRef}
            style={{ transform: "scaleX(0)" }}
            className="absolute inset-0 origin-left bg-brand will-change-transform"
          />
        </span>
      </div>

      {/* Wordmark and status, top left and bottom centre. */}
      <div ref={chromeRef} aria-hidden className={`pointer-events-none absolute inset-0 ${metaLabel}`}>
        <span className="absolute top-6 left-6 font-display text-[22px] tracking-[0.02em] sm:top-8 sm:left-8">AshCode</span>
        <span className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">Loading the sky</span>
      </div>

      {isHome && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {/* Each line sits in a mask. Inline visibility covers the first
              paint; the effect then parks each line below its mask and
              reveals it, so GSAP alone owns the transform (an inline CSS
              transform would be read as the line's resting position). */}
          <div className="overflow-hidden px-[0.08em]">
            <span
              ref={(el) => {
                lineRefs.current[0] = el;
              }}
              style={{ visibility: "hidden" }}
              className="block font-display text-[clamp(3.5rem,14vw,15rem)] leading-[0.92] tracking-[-0.01em] uppercase will-change-transform"
            >
              Obsession
            </span>
          </div>
          <div className="overflow-hidden px-[0.2em]">
            <span
              ref={(el) => {
                lineRefs.current[1] = el;
              }}
              style={{ visibility: "hidden" }}
              className="block font-serif text-[clamp(2.5rem,9vw,9rem)] leading-[1] italic will-change-transform"
            >
              beats
            </span>
          </div>
          <div className="overflow-hidden px-[0.08em]">
            <span
              ref={(el) => {
                lineRefs.current[2] = el;
              }}
              style={{ visibility: "hidden" }}
              className="block font-display text-[clamp(3.5rem,14vw,15rem)] leading-[0.92] tracking-[-0.01em] uppercase will-change-transform"
            >
              Talent
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
