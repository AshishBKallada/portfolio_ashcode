"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/data/site";
import { introEase } from "@/lib/motion";
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
 * Desktop home: the Editions-style card centred on the hero, settling into the
 * left rail on first scroll (page scroll unlocks once it lands). Phones and
 * other pages: brand + menu in a top-left pill.
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

      {/* Top-left pill: phones, and every page other than home. */}
      <div
        ref={rootRef}
        className={`pointer-events-none fixed top-3 left-3 z-50 ${pathname === "/" ? "md:hidden" : ""}`}
      >
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

      {/* Top-right actions — hero only (desktop hides when rail is active). */}
      <motion.header
        initial={false}
        animate={{ opacity: morphRail ? 0 : 1, y: morphRail ? -8 : 0 }}
        transition={{ duration: 0.35, ease: introEase }}
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-end gap-3 p-3 sm:p-4 ${morphRail ? "md:pointer-events-none" : ""}`}
      >
        {/* Availability beside one CTA; the stack lives in the work, not the chrome. */}
        <div
          className={`pointer-events-auto flex items-center gap-x-5 text-cream [text-shadow:0_2px_16px_rgba(0,0,0,0.45)] ${morphRail ? "md:pointer-events-none md:opacity-0" : ""}`}
        >
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
      const regions = [...document.querySelectorAll<HTMLElement>("[data-nav-theme]")].map((el) => ({
        rect: el.getBoundingClientRect(),
        theme: el.dataset.navTheme,
      }));
      for (const [key, el] of Object.entries(parts)) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const y = r.top + r.height / 2;
        const under = regions.findLast((region) => region.rect.top <= y && region.rect.bottom >= y);
        aside.dataset[`${key}Tone`] = under?.theme === "dark" ? "cream" : "ink";
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
  }, []);

  return (
    <aside
      ref={asideRef}
      data-state={rail ? "rail" : "hero"}
      className="edition-nav pointer-events-none fixed inset-y-0 left-0 z-50 hidden w-[var(--nav-sidebar-w)] md:block"
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "color" && phase === "morphing") onSettled();
      }}
    >
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
