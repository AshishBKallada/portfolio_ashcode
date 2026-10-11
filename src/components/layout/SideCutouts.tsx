"use client";

import gsap from "gsap";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef } from "react";

/** Pink cloud image pinned to both viewport edges mid-page. */
export const SIDE_CUTOUT = "/images/side-cutout.png";

// Scroll range the cutouts stay on screen for: from the top of the Projects
// ("Not here to follow the hype") section to the bottom of Contact.
const START = "#projects";
const END = "#contact";
// Where in the viewport the range's edges have to reach, as a share of its
// height: Projects' top past 75% to show, Contact's bottom above 25% to hide.
const ENTER = 0.75;
const LEAVE = 0.25;

/**
 * The same cutout fixed to each side of the viewport, fading in as Projects
 * scrolls into view and out once Contact has scrolled past. Fixed, not
 * sticky, so both sides ride along identically. The left copy is turned 90°
 * and the right -90°, so the wide cloud stands tall along each edge. Hidden
 * below the lg breakpoint, where it would sit on the copy.
 *
 * Visibility is read from live section rects on every scroll (as BackToTop
 * does) rather than a ScrollTrigger, since the hero pin's spacer shifts the
 * sections after triggers above it have measured.
 */
export function SideCutouts() {
  const rootRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);

  const update = useCallback(() => {
    const root = rootRef.current;
    const start = document.querySelector(START);
    const end = document.querySelector(END);
    if (!root || !start || !end) return;
    const vh = window.innerHeight;
    const on =
      start.getBoundingClientRect().top < vh * ENTER &&
      end.getBoundingClientRect().bottom > vh * LEAVE;
    if (on === activeRef.current) return;
    activeRef.current = on;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(Array.from(root.children), {
      autoAlpha: on ? 1 : 0,
      y: on ? 0 : 24,
      duration: reduce ? 0 : 0.6,
      ease: "power2.out",
      overwrite: true,
    });
  }, []);

  const lenis = useLenis(update);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.set(Array.from(root.children), { autoAlpha: 0, y: 24 });
    update();
    window.addEventListener("resize", update);
    if (!lenis) window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [lenis, update]);

  // The box keeps the image's own (wide) size and is rotated about its
  // centre, so after the turn the box width is the visual height: a full
  // screen. The centre is parked a short way inside the edge, leaving about
  // two thirds of the cloud on screen.
  const size = "100svh";
  const inset = `calc(${size} * -0.34)`;
  const img =
    "absolute top-1/2 h-auto max-w-none -translate-y-1/2 select-none drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]";

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-y-0 right-0 left-0 z-20 hidden lg:block"
    >
      <img
        src={SIDE_CUTOUT}
        alt=""
        draggable={false}
        width={1000}
        height={542}
        style={{ width: size, left: inset }}
        className={`${img} rotate-90`}
      />
      <img
        src={SIDE_CUTOUT}
        alt=""
        draggable={false}
        width={1000}
        height={542}
        style={{ width: size, right: inset }}
        className={`${img} -rotate-90`}
      />
    </div>
  );
}
