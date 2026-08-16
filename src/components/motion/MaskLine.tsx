"use client";

import { motion } from "motion/react";
import { introEase } from "@/components/motion/intro";

type Props = {
  children: React.ReactNode;
  active: boolean;
  delay?: number;
  duration?: number;
  className?: string;
  reduce?: boolean;
  as?: "div" | "span";
};

// Line-mask reveal: overflow-hidden shell + inner block that slides up from
// translateY(110%) so text rolls into view. Driven by an explicit `active`
// flag so callers can gate it on scroll, intro phase, or any other signal.
export function MaskLine({
  children,
  active,
  delay = 0,
  duration = 0.85,
  className,
  reduce = false,
  as = "span",
}: Props) {
  const Shell = as === "div" ? motion.div : motion.span;
  const Inner = as === "div" ? motion.div : motion.span;
  const block = as === "div" ? "block" : "inline-block";

  return (
    <Shell
      style={{ overflow: "hidden" }}
      className={`${block}${className ? ` ${className}` : ""}`}
    >
      <Inner
        style={{ display: block === "block" ? "block" : "inline-block", willChange: "transform" }}
        initial={reduce ? { y: 0 } : { y: "110%" }}
        animate={active || reduce ? { y: "0%" } : { y: "110%" }}
        transition={{
          duration: reduce ? 0 : duration,
          ease: introEase,
          delay: reduce ? 0 : delay,
        }}
      >
        {children}
      </Inner>
    </Shell>
  );
}
