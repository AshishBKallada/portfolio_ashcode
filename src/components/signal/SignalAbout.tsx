"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";
import { HERO_EXIT_AT, HERO_EXIT_VH, HERO_STAGE_PIN_VH } from "@/lib/hero";

/** Hero pins through its reveal, then scrolls away as the sections below follow it; nothing stacks over it. */
export function HeroStage({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  // The exit: let go halfway through the reveal, the hero drifts up slower than
  // the page (a parallax lag) and dims, so it reads as falling back behind Work.
  const { scrollY } = useScroll();
  const exit = useTransform(scrollY, (y) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return Math.min(1, Math.max(0, (y - vh * HERO_EXIT_AT) / (vh * HERO_EXIT_VH)));
  });
  const exitY = useTransform(exit, [0, 1], ["0svh", "45svh"]);
  const exitScale = useTransform(exit, [0, 1], [1, 1.06]);
  const exitShade = useTransform(exit, [0, 1], [0, 0.6]);

  // Mark the hero covered once it has scrolled fully off the top, so idle motion and the
  // carpet stop. A data attribute, not state.
  useEffect(() => {
    const stage = stageRef.current;
    const pin = pinRef.current;
    if (!stage || !pin) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const covered = pin.getBoundingClientRect().bottom <= 0;
      const value = covered ? "true" : "false";
      if (stage.dataset.covered !== value) stage.dataset.covered = value;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={stageRef} className="hero-stage relative bg-background text-foreground">
      {/* Tall enough to hold the hero pinned through its reveal (SkyHero), then it scrolls away. */}
      <div ref={pinRef} className="relative" style={{ height: `calc(max(100svh, 640px) + ${HERO_STAGE_PIN_VH * 100}svh)` }}>
        <motion.div
          style={reduce ? undefined : { y: exitY, scale: exitScale }}
          className="hero-pin sticky top-0 h-[100svh] min-h-[640px] overflow-hidden will-change-transform"
        >
          {hero}
          {reduce ? null : (
            <motion.div aria-hidden style={{ opacity: exitShade }} className="pointer-events-none absolute inset-0 z-[80] bg-night" />
          )}
        </motion.div>
      </div>
      <div className="signal-main-gutter relative z-[1]">{children}</div>
    </div>
  );
}
