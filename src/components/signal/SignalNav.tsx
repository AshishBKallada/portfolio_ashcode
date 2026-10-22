"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/data/site";
import { introEase } from "@/lib/motion";
import { setPageMode, usePageMode } from "@/theme/mode";
import { Dot, monoLabel } from "./primitives";

const links = [
  { href: "/", label: "Home" },
  { href: "/#index", label: "Work" },
  { href: "/#toolkit", label: "Arsenal" },
  { href: "/resume", label: "Résumé" },
  { href: "/#contact", label: "Contact" },
];

const pill =
  "pointer-events-auto rounded-[5px] border border-white/10 bg-ink/90 text-bone shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md";

/**
 * Fixed chrome in two pills: name, breadcrumb and a menu on the left;
 * availability and the main call to action on the right. The menu drops
 * out of the left pill and closes on Escape, outside click or navigation.
 */
export function SignalNav() {
  const pathname = usePathname();
  const red = usePageMode() === "red";
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-3 p-3 sm:p-4">
      <div ref={rootRef} className="relative">
        <div className={`${pill} flex items-center gap-1 p-1 pl-3`}>
          <Link href="/" className="font-display text-[18px] leading-none tracking-[0.02em] uppercase">
            {site.name}
          </Link>
          <span aria-hidden className="mx-1.5 text-bone/40">/</span>
          <span className={`${monoLabel} hidden text-bone/60 sm:inline`}>{crumb}</span>
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
            className="ml-3 inline-flex min-h-9 items-center gap-2 rounded-[3px] bg-white/10 px-3 text-[14px] transition-colors hover:bg-white/20 sm:ml-10"
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
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id={menuId}
              aria-label="Primary"
              initial={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
              transition={{ duration: 0.45, ease: introEase }}
              className={`${pill} absolute top-full left-0 mt-2 w-[min(20rem,calc(100vw-1.5rem))] p-2`}
            >
              <ul>
                {links.map((link, i) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex min-h-12 items-center justify-between rounded-[3px] px-3 font-serif text-[26px] tracking-[-0.02em] transition-colors hover:bg-white/8"
                    >
                      {link.label}
                      <span className={`${monoLabel} text-bone/40 group-hover:text-flame`}>
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
                    className={`${monoLabel} nav-link text-bone/70 hover:text-bone`}
                  >
                    {s.label} ↗
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <div className={`${pill} flex items-center gap-1 p-1`}>
        {/* Page background: white or red. */}
        <button
          type="button"
          role="switch"
          aria-checked={red}
          aria-label="Red background"
          onClick={() => setPageMode(red ? "white" : "red")}
          className="group flex min-h-9 items-center gap-2 rounded-[3px] px-2.5 transition-colors hover:bg-white/10"
        >
          <span
            aria-hidden
            className={`relative h-[18px] w-8 rounded-full border border-white/25 transition-colors duration-300 ${red ? "bg-flame" : "bg-white"}`}
          >
            <span
              className={`absolute top-1/2 left-[2px] size-3 -translate-y-1/2 rounded-full transition-[translate,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${red ? "translate-x-[14px] bg-cream" : "bg-ink"}`}
            />
          </span>
          <span className={`${monoLabel} hidden w-[3.25rem] text-left text-bone/70 uppercase lg:inline`}>{red ? "Red" : "White"}</span>
        </button>
        <span className={`${monoLabel} hidden items-center gap-2 px-3 text-bone/85 md:flex`}>
          <Dot className="animate-pulse bg-flame" />
          {site.signal.availability}
        </span>
        <a
          href={`mailto:${site.email}`}
          className="inline-flex min-h-9 items-center gap-2 rounded-[3px] bg-cream px-3 text-[14px] font-medium text-brand transition-colors hover:bg-white"
        >
          <Dot className="bg-flame" />
          Get in touch
        </a>
      </div>
    </header>
  );
}
