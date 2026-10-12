"use client";

import { useLenis } from "lenis/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { buttonOutline } from "@/components/ui/buttonStyles";
import { HERO_EXIT_START } from "@/components/sections/hero/heroIntroCycle";
import { site } from "@/data/site";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/resume", label: "Résumé" },
];

// Small from the start: the wordmark sits at the bar's left at the same size
// in the hero and once the bar goes compact.
const wordmarkClass =
  "font-display text-[26px] uppercase leading-[0.82] tracking-tight";

const COMPACT_HEIGHT = 60;
const COMPACT_WORDMARK_PX = 26;
const compactEase = [0.22, 1, 0.36, 1] as const;
const compactTransition = { duration: 0.7, ease: compactEase };

/** True as soon as the hero figures start exiting, so the bar is already slim
 * by the time the About-me poster is uncovered; both navbar layers collapse. */
function useNavbarCompact() {
  const [compact, setCompact] = useState(false);
  const last = useRef(false);
  const update = (scroll: number) => {
    const next = scroll > window.innerHeight * HERO_EXIT_START;
    if (next === last.current) return;
    last.current = next;
    setCompact(next);
  };
  useLenis((instance) => update(instance.scroll));
  useEffect(() => {
    const onScroll = () => update(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return compact;
}

/** Invisible wordmark that keeps the expanded bar as tall as the real one. */
function BarSpacer() {
  return (
    <div className="px-4 pt-3 pb-5 md:px-5 md:pb-6">
      <span aria-hidden className={`invisible block ${wordmarkClass}`}>
        {site.name}
      </span>
    </div>
  );
}

/**
 * Transparent spacer the height of the full bar, so the hero (clouds and
 * all) shows through behind the wordmark while it is in view. NavbarBar
 * measures it, draws the controls on top, and paints its own red bar only
 * once it goes compact.
 */
export function NavbarBackdrop() {
  const compact = useNavbarCompact();

  return (
    <motion.div
      id="navbar-backdrop"
      className="pointer-events-none absolute inset-x-0 top-0 z-[4] overflow-hidden text-cream"
      initial={false}
      animate={{ height: compact ? COMPACT_HEIGHT : "auto" }}
      transition={compactTransition}
    >
      <BarSpacer />
    </motion.div>
  );
}

/**
 * Wordmark, links and actions, fixed above the whole page. Over the hero it
 * sits on NavbarBackdrop; as soon as the hero figures start exiting it grows
 * its own red bar, shrinks to a slim strip and scales the wordmark down.
 */
export function NavbarBar() {
  const compact = useNavbarCompact();
  const [fullHeight, setFullHeight] = useState(0);
  const [wordmarkScale, setWordmarkScale] = useState(1);
  const wordmarkRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const measure = () => {
      const backdrop = document.getElementById("navbar-backdrop");
      if (backdrop) setFullHeight(backdrop.offsetHeight);
      const mark = wordmarkRef.current;
      if (mark) {
        const size = parseFloat(getComputedStyle(mark).fontSize) || 1;
        setWordmarkScale(Math.min(COMPACT_WORDMARK_PX / size, 1));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-cream">
      {/* Covers the hero backdrop at full height, then shrinks together with
          the wordmark. Expanding again, it fades straight away and the
          backdrop takes over. */}
      <motion.div
        aria-hidden
        style={{ backgroundColor: site.navbar.bg }}
        className="absolute inset-x-0 top-0 overflow-hidden"
        initial={false}
        animate={
          compact
            ? { height: COMPACT_HEIGHT, opacity: 1 }
            : { height: fullHeight || COMPACT_HEIGHT, opacity: 0 }
        }
        transition={{
          height: { duration: 0.7, ease: compactEase },
          // On the way back up, hand off to NavbarBackdrop (which grows in
          // step underneath the hero figure) almost at once, so this cover
          // never hides the figure as it slides back in.
          opacity: compact ? { duration: 0 } : { duration: 0.15 },
        }}
      >
        <BarSpacer />
      </motion.div>
      <div className="relative grid grid-cols-[1fr_auto] items-start gap-6 px-4 pt-3 md:grid-cols-2 md:px-5">
        <Link href="/" className="block h-0 overflow-visible">
          <motion.span
            ref={wordmarkRef}
            className={`inline-block origin-top-left ${wordmarkClass}`}
            initial={false}
            animate={{
              scale: compact ? wordmarkScale : 1,
              y: compact ? 4 : 0,
            }}
            transition={compactTransition}
          >
            {site.name}
          </motion.span>
        </Link>

        <div className="flex items-start justify-end gap-6 md:justify-between">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 pt-3 font-sans text-[12px] font-medium tracking-[0.08em] uppercase md:flex"
          >
            {links.map((link) => (
              <AnchorLink
                key={link.href}
                href={link.href}
                className="nav-link"
              >
                {link.label}
              </AnchorLink>
            ))}
          </nav>

          <AnchorLink
            href="/#contact"
            className={buttonOutline}
          >
            Contact
          </AnchorLink>
        </div>
      </div>
    </header>
  );
}
