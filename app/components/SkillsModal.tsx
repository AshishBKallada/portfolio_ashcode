"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

import { lockPageScroll, prefersReducedMotion } from "../lib/main-scroller";

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

type SkillsModalProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
  categories: Record<string, readonly string[]>;
};

function getModalRect() {
  const pad = 12;
  const maxW = Math.min(window.innerWidth - pad * 2, 1152);
  const maxH = Math.min(window.innerHeight - pad * 2, window.innerHeight * 0.92);
  const left = (window.innerWidth - maxW) / 2;
  const top = (window.innerHeight - maxH) / 2;
  return { left, top, width: maxW, height: maxH, borderRadius: 32 };
}

export default function SkillsModal({
  open,
  onClose,
  anchorRef,
  categories,
}: SkillsModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const closingRef = useRef(false);

  const animateOpen = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const content = contentRef.current;
    if (!panel || !backdrop || !content) return;

    const from = anchor?.getBoundingClientRect();
    const to = getModalRect();

    if (!from || prefersReducedMotion()) {
      gsap.set(panel, {
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        borderRadius: to.borderRadius,
      });
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(content, { opacity: 1 });
      return;
    }

    gsap.set(panel, {
      left: from.left,
      top: from.top,
      width: from.width,
      height: from.height,
      borderRadius: 9999,
    });
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(content, { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    tl.to(backdrop, { opacity: 1, duration: 0.45 }, 0);
    tl.to(
      panel,
      {
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        borderRadius: to.borderRadius,
        duration: 0.55,
      },
      0,
    );
    tl.to(content, { opacity: 1, duration: 0.32 }, 0.22);
  }, [anchorRef]);

  const animateClose = useCallback(
    (done: () => void) => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      const backdrop = backdropRef.current;
      const content = contentRef.current;
      if (!panel || !backdrop || !content) {
        done();
        return;
      }

      const to = anchor?.getBoundingClientRect();
      if (!to || prefersReducedMotion()) {
        done();
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: done,
      });
      tl.to(content, { opacity: 0, duration: 0.18 }, 0);
      tl.to(
        panel,
        {
          left: to.left,
          top: to.top,
          width: to.width,
          height: to.height,
          borderRadius: 9999,
          duration: 0.5,
        },
        0.06,
      );
      tl.to(backdrop, { opacity: 0, duration: 0.35 }, 0.12);
    },
    [anchorRef],
  );

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    animateClose(() => {
      closingRef.current = false;
      setMounted(false);
      onClose();
    });
  }, [animateClose, onClose]);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useLayoutEffect(() => {
    if (!mounted || !open) return;
    animateOpen();
    const t = window.setTimeout(() => closeRef.current?.focus(), 400);
    return () => window.clearTimeout(t);
  }, [mounted, open, animateOpen]);

  useEffect(() => {
    if (!mounted) return;
    const unlock = lockPageScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlock();
    };
  }, [mounted, requestClose]);

  useEffect(() => {
    const onResize = () => {
      if (!open || !panelRef.current || closingRef.current) return;
      const to = getModalRect();
      gsap.set(panelRef.current, {
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        borderRadius: to.borderRadius,
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-auto fixed inset-0 z-[150]">
      <div
        ref={backdropRef}
        className="absolute inset-0 overflow-hidden opacity-0"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b2e22] via-[#1a5a40] to-[#2f7a58]" />
        <div className="absolute -left-[18%] top-[-10%] h-[72%] w-[72%] rounded-full bg-[#6ee7a8]/30 blur-[90px]" />
        <div className="absolute -right-[14%] bottom-[-12%] h-[68%] w-[68%] rounded-full bg-[#14532d]/45 blur-[110px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#052117]/55 via-transparent to-[#134e35]/35" />
        <div
          className="absolute inset-0 opacity-[0.38] mix-blend-soft-light"
          style={{ backgroundImage: GRAIN_BG, backgroundSize: "128px 128px" }}
        />
        <div className="absolute inset-0 backdrop-blur-md bg-[#0f3328]/25" />
      </div>

      <button
        type="button"
        className="absolute inset-0 z-0"
        aria-label="Close skills"
        onClick={requestClose}
      />

      <div
        ref={panelRef}
        className="fixed z-10 flex flex-col overflow-hidden bg-[#f3faf5]/90 shadow-[0_24px_80px_rgba(15,51,40,0.35)] backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Skills"
        style={{ left: 0, top: 0, width: 0, height: 0 }}
      >
        <div ref={contentRef} className="flex min-h-0 flex-1 flex-col opacity-0">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#3d2e26]/10 px-5 py-4 md:px-8 md:py-5">
            <p className="font-safiro text-lg font-medium tracking-tight text-[#3d2e26] md:text-xl">
              Stack &amp; tools
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={requestClose}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[#3d2e26]/15 bg-white/60 text-[#3d2e26] transition hover:bg-white"
              aria-label="Close"
            >
              <span className="relative block size-3.5">
                <span className="absolute left-1/2 top-1/2 block h-px w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-1/2 top-1/2 block h-px w-3.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center overflow-hidden px-3 py-3 sm:px-4 md:px-6 md:py-5 lg:px-8">
            <div className="mx-auto w-full max-w-[72rem] origin-center scale-[0.88] sm:scale-95 md:scale-100">
              <div className="grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-4 sm:gap-x-3 md:grid-cols-4 md:gap-x-4 md:gap-y-4 lg:grid-cols-7 lg:gap-x-5">
                {Object.entries(categories).map(([category, skills]) => (
                  <div key={category} className="min-w-0">
                    <h3 className="mb-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#3d2e26]/55 md:mb-2 md:text-[10px]">
                      {category}
                    </h3>
                    <ul className="flex flex-col gap-1 md:gap-1.5">
                      {skills.map((skill) => (
                        <li
                          key={skill}
                          className="font-safiro text-[10px] leading-tight text-[#3d2e26] md:text-[11px] lg:text-xs"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
