"use client";

import { useLenis } from "lenis/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { HERO_EXIT_START } from "@/components/sections/hero/heroIntroCycle";
import { site } from "@/data/site";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#careers", label: "Careers" },
];

const wordmarkClass =
  "font-display text-[clamp(2.75rem,7.5vw,7rem)] uppercase leading-[0.82] tracking-tight";

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
 * Red bar under the wordmark. Rendered under the hero figure so the figure
 * paints above it; NavbarBar draws the controls on top of everything.
 */
export function NavbarBackdrop() {
  const compact = useNavbarCompact();

  return (
    <motion.div
      id="navbar-backdrop"
      style={{ backgroundColor: site.navbar.bg }}
      className="absolute inset-x-0 top-0 z-[4] overflow-hidden text-white"
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
    <header className="fixed inset-x-0 top-0 z-50 text-white">
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
            className="hidden items-center gap-7 pt-2.5 font-mono text-[12px] uppercase md:flex"
          >
            {links.map((link) => (
              <AnchorLink
                key={link.href}
                href={link.href}
                className="transition-opacity hover:opacity-60"
              >
                {link.label}
              </AnchorLink>
            ))}
          </nav>

          <div className="flex items-stretch gap-2">
            <AnchorLink
              href="/#contact"
              className="flex items-center border border-white px-4 py-2 font-mono text-[12px] uppercase transition-colors hover:bg-white hover:text-black"
            >
              Contact
            </AnchorLink>
            <button
              type="button"
              aria-label="Accessibility options"
              className="flex aspect-square items-center justify-center border border-white px-2 transition-colors hover:bg-white hover:text-black"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="4.5" r="1.5" fill="currentColor" />
                <path d="M5 8.5l7 1.5 7-1.5" />
                <path d="M12 10v4.5" />
                <path d="M12 14.5L9 21M12 14.5L15 21" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
