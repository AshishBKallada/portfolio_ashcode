"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { RefObject } from "react";
import { site } from "@/data/site";

type AboutOverlayProps = {
  targetRef: RefObject<HTMLElement | null>;
};

export function AboutOverlay({ targetRef }: AboutOverlayProps) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.38, 0.68, 1],
    [0, 42, 42, 0],
  );
  const smoothRotate = useSpring(rotate, {
    stiffness: 48,
    damping: 24,
    mass: 0.9,
    restDelta: 0.001,
  });

  return (
    <div className="pointer-events-none absolute right-20 -bottom-36 z-10 sm:right-28 sm:-bottom-44 lg:right-36 lg:-bottom-52">
      <motion.div
        className="origin-bottom-right will-change-transform"
        style={reduceMotion ? undefined : { rotate: smoothRotate }}
      >
        <Image
          src={site.about.overlay}
          alt=""
          width={1189}
          height={896}
          sizes="(max-width: 640px) 55vw, 38vw"
          className="h-auto w-[min(68vw,34rem)] select-none object-contain object-right-bottom sm:w-[min(52vw,40rem)] lg:w-[min(46vw,44rem)]"
        />
      </motion.div>
    </div>
  );
}
