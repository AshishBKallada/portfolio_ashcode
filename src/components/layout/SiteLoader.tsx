"use client";

import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { site } from "@/data/site";
import { HERO_FIGURE_URL, HERO_SEAT_CLOUD_URL } from "@/lib/hero";

/**
 * Boot sequence, after Shopify Editions, all on one black screen:
 *   1. a hairline frame, the size and place of the nav card, draws itself
 *      round to about 80% while the page, fonts and hero images load, and the
 *      wordmark fades in at the frame's vertical centre;
 *   2. once they're in, the frame closes the last stretch and the wordmark
 *      slides up to where the nav card's title sits;
 *   3. the screen lifts off, leaving the nav card in the same spot over the
 *      hero; its tagline and links fade in one after another (globals.css:
 *      html[data-site-loading]), and the hero's construction lines draw in.
 * Off the home page, or with reduced motion, the screen just fades out.
 */

// Timings from the reference: a slow load stroke, a quick close, a short fade.
const LOAD_S = 6;
const COMPLETE_S = 1;
const FADE_S = 0.52;
const LOAD_EASE = "cubic-bezier(.45,.28,.34,.84)";
const COMPLETE_EASE = "cubic-bezier(.72,.16,.19,.96)";
const FADE_EASE = "cubic-bezier(.25,.46,.45,.94)";
const FADE_DELAY_S = 0.2;
const SLIDE_S = 0.6;
const SLIDE_EASE = "cubic-bezier(.41,.19,.13,.95)";
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
  const rectRef = useRef<SVGRectElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  // Read at outro time, so a late reduced-motion value never restarts the draw.
  const reduceRef = useRef(reduce);
  useEffect(() => {
    reduceRef.current = reduce;
  }, [reduce]);

  useEffect(() => {
    const root = rootRef.current;
    const rect = rectRef.current;
    const title = titleRef.current;
    if (!root || !rect || !title) return;

    let cancelled = false;
    let finishing = false;
    let cap = 0;
    // Holds the nav card's tagline and links back until the screen lifts.
    const html = document.documentElement;
    if (isHome && !reduceRef.current) html.dataset.siteLoading = "";
    const release = () => delete html.dataset.siteLoading;

    const ctx = gsap.context(() => {
      const load = gsap.fromTo(
        rect,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0.2, duration: LOAD_S, ease: LOAD_EASE },
      );
      // The wordmark starts at the frame's vertical centre, where it fades in while loading.
      const box = title.parentElement!;
      const centre = box.clientHeight / 2 - title.offsetTop - title.offsetHeight / 2;
      const intro =
        isHome && !reduceRef.current
          ? gsap.fromTo(
              title,
              { autoAlpha: 0, y: centre },
              { autoAlpha: 1, duration: FADE_S, delay: FADE_DELAY_S, ease: FADE_EASE },
            )
          : null;

      const finish = () => {
        if (cancelled || finishing) return;
        finishing = true;
        load.kill();

        if (reduceRef.current || !isHome) {
          intro?.kill();
          release();
          markLoaded();
          gsap.to(root, {
            autoAlpha: 0,
            duration: reduceRef.current ? 0 : 0.4,
            ease: "power2.out",
            onComplete: () => setMounted(false),
          });
          return;
        }

        intro?.progress(1);
        gsap
          .timeline({ onComplete: () => setMounted(false) })
          .to(rect, { strokeDashoffset: 0, duration: COMPLETE_S, ease: COMPLETE_EASE })
          // The wordmark rises to the nav card's title as the frame closes.
          .to(title, { y: 0, duration: SLIDE_S, ease: SLIDE_EASE }, `-=${SLIDE_S * 0.5}`)
          // The screen lifts; the nav card underneath sits in the same place and its links stagger in.
          .add(() => {
            release();
            markLoaded();
          })
          .to(root, { autoAlpha: 0, duration: FADE_S, ease: FADE_EASE }, "<");
      };

      const waitForLoad = () =>
        new Promise<void>((resolve) => {
          if (document.readyState === "complete") return resolve();
          window.addEventListener("load", () => resolve(), { once: true });
        });
      const waitForFonts = () =>
        document.fonts?.ready ? document.fonts.ready.then(() => undefined) : Promise.resolve();
      const waitForImage = (src: string) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve();
          img.src = src;
        });

      // Give the frame a moment to start drawing even on a warm cache.
      const minimum = new Promise<void>((resolve) => window.setTimeout(resolve, 1200));

      Promise.all([minimum, waitForLoad(), waitForFonts(), ...PRELOAD.map(waitForImage)]).then(finish);
      cap = window.setTimeout(finish, MAX_WAIT_MS);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
      release();
      ctx.revert();
    };
  }, [isHome, markLoaded]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="site-loader fixed inset-0 z-[999] overflow-hidden bg-black text-cream"
      role="status"
      aria-label="Loading"
    >
      {/* Same box as the nav card: 340×464, a little left of centre from md up. */}
      <div className="absolute top-1/2 left-1/2 aspect-[340/464] md:left-[calc(50%-var(--nav-card-shift))] w-[min(340px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 p-5">
        <svg aria-hidden viewBox="0 0 340 464" className="absolute inset-0 h-full w-full overflow-visible">
          <rect
            ref={rectRef}
            x="0.5"
            y="0.5"
            width="339"
            height="463"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
            strokeLinecap="square"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <p
          ref={titleRef}
          aria-hidden
          style={{ visibility: "hidden", opacity: 0 }}
          className="relative font-headline text-[32px] leading-[0.95] tracking-[-0.03em]"
        >
          {site.name}
        </p>
      </div>
    </div>
  );
}
