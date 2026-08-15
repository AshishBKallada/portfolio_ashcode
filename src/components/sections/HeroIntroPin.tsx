"use client";

import { useLenis } from "lenis/react";
import { motion, useMotionValue } from "motion/react";
import { useEffect } from "react";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";

function slideY(scroll: number) {
  const vh = window.innerHeight || 1;
  return -Math.min(Math.max(scroll, 0), vh);
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
    <div className="relative h-[200svh]">
      <div className="sticky top-0 z-20 h-svh overflow-hidden bg-red-600">
        <div className="absolute inset-0 z-0">
          <Intro />
        </div>
        <motion.div
          style={{ y }}
          className="absolute inset-0 z-10 will-change-transform"
        >
          <Hero />
        </motion.div>
      </div>
    </div>
  );
}
