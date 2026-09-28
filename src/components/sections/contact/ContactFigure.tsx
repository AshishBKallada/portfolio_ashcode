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
      className="pointer-events-none absolute right-0 bottom-0 z-0 flex w-[42%] max-w-[280px] items-end justify-end opacity-90 sm:w-[34%] sm:max-w-[320px] lg:w-[28%] lg:max-w-[360px]"
    >
      <motion.div
        className="w-full origin-bottom-right"
        style={reduceMotion ? undefined : { rotate, x }}
      >
        <Image
          src={src}
          alt=""
          loading="eager"
          width={1152}
          height={2048}
          sizes="(max-width: 1024px) 40vw, 28vw"
          className="h-auto w-full select-none object-contain object-right-bottom"
        />
      </motion.div>
    </div>
  );
}
