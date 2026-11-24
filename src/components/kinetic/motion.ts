"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Runs `setup` in a GSAP context scoped to `scope`, unless the visitor asked for reduced motion.
 * Everything it creates is reverted on unmount, so content is never left hidden.
 */
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

/** The parts of a block marked `data-reveal` rise in one after another as the block enters. */
export function revealParts(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    const parts = group.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!parts.length) return;
    gsap.from(parts, {
      y: 28,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.075,
      scrollTrigger: { trigger: group, start: "top 85%", once: true },
    });
  });
}
