"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { INTRO_STACK_START } from "@/components/sections/hero/heroIntroCycle";

gsap.registerPlugin(ScrollTrigger);

// Intro slides up over the pinned hero. While it rises, the copy lags behind
// the panel and settles; once landed it scrolls away with the page.
export function IntroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const vh = () => window.innerHeight;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: () => vh() * 0.3, scale: 0.9 },
        {
          y: 0,
          scale: 1,
          ease: "none",
          immediateRender: true,
          scrollTrigger: {
            start: () => vh() * INTRO_STACK_START,
            end: () => vh() * (INTRO_STACK_START + 1),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={ref} className="w-full will-change-transform">
      {children}
    </div>
  );
}
