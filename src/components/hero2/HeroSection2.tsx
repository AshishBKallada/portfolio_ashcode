"use client";

import { useReducedMotion } from "motion/react";
import { Inter } from "next/font/google";
import { useRef } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { CLOTH_IMAGE } from "./cloth/settings";
import { Hero2Copy } from "./Hero2Copy";
import { useCloth } from "./cloth/useCloth";
import s from "./HeroSection2.module.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const CLOTH_CLASSES = { noCloth: s.noCloth, over: s.over, held: s.held };

/**
 * A studio-wall hero: a holographic cloth pinned by its top corners, simulated
 * in real time, that can be grabbed and tugged with mouse or finger, beside a
 * two-line heading. `showNav` adds its own nav bar; off by default, since the
 * site's navbar already holds the top.
 */
export function HeroSection2({ showNav = false }: { showNav?: boolean }) {
  const hero = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useCloth(hero, canvas, CLOTH_CLASSES);

  const reduce = useReducedMotion() ?? false;
  const { phase } = useHeroIntro();
  const ready = reduce || phase !== "loading";

  return (
    <section
      ref={hero}
      id="hero"
      aria-label="Peculiar Atelier"
      className={`${s.hero} ${inter.className} ${ready ? s.ready : ""}`}
    >
      <canvas
        ref={canvas}
        className={s.cloth}
        role="img"
        tabIndex={-1}
        aria-label="A holographic cloth printed with a marble Hermes floating on a cloud with a laptop, over the word Immortal. Grab it then tug it around."
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- the fallback shows the cloth texture as it is */}
      <img className={s.still} alt="" decoding="async" src={CLOTH_IMAGE} />
      {showNav ? (
        <header className={`${s.nav} ${s.rise}`}>
          <a className={s.logo} href="#hero">
            Peculiar Atelier
          </a>
          <div className={s.actions}>
            <button className={`${s.pill} ${s.menu}`} type="button" aria-haspopup="true" aria-expanded="false">
              <span className={s.burger} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              More
            </button>
            <a className={`${s.pill} ${s.start}`} href="#start">
              Start a brief
            </a>
          </div>
        </header>
      ) : null}
      <Hero2Copy />
    </section>
  );
}
