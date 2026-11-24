"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

// The cover's red dot, loose on the desk: it trails the pointer and swells over anything clickable.
export function RedDot() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dot.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.dataset.on = "true";
      el.dataset.hover = String(Boolean((e.target as Element).closest("a, button")));
    };
    const leave = () => (el.dataset.on = "false");
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <div ref={dot} className="sh-cursor" aria-hidden="true" />;
}
