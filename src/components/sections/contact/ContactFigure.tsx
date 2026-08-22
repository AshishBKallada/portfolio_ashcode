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
  const rotate = useTransform(scrollYProgress, [0, 1], [-38, 0]);
  const x = useTransform(scrollYProgress, [0, 1], ["24%", "0%"]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute right-0 bottom-0 z-0 w-[62%] max-w-[440px] opacity-90 sm:w-[46%] sm:max-w-[520px] lg:w-[40%] lg:max-w-[560px]"
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
          sizes="(max-width: 1024px) 60vw, 40vw"
          className="h-auto w-full select-none object-contain object-right-bottom grayscale"
        />
      </motion.div>
    </div>
  );
}
