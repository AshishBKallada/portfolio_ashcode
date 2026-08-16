"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { introEase } from "@/components/motion/intro";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "span";
};

// Reveals the wrapped block whenever it enters the viewport — whether the
// user scrolls into it from above or from below. The mask sits inside an
// overflow-hidden shell so the inner text rolls up into view instead of
// simply fading, giving a compact "unfold" feel.
export function SectionReveal({
  children,
  className,
  delay = 0,
  as = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.35, margin: "0px 0px -8% 0px" });
  const active = reduce ? true : inView;

  const Shell = as === "span" ? motion.span : motion.div;
  const Inner = as === "span" ? motion.span : motion.div;

  return (
    <Shell
      ref={ref}
      className={className}
      style={{ overflow: "hidden", display: as === "span" ? "inline-block" : undefined }}
    >
      <Inner
        initial={reduce ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
        animate={
          active
            ? { y: "0%", opacity: 1 }
            : { y: "110%", opacity: 0 }
        }
        transition={{
          duration: reduce ? 0 : 0.85,
          ease: introEase,
          delay: reduce ? 0 : delay,
        }}
        style={{
          display: as === "span" ? "inline-block" : "block",
          willChange: "transform",
        }}
      >
        {children}
      </Inner>
    </Shell>
  );
}
