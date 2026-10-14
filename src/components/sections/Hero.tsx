"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { introEase } from "@/components/motion/intro";
import { site } from "@/data/site";
import { NavbarBackdrop } from "@/components/layout/Navbar";
import { AboutPoster } from "@/components/sections/AboutPoster";
import { HeroCta } from "@/components/sections/hero/HeroCta";
import { HeroOverlay } from "@/components/sections/hero/HeroOverlay";
import { HeroSky } from "@/components/sections/hero/HeroSky";
import { exitAt } from "@/components/sections/hero/heroIntroCycle";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const { phase } = useHeroIntro();
  const reduce = useReducedMotion();
  const show = phase === "text" || phase === "done";
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const opened = useRef(false);

  // First reveal, "the gates of heaven": while the loader is up the hero
  // waits shut behind a dark backdrop. Once it lifts, a beam of light drops
  // down the centre, the screen splits open from it to both edges, and the
  // stage settles from a touch too close; HeroOverlay then lands the cloud,
  // the figure and the harp in turn. The clip sits on the stage around the
  // section, so the section's own scale stays free.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = section?.parentElement;
    const beam = stage?.parentElement?.querySelector<HTMLElement>("[data-hero-beam]");
    if (!section || !stage || !beam || reduce || opened.current) return;
    if (phase === "loading" || phase === "cycle") {
      gsap.set(stage, { clipPath: "inset(0% 50% 0% 50%)" });
      gsap.set(section, { scale: 1.12 });
      return;
    }
    if (phase !== "zoom") return;
    opened.current = true;
    const tl = gsap
      .timeline()
      // The beam drops from the top, then flares as the gates part.
      .fromTo(
        beam,
        { autoAlpha: 1, scaleY: 0, scaleX: 1 },
        { scaleY: 1, duration: 0.45, ease: "power3.in" },
      )
      .to(beam, { scaleX: 14, autoAlpha: 0, duration: 0.7, ease: "power2.out" }, 0.4)
      // Explicit start: the browser reports a clip in a shorthand GSAP can't
      // always pair up with the four-sided end value.
      .fromTo(
        stage,
        { clipPath: "inset(0% 50% 0% 50%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "expo.inOut" },
        0.4,
      )
      .fromTo(section, { scale: 1.12 }, { scale: 1, duration: 1.5, ease: "power3.out" }, 0.4)
      .set([stage, section], { clearProps: "clipPath,transform" });
    return () => {
      tl.kill();
    };
  }, [phase, reduce]);

  // Copy fades out as soon as the figures start to exit, leaving the stage
  // to the laptop as it zooms into the About-me poster on its screen.
  useEffect(() => {
    const el = contentRef.current;
    if (!el || reduce) return;
    const ctx = gsap.context(() => {
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
      ref={sectionRef}
      style={{ backgroundColor: site.navbar.bg }}
      className="relative h-full w-full"
    >
      {/* Navbar backdrop sits under the overlay so the hero figure paints
          above it; NavbarBar (page level) draws the controls on top. */}
      <NavbarBackdrop />
      <HeroSky />
      {/* The About-me poster lives on the laptop's screen until the zoom
          brings it to full view. */}
      <HeroOverlay screen={<AboutPoster />} />
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
