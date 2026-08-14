"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function ContactFigure({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.98", "start 0.42"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-45, 0]);
  const x = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);

  return (
    <div
      ref={ref}
      className="relative ml-auto w-full max-w-[360px] shrink-0 sm:max-w-[420px] lg:max-w-none lg:w-[min(42vw,520px)]"
    >
      <motion.div
        className="origin-bottom-right"
        style={reduceMotion ? undefined : { rotate, x }}
      >
        <Image
          src={src}
          alt=""
          width={1152}
          height={927}
          sizes="(max-width: 1024px) 80vw, 42vw"
          className="h-auto w-full select-none object-contain object-right object-bottom grayscale"
        />
      </motion.div>
    </div>
  );
}
