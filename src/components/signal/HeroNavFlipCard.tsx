"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { DropCap } from "./Editions";

const about = site.aboutEdition;
const smallLabel = "font-headline text-[14px] leading-none tracking-[-0.01em]";

const links = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Work" },
  { href: "/resume", label: "Résumé" },
  { href: "/#contact", label: "Contact" },
] as const;

const ROMAN = ["I", "II", "III", "IV"] as const;

/** Seconds each face holds before the card turns: the nav, then About. */
const HOLD_FRONT_S = 5;
const HOLD_BACK_S = 8;

/**
 * Centred hero nav card: front is site chrome, back is About copy. On the single-screen
 * home it turns over by itself on an interval, and holds still while the pointer or
 * keyboard focus is on it so either face can be read and used.
 */
export function HeroNavFlipCard({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion() ?? false;
  const rotateY = useMotionValue(0);
  const [back, setBack] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!visible || held) return;
    const id = window.setTimeout(() => setBack((b) => !b), (back ? HOLD_BACK_S : HOLD_FRONT_S) * 1000);
    return () => window.clearTimeout(id);
  }, [visible, held, back]);

  useEffect(() => {
    const target = back ? -180 : 0;
    if (reduce) {
      rotateY.set(target);
      return;
    }
    const run = animate(rotateY, target, { type: "spring", stiffness: 55, damping: 13, mass: 1 });
    return () => run.stop();
  }, [back, reduce, rotateY]);

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className="edition-nav__flip-scene pointer-events-none"
    >
      <div className="h-full w-full">
        <motion.div
          style={{ rotateY }}
          onPointerEnter={() => setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
          className="edition-nav__flipper pointer-events-auto"
        >
          <div className="edition-nav__face edition-nav__face--front" aria-hidden={back} inert={back}>
            <Link
              href="/"
              className="block font-headline text-[32px] leading-[0.95] tracking-[-0.03em] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              {site.name}
            </Link>
            <p className="edition-nav__subtitle mt-3 max-w-[300px] font-narrative text-[17px] leading-[0.97] tracking-[-0.04em] text-balance">
              {site.tagline}
            </p>
            <nav aria-label="Primary" className="mt-auto pt-8">
              <ul>
                {links.map((link, i) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-end justify-between gap-2 py-2 font-headline text-[18px] leading-[0.95] tracking-[-0.02em] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current"
                    >
                      <span>{link.label}</span>
                      <span className="font-narrative text-[15px] tracking-normal tabular-nums opacity-60 group-hover:opacity-100">
                        {ROMAN[i]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <section
            id="about"
            aria-label="About"
            className="edition-nav__face edition-nav__face--back flex flex-col"
            aria-hidden={!back}
            inert={!back}
          >
            <p className={`${smallLabel} text-gold/90`}>{about.kicker}</p>
            <h2 className="mt-3 font-narrative text-[22px] leading-[0.95] tracking-[-0.04em] text-balance">
              <DropCap className="text-[20px]">{`${about.dropCap}${about.headline}`}</DropCap>
            </h2>
            <p className="mt-4 flex-1 font-narrative text-[15px] leading-[1.35] tracking-[-0.03em] text-cream/88">
              {about.body}
            </p>
            <Link
              href={about.cta.href}
              className={`${smallLabel} mt-4 inline-flex min-h-9 items-center gap-2 rounded-[4px] border border-cream/25 px-3 transition-colors hover:border-cream/45 hover:bg-white/5`}
            >
              {about.cta.label}
              <span aria-hidden>↗</span>
            </Link>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
