"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/data/site";
import { introEase } from "@/lib/motion";
import { setPageMode, usePageMode } from "@/theme/mode";
import { HeroNavFlipCard } from "./HeroNavFlipCard";
import { Dot } from "./primitives";

/** Small labels in the theme's headline face (was mono). */
const smallLabel = "font-headline text-[14px] leading-none tracking-[-0.01em]";
import { useNavChrome, type NavChromePhase } from "./nav-chrome";

const links = [
  { href: "/", label: "Home" },
  { href: "/#index", label: "Work" },
  { href: "/resume", label: "Résumé" },
  { href: "/#contact", label: "Contact" },
] as const;

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"] as const;

const pill =
  "pointer-events-auto rounded-[5px] border border-white/10 bg-ink/90 text-bone shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md";

/**
 * Desktop home: the Editions-style card centred on the hero; on first scroll it
 * fades away and the top bar slides in. Desktop elsewhere: the top bar. Phones:
 * brand + menu in a top-left pill.
 */
export function SignalNav() {
  const pathname = usePathname();
  const { phase, morphRail, completeMorph } = useNavChrome();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const crumb = pathname === "/" ? "Home" : pathname.startsWith("/projects") ? "Work" : "Résumé";

  return (
    <>
      {/* Desktop home: framed card centred on the hero that settles into the left rail on scroll. */}
      {pathname === "/" ? <EditionsNav rail={morphRail} phase={phase} onSettled={completeMorph} year={year} /> : null}

      {/* Desktop top bar: past the hero on home, always on other pages. */}
      <TopBar visible={pathname === "/" ? morphRail : true} />

      {/* Top-left pill: phones. */}
      <div ref={rootRef} className="pointer-events-none fixed top-3 left-3 z-50 md:hidden">
        <div className={`${pill} pointer-events-auto flex items-center gap-1 p-1 pl-3`}>
          <div className="flex items-center gap-1">
            <Link href="/" className="font-headline text-[17px] leading-none tracking-[-0.02em]">
              {site.name}
            </Link>
            <span aria-hidden className="mx-1.5 text-bone/40">
              /
            </span>
            <span className={`${smallLabel} hidden text-bone/60 sm:inline`}>{crumb}</span>
          </div>

          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
            className="ml-3 inline-flex min-h-9 items-center gap-2 rounded-[3px] bg-white/10 px-3 text-[14px] transition-colors hover:bg-white/20 md:ml-10"
          >
            <span aria-hidden className="relative block h-2 w-3.5">
              <span
                className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${open ? "top-1 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px bg-current transition-all duration-300 ${open ? "top-1 w-full -rotate-45" : "top-2 w-2/3"}`}
              />
            </span>
            {open ? "Close" : "Menu"}
          </button>

          <AnimatePresence>
            {open && (
              <motion.nav
                id={menuId}
                aria-label="Primary"
                initial={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
                transition={{ duration: 0.45, ease: introEase }}
                className={`${pill} absolute top-full left-0 z-50 mt-2 w-[min(20rem,calc(100vw-1.5rem))] p-2`}
              >
                <ul>
                  {links.map((link, i) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="group flex min-h-12 items-center justify-between rounded-[3px] px-3 font-headline text-[24px] tracking-[-0.03em] transition-colors hover:bg-white/8"
                      >
                        {link.label}
                        <span className={`${smallLabel} text-bone/40 group-hover:text-gold`}>
                          [{String(i + 1).padStart(2, "0")}]
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex items-center justify-between border-t border-white/10 px-3 pt-3 pb-1">
                  <span className={`${smallLabel} text-bone/70`}>Background</span>
                  <PageModeSwitch />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/10 px-3 pt-3 pb-1">
                  {site.socials.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${smallLabel} nav-link text-bone/70 hover:text-bone`}
                    >
                      {s.label} ↗
                    </a>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Top-right actions: the hero, and phones elsewhere (the top bar has its own). */}
      <motion.header
        initial={false}
        animate={{ opacity: morphRail ? 0 : 1, y: morphRail ? -8 : 0 }}
        transition={{ duration: 0.35, ease: introEase }}
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-end gap-3 p-3 sm:p-4 ${morphRail ? "md:pointer-events-none" : ""} ${pathname === "/" ? "" : "md:hidden"}`}
      >
        {/* Availability beside one CTA; the stack lives in the work, not the chrome. */}
        <div
          className={`pointer-events-auto flex items-center gap-x-5 text-cream [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] ${morphRail ? "md:pointer-events-none md:opacity-0" : ""}`}
        >
          <PageModeSwitch />
          <p className="hidden items-center gap-2 font-sans text-[13px] leading-none tracking-[-0.01em] text-cream/85 lg:inline-flex">
            <span aria-hidden className="relative inline-flex size-[7px]">
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/70 motion-reduce:hidden" />
              <span className="relative size-[7px] rounded-full bg-gold" />
            </span>
            {site.signal.availability}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex min-h-11 items-center gap-2 rounded-[4px] bg-cream px-5 font-sans text-[14px] font-medium tracking-[-0.01em] text-ink [text-shadow:none] shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-colors hover:bg-bone"
          >
            Get in Touch
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </a>
        </div>
      </motion.header>
    </>
  );
}

/**
 * The desktop nav once past the hero: brand, the links, and Get in touch in one bar
 * along the top, on no background. Its text reads cream over dark regions and ink
 * over light ones (regions mark themselves with data-nav-theme; where they overlap,
 * the later one in the page wins); the button inverts to match.
 */
function TopBar({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const red = usePageMode() === "red";

  // Written to a data attribute, not state, so scrolling doesn't re-render.
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = bar.getBoundingClientRect();
      const y = r.top + r.height / 2;
      const under = [...document.querySelectorAll<HTMLElement>("[data-nav-theme]")].findLast((el) => {
        const box = el.getBoundingClientRect();
        return box.top <= y && box.bottom >= y;
      });
      // The red page is dark enough that its light regions read cream too.
      const tone = under?.dataset.navTheme === "dark" || red ? "cream" : "ink";
      if (bar.dataset.tone !== tone) bar.dataset.tone = tone;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [red]);

  return (
    <motion.header
      ref={ref}
      data-tone="ink"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
      transition={{ duration: 0.4, ease: introEase }}
      inert={!visible}
      className="group/bar pointer-events-none fixed inset-x-0 top-0 z-50 hidden md:block"
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-[1480px] items-center justify-between gap-6 px-5 py-4 text-ink transition-colors duration-300 group-data-[tone=cream]/bar:text-cream sm:px-10">
        <Link href="/" className="font-headline text-[20px] leading-none tracking-[-0.03em]">
          {site.name}
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-7">
            {links.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="nav-link group inline-flex items-baseline gap-1.5 font-headline text-[15px] leading-none tracking-[-0.02em]"
                >
                  {link.label}
                  <span className="font-narrative text-[12px] tracking-normal opacity-50 group-hover:opacity-100">{ROMAN[i]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
        <PageModeSwitch />
        <a
          href={`mailto:${site.email}`}
          className="inline-flex min-h-9 items-center gap-2 rounded-[4px] bg-ink px-4 font-sans text-[13px] font-medium tracking-[-0.01em] text-cream transition-colors duration-300 hover:bg-ink/85 group-data-[tone=cream]/bar:bg-cream group-data-[tone=cream]/bar:text-ink group-data-[tone=cream]/bar:hover:bg-cream/85"
        >
          <Dot className="bg-gold" />
          Get in touch
        </a>
        </div>
      </div>
    </motion.header>
  );
}

/**
 * Shopify Editions-style side nav. One fixed aside the width of the rail; the
 * title, list and frame sit centred on the viewport in the hero and translate
 * back into the rail when `rail` flips (geometry and timing in globals.css).
 */
function EditionsNav({
  rail,
  phase,
  onSettled,
  year,
}: {
  rail: boolean;
  phase: NavChromePhase;
  onSettled: () => void;
  year: number;
}) {
  const asideRef = useRef<HTMLElement>(null);
  const red = usePageMode() === "red";

  // Each part of the rail reads cream over dark regions and ink over light
  // ones. Regions mark themselves with data-nav-theme; where they overlap (the
  // pinned hero under a section sliding over it) the later one in the page wins.
  // Written to data attributes, not state, so scrolling doesn't re-render.
  useEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;
    const parts = {
      title: aside.querySelector(".edition-nav__title"),
      list: aside.querySelector(".edition-nav__list"),
      foot: aside.querySelector(".edition-nav__foot"),
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      // Faded out past the hero (the top bar takes over): nothing to tone.
      if (aside.dataset.state === "rail") return;
      const regions = [...document.querySelectorAll<HTMLElement>("[data-nav-theme]")].map((el) => ({
        rect: el.getBoundingClientRect(),
        theme: el.dataset.navTheme,
      }));
      // Every read before any write, so a write never forces a fresh layout for the next read.
      const tones = Object.entries(parts).map(([key, el]) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const y = r.top + r.height / 2;
        const under = regions.findLast((region) => region.rect.top <= y && region.rect.bottom >= y);
        return [`${key}Tone`, under?.theme === "dark" || red ? "cream" : "ink"] as const;
      });
      for (const tone of tones) {
        if (tone && aside.dataset[tone[0]] !== tone[1]) aside.dataset[tone[0]] = tone[1];
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [red]);

  return (
    <aside
      ref={asideRef}
      data-state={rail ? "rail" : "hero"}
      // z-[1]: over the hero, under Work (z-[1] too, later in the page), so Work's rising
      // edge covers the card as it's pulled down. Past the hero the top bar takes over.
      inert={rail}
      className="edition-nav pointer-events-none fixed inset-y-0 left-0 z-[1] hidden w-[var(--nav-sidebar-w)] md:block"
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "color" && phase === "morphing") onSettled();
      }}
    >
      <HeroNavFlipCard visible={phase === "hero"} />
      <span aria-hidden className="edition-nav__frame" />

      <div className="edition-nav__title">
        <Link
          href="/"
          className="pointer-events-auto block font-headline text-[32px] leading-[0.95] tracking-[-0.03em] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          {site.name}
        </Link>
        <p className="edition-nav__subtitle mt-3 max-w-[300px] font-narrative text-[17px] leading-[0.97] tracking-[-0.04em] text-balance">
          {site.tagline}
        </p>
      </div>

      <nav aria-label="Primary" className="edition-nav__list">
        <ul>
          {links.map((link, i) => (
            <li key={link.href} style={{ "--i": i } as React.CSSProperties}>
              <Link
                href={link.href}
                className="edition-nav__link group pointer-events-auto flex items-end justify-between gap-2 py-2 font-headline text-[18px] leading-[0.95] tracking-[-0.02em] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current"
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

      <div className="edition-nav__foot space-y-4">
        <a
          href={`mailto:${site.email}`}
          tabIndex={rail ? 0 : -1}
          className={`${smallLabel} nav-link inline-flex items-center gap-2 opacity-80 hover:opacity-100`}
        >
          <Dot className="bg-gold" />
          Get in touch
        </a>
        <p className={`${smallLabel} opacity-55`}>
          © {year} {site.name}
        </p>
      </div>
    </aside>
  );
}

/**
 * Flips the page between the cream ground and red (theme/mode.ts). Takes the
 * colour of whatever chrome it sits in: the knob and label are currentColor.
 */
function PageModeSwitch() {
  const red = usePageMode() === "red";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={red}
      aria-label="Red background"
      onClick={() => setPageMode(red ? "cream" : "red")}
      className="pointer-events-auto inline-flex min-h-9 items-center gap-2 rounded-[3px] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current"
    >
      <span
        aria-hidden
        className={`relative h-[18px] w-8 rounded-full border border-current/30 transition-colors duration-300 ${red ? "bg-flame" : "bg-section"}`}
      >
        <span
          className={`absolute top-1/2 left-[2px] size-3 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-[translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${red ? "translate-x-[14px]" : ""}`}
        />
      </span>
      <span className={`${smallLabel} hidden w-[2.75rem] text-left lg:inline`}>{red ? "Red" : "Cream"}</span>
    </button>
  );
}
