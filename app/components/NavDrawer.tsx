"use client";

import { useEffect, useRef } from "react";

import { NAV_ITEMS, type SectionId } from "../lib/nav-items";

type NavDrawerProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: SectionId) => void;
};

export default function NavDrawer({ open, onClose, onNavigate }: NavDrawerProps) {
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstFocusRef.current?.focus(), 50);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-[100] min-h-[100dvh] overflow-hidden">
      <div
        id="site-nav-drawer"
        className="nav-drawer-panel absolute inset-0 flex min-h-[100dvh] w-full flex-col bg-black/50 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-2xl md:px-12 lg:px-16"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="mb-6 flex shrink-0 items-center justify-between gap-4 md:mb-8">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Menu</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/10 md:size-12"
            aria-label="Close menu"
          >
            <span className="relative block size-4">
              <span className="absolute left-1/2 top-1/2 block h-px w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
              <span className="absolute left-1/2 top-1/2 block h-px w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white" />
            </span>
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col justify-center gap-1 overflow-y-auto py-4 md:gap-2 md:py-8">
          {NAV_ITEMS.map(({ label, id }, i) => (
            <button
              key={id}
              ref={i === 0 ? firstFocusRef : undefined}
              type="button"
              onClick={() => {
                onNavigate(id);
                onClose();
              }}
              className="text-left font-chaney text-[clamp(2.5rem,10vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-[0.04em] text-white transition-opacity hover:opacity-80"
            >
              {label}
            </button>
          ))}

          <a
            href="/projects"
            onClick={onClose}
            className="text-left font-chaney text-[clamp(2.25rem,9vw,4rem)] font-bold uppercase leading-[0.92] tracking-[0.04em] text-white/90 transition-opacity hover:opacity-80"
          >
            Projects
          </a>

          <div className="my-6 h-px w-full max-w-md bg-gradient-to-r from-transparent via-white/25 to-transparent md:my-10" />

          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45 md:mb-3">More</p>
          <div className="flex flex-col gap-3 font-safiro text-xl text-white/85 md:gap-4 md:text-2xl">
            <a href="mailto:ashercode4u@gmail.com" onClick={onClose} className="transition-opacity hover:opacity-70">
              Book a call
            </a>
            <a href="/privacy-policy" onClick={onClose} className="transition-opacity hover:opacity-70">
              Privacy
            </a>
            <a href="/terms-and-conditions" onClick={onClose} className="transition-opacity hover:opacity-70">
              Terms
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
