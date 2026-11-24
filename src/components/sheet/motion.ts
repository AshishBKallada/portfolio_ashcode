"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Runs `setup` in a GSAP context scoped to `scope`, skipped when reduced motion is asked for. */
export function useMotion(scope: RefObject<HTMLElement | null>, setup: (root: HTMLElement) => void) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => setup(root), root);
    return () => ctx.revert();
    // setup is defined inline by each section and only needs to run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);
}

/**
 * A sheet is laid down on the desk as it scrolls in: it rises, turns a degree and settles,
 * then the type in its band climbs out of its masks and its parts follow.
 */
export function layDown(sheet: HTMLElement, turn = -1.2) {
  const tl = gsap.timeline({ scrollTrigger: { trigger: sheet, start: "top 82%", once: true } });
  tl.from(sheet, { y: 140, rotate: turn, opacity: 0, duration: 1.3, ease: "expo.out" })
    .from(sheet.querySelectorAll(".sh-band .sh-mask > span"), { yPercent: 110, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.2)
    .from(sheet.querySelectorAll("[data-part]"), { y: 24, opacity: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" }, 0.45);
  return tl;
}
