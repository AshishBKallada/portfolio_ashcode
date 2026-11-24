"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

// GSAP's ticker drives Lenis, and every Lenis scroll updates ScrollTrigger in the same frame.
function Sync() {
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
  const [reduce, setReduce] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <>
      {!reduce && (
        <ReactLenis
          root
          options={{ autoRaf: false, lerp: 0.09, anchors: true }}
        />
      )}
      <Sync />
      {children}
    </>
  );
}
