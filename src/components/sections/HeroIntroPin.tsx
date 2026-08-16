"use client";

import { useLenis } from "lenis/react";
import { motion, useMotionValue } from "motion/react";
import { useEffect } from "react";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";

function slideY(scroll: number) {
  const vh = window.innerHeight || 1;
  return -Math.round(Math.min(Math.max(scroll, 0), vh));
}

export function HeroIntroPin() {
  const y = useMotionValue(0);

  const lenis = useLenis((instance) => {
    y.set(slideY(instance.scroll));
  });

  useEffect(() => {
    if (lenis) return;

    const onScroll = () => y.set(slideY(window.scrollY));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis, y]);

  return (
    <>
      <div className="hero-stage sticky top-0 z-10 h-dvh min-h-svh overflow-hidden bg-transparent">
        <div className="absolute inset-0 z-0">
          <Intro />
        </div>
        <motion.div
          style={{ y }}
          transformTemplate={(_values, generated) => {
            const nextY = _values.y;
            const n =
              typeof nextY === "number" ? nextY : parseFloat(String(nextY ?? 0));
            return !n ? "none" : generated;
          }}
          className="absolute inset-0 z-10 bg-transparent"
        >
          <Hero />
        </motion.div>
      </div>
      <div className="h-dvh" aria-hidden />
    </>
  );
}
