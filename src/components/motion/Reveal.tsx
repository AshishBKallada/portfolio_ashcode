"use client";

import { motion } from "motion/react";
import { introEase } from "@/components/motion/intro";

const variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={variants}
      transition={{ duration: 0.65, ease: introEase }}
    >
      {children}
    </motion.div>
  );
}

export function RevealText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <RevealItem className={className}>{children}</RevealItem>
  );
}
