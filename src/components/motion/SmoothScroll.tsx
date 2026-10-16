"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const LENIS_OPTIONS = {
  autoRaf: false,
  lerp: 0.1,
  duration: 1.4,
  anchors: true,
  syncTouch: false,
} as const;

// One clock for everything: GSAP's ticker drives Lenis, and every Lenis
// scroll updates ScrollTrigger in the same frame, so scrubbed tweens never
// trail the smoothed scroll position by a frame.
function ScrollTriggerSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tick);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // A root Lenis publishes itself through a global store, so it mounts
  // beside the page rather than around it: toggling reduced motion then
  // starts or stops smoothing without remounting the whole tree.
  return (
    <>
      {!reduce && <ReactLenis root options={LENIS_OPTIONS} />}
      <ScrollTriggerSync />
      {children}
    </>
  );
}
