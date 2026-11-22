"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { heroWorks } from "@/data/hero";
import { site } from "@/data/site";
import { viewFor } from "@/lib/tunnel/hang";
import { TRAVEL } from "@/lib/tunnel/path";
import { useScrollTo } from "@/lib/hooks/useScrollTo";
import { HERO_TRAVEL_SVH } from "./HomeLayout";
import { HeroCaption } from "./tunnel/HeroCaption";

/** three.js and the corridor load in their own chunk, after the page is up. */
const TunnelScene = dynamic(() => import("./tunnel/TunnelScene"), { ssr: false });

/** The page scroll (px) over which the camera travels the corridor. */
const travelPx = () => (window.innerHeight * HERO_TRAVEL_SVH) / 100;

/**
 * The hero: a white gallery corridor bending left, the work hung along its outer wall
 * (tunnel/, lib/tunnel). HomeLayout pins it while the page scrolls and the camera walks
 * down the corridor; the caption names the work in view, and the arrows step between works.
 */
export function TunnelHero() {
  const reduce = useReducedMotion() ?? false;
  const { phase } = useHeroIntro();
  const ready = reduce || phase !== "loading";
  const { scrollY } = useScroll();
  const scrollTo = useScrollTo();
  const [piece, setPiece] = useState(0);

  // 0 to 1 through the corridor over the hero's travel, read by the scene each frame.
  const progress = useCallback(() => Math.min(1, Math.max(0, scrollY.get() / travelPx())), [scrollY]);
  const goTo = useCallback(
    (i: number) => scrollTo((Math.min(TRAVEL, viewFor(i)) / TRAVEL) * travelPx()),
    [scrollTo],
  );

  return (
    <section
      aria-label="Introduction"
      data-nav-theme="light"
      className="relative h-full w-full overflow-hidden bg-white"
    >
      <h1 className="sr-only">
        {site.name}: {site.hero.statementMain}
      </h1>
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <TunnelScene progress={progress} onPiece={setPiece} />
        <HeroCaption
          work={heroWorks[piece]}
          onPrev={() => goTo(piece - 1)}
          onNext={() => goTo(piece + 1)}
          atStart={piece === 0}
          atEnd={piece === heroWorks.length - 1}
        />
      </motion.div>
    </section>
  );
}
