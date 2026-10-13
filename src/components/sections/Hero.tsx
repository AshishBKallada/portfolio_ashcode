"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { introEase } from "@/components/motion/intro";
import { site } from "@/data/site";
import { NavbarBackdrop } from "@/components/layout/Navbar";
import { AboutPoster } from "@/components/sections/AboutPoster";
import { HeroCta } from "@/components/sections/hero/HeroCta";
import { HeroOverlay } from "@/components/sections/hero/HeroOverlay";
import { HeroSky } from "@/components/sections/hero/HeroSky";
import { HeroCloudCover } from "@/components/sections/hero/HeroCloudCover";
import {
  EXIT_CLOUDS_OUT,
  EXIT_COVERED,
  exitAt,
} from "@/components/sections/hero/heroIntroCycle";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const { phase } = useHeroIntro();
  const reduce = useReducedMotion();
  const show = phase === "text" || phase === "done";
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Copy fades out as soon as the figures start to exit. The About-me poster
  // is swapped in while the clouds cover the screen, then settles from a
  // touch too close as they part.
  useEffect(() => {
    const el = contentRef.current;
    const reveal = revealRef.current;
    if (!el || !reveal || reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        reveal,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            start: () => exitAt(EXIT_COVERED[0]),
            end: () => exitAt(EXIT_COVERED[1]),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      gsap.fromTo(
        reveal,
        { scale: 1.12 },
        {
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            start: () => exitAt(EXIT_CLOUDS_OUT[0]),
            end: () => exitAt(EXIT_CLOUDS_OUT[1]),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      // Gone within the first few steps of the figures' exit.
      gsap.to(el, {
        y: () => -window.innerHeight * 0.06,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          start: () => exitAt(0),
          end: () => exitAt(0.08),
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => ctx.revert();
  }, [reduce]);

  const fade = (i: number) => ({
    initial: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: {
      duration: reduce ? 0 : 0.55,
      ease: introEase,
      delay: reduce ? 0 : 0.35 + i * 0.07,
    },
  });

  // Each statement line rises out of its own mask, one after the other.
  const line = (i: number) => ({
    initial: reduce ? { y: "0%" } : { y: "110%" },
    animate: show ? { y: "0%" } : { y: "110%" },
    transition: {
      duration: reduce ? 0 : 0.9,
      ease: introEase,
      delay: reduce ? 0 : 0.2 + i * 0.1,
    },
  });

  return (
    <section
      style={{ backgroundColor: site.navbar.bg }}
      className="relative h-full w-full"
    >
      {/* Navbar backdrop sits under the overlay so the hero figure paints
          above it; NavbarBar (page level) draws the controls on top. */}
      <NavbarBackdrop />
      <HeroSky />
      {/* About-me poster under the figures (z-5), so their exit uncovers it. */}
      <div
        ref={revealRef}
        style={reduce ? undefined : { opacity: 0, visibility: "hidden" }}
        className="absolute inset-0 z-[3]"
      >
        <AboutPoster />
      </div>
      <HeroOverlay />
      {!reduce && <HeroCloudCover />}
      <div
        ref={contentRef}
        className="pointer-events-none absolute inset-0 z-10 flex h-full w-full flex-col px-4 pt-24 pb-10 sm:px-5 sm:pb-12 md:pt-28"
      >
        <div className="pointer-events-auto mt-auto max-w-3xl">
          <p className="font-serif text-[clamp(1.9rem,4.4vw,4rem)] leading-[1.02] tracking-[-0.02em] text-cream">
            <span className="block overflow-hidden">
              <motion.span {...line(0)} className="block">
                {site.hero.statementLineOne}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.18em]">
              <motion.span {...line(1)} className="block">
                {site.hero.statementLineTwoBefore}{" "}
                <span className="font-script text-[1.18em] leading-none text-flame">
                  {site.hero.statementScript}
                </span>
                {site.hero.statementLineTwoAfter}
              </motion.span>
            </span>
          </p>

          <motion.div {...fade(4)}>
            <HeroCta />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
