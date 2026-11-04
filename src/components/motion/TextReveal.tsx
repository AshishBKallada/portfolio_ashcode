"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";
import { introEase } from "@/lib/motion";

/**
 * The site's heading reveal: each word rises out of its own mask, tilting level as it
 * lands, one after another, the first time the line scrolls into view. Body copy uses
 * RevealItem (a fade-up) on the same ease, so every section enters the same way.
 * Screen readers get the line whole; reduced motion shows it still.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  /** Seconds to wait once in view. */
  delay?: number;
  /** The element the line renders as (a heading, or a span inside one). */
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const reduce = useReducedMotion() ?? false;
  const words = text.split(" ");
  if (reduce) return <Tag className={className}>{text}</Tag>;
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        transition={{ staggerChildren: 0.06, delayChildren: delay }}
        className="inline"
      >
        {words.map((word, i) => (
          // Each word clipped by its own box, so it rises from below the baseline.
          <Fragment key={i}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                // Tipped back a few degrees as it rises, settling level as it lands.
                className="inline-block origin-[0%_100%]"
                variants={{
                  hidden: { y: "105%", rotate: 6 },
                  show: { y: "0%", rotate: 0 },
                }}
                transition={{ duration: 0.8, ease: introEase }}
              >
                {word}
              </motion.span>
            </span>
            {/* The space sits between the masks: inside one, an inline-block trims it away. */}
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
