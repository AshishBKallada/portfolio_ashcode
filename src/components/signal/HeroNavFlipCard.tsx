"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { site } from "@/data/site";
import { heroPinPhases } from "@/lib/heroPinScroll";
import { DropCap } from "./Editions";

const about = site.aboutEdition;
/** The card's height (globals.css --card-h). */
const CARD_H = 464;

const smallLabel = "font-headline text-[14px] leading-none tracking-[-0.01em]";

const links = [
  { href: "/", label: "Home" },
  { href: "/#index", label: "Work" },
  { href: "/resume", label: "Résumé" },
  { href: "/#contact", label: "Contact" },
] as const;

const ROMAN = ["I", "II", "III", "IV"] as const;

/**
 * Centred hero nav card: front is site chrome, back is About copy. Scroll drives
 * a horizontal flip before the cloud/figure reveal runs.
 */
export function HeroNavFlipCard({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const flip = useTransform(scrollY, (y) => heroPinPhases(y).flip);
  const rotateY = useTransform(flip, (v) => v * -180);

  // Leaving: as Work rises over the hero, the card is sucked down into its torn edge,
  // faster and faster, stretching tall and thin. The nav's layer sits between the
  // hero and Work (SignalNav), so Work's edge swallows it. Nothing fades; scrolling
  // back up plays it in reverse.
  const pullY = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  useMotionValueEvent(scrollY, "change", () => {
    const work = document.getElementById("index");
    if (!work || reduce) return;
    const vh = window.innerHeight;
    // Work's torn edge runs about 0.4vh ahead of the section's top. The pull starts as it
    // reaches the card's bottom edge and is done by the time it would cover the card.
    const front = work.getBoundingClientRect().top - vh * 0.4;
    const cardBottom = vh / 2 + CARD_H / 2;
    const t = Math.min(1, Math.max(0, (cardBottom - front) / (CARD_H * 0.9)));
    pullY.set(t * t * t * vh * 0.7);
    scaleY.set(1 + t * t * 0.4);
    scaleX.set(1 - t * t * 0.5);
  });

  // Kept mounted once hidden, so it stays in place until Work pulls it down.
  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className="edition-nav__flip-scene pointer-events-none"
    >
      <motion.div
        style={{ y: pullY, scaleX, scaleY }}
        className="h-full w-full origin-bottom"
      >
        <motion.div
          style={reduce ? undefined : { rotateY }}
          className="edition-nav__flipper pointer-events-auto"
        >
          <div className="edition-nav__face edition-nav__face--front">
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
      </motion.div>
    </div>
  );
}
