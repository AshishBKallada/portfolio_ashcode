"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { contact } from "@/data/home";

/**
 * The stair, cropped to its narrow window and stood up like a doorway at the end of the
 * corridor. The picture drifts slowly inside its frame as the section passes.
 */
export function ContactDoorway() {
  const frame = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);
  const { photo } = contact;

  return (
    <div ref={frame} className="relative aspect-[480/1100] w-full overflow-hidden bg-ink/5">
      <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 22vw, 48vw" className="object-cover" />
      </motion.div>
    </div>
  );
}
