"use client";

import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { introEase } from "@/lib/motion";

/**
 * The site's image parallax: the picture sits a little oversized in its frame and
 * drifts against the scroll as the frame passes through the viewport, so it reads
 * as a layer behind the page. With `reveal`, the frame first wipes open from the
 * bottom as it scrolls into view, the picture settling from a closer zoom.
 * Transform and clip only; still for reduced motion.
 */
export function ParallaxImage({
  children,
  className = "",
  amount = 8,
  reveal = false,
  style,
}: {
  /** The image (an <img> or next/image), filling the frame. */
  children: ReactNode;
  /** The frame's classes: size, aspect, rounding. It clips the drift. */
  className?: string;
  /** How far the image drifts either way, in % of the frame's height. */
  amount?: number;
  /** Wipe the frame open the first time it scrolls into view. */
  reveal?: boolean;
  /** For an aspect ratio set from the image's own size. */
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  // Oversized just enough that the drift never shows the frame's edge.
  const scale = 1 + (amount * 2.4) / 100;
  const wipe = reveal && !reduce;
  // Watched on the unclipped frame: a fully clipped element can read as never in view.
  const shown = useInView(ref, { once: true, amount: 0.25 });

  return (
    <div ref={ref} style={style} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={wipe ? { clipPath: "inset(100% 0% 0% 0%)" } : false}
        animate={wipe ? { clipPath: shown ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.1, ease: introEase }}
      >
        <motion.div style={reduce ? undefined : { y, scale }} className="absolute inset-0 will-change-transform">
          {/* The zoom settle sits on its own layer so it doesn't fight the drift's scale. */}
          <motion.div
            className="absolute inset-0"
            initial={wipe ? { scale: 1.18 } : false}
            animate={wipe ? { scale: shown ? 1 : 1.18 } : undefined}
            transition={{ duration: 1.4, ease: introEase }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
