"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useHeroIntro } from "@/components/motion/HeroIntroProvider";
import { AnchorLink } from "@/components/motion/AnchorLink";
import { introEase } from "@/components/motion/intro";
import { site } from "@/data/site";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#linkedin", label: "LinkedIn" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { phase } = useHeroIntro();
  const reduce = useReducedMotion();
  const visible = phase === "done";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
      animate={
        visible || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }
      }
      transition={{ duration: reduce ? 0 : 0.55, ease: introEase }}
      className="fixed inset-x-0 top-0 z-50 bg-transparent font-sans text-white">
      <div className="mx-4 border-b border-white/15 sm:mx-5">
        <div className="flex items-center gap-4 py-3">
          <Link
            href="/"
            className="flex min-w-0 items-baseline gap-2 text-[12.8px] font-bold tracking-[-0.02em] text-white sm:basis-1/2"
            onClick={() => setOpen(false)}
          >
            <span className="truncate">{site.name}</span>
            <span className="hidden truncate text-white/70 sm:inline">
              {site.role}
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden basis-1/2 items-center justify-between gap-4 text-[12.8px] font-bold tracking-[-0.02em] text-white/80 sm:flex"
          >
            {nav.map((item) => (
              <AnchorLink
                key={item.href}
                href={item.href}
                className="nav-link transition-colors hover:text-white"
              >
                {item.label}
              </AnchorLink>
            ))}
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto inline-flex size-8 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 sm:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4 stroke-current"
              fill="none"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 8h16" />
                  <path d="M4 16h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        <nav
          id="mobile-nav"
          aria-label="Mobile"
          hidden={!open}
          className="sm:hidden"
        >
          <ul className="flex flex-col gap-1 pb-4">
            {nav.map((item) => (
              <li key={item.href}>
                <AnchorLink
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2 text-sm font-bold tracking-[-0.02em] text-white transition-colors hover:bg-white/10"
                >
                  {item.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}
