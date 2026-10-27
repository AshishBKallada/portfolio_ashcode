"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useEffect, type RefObject } from "react";
import { CloudPillar } from "@/components/sections/contact/CloudPillar";
import { CLOUD_QUALITY } from "@/lib/hero";

/**
 * Pink cloud cutout, painted wide (1000×542) with one flat edge; turned ±90°
 * so the flat edge always faces off-screen. Never mirror it.
 */
export const SIDE_CLOUD = { src: "/images/side-cutout.png", width: 1000, height: 542 };

type Layer = {
  side: "left" | "right";
  /** Vertical anchor inside the section. */
  place: string;
  /** Sizing and visible share per breakpoint, as CSS vars. */
  size: string;
  /** Scroll drift in % of the cloud's own width: off-screen → framed → easing out. */
  drift: [string, string, string];
};

// --h is the cloud's visual height; its visual width is --h × 0.542 and
// --peek is how much of that width sits off-screen at rest.
const RIGHT: Layer = {
  side: "right",
  place: "-bottom-[12%] lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2",
  size: "[--h:36svh] [--peek:0.42] lg:[--h:100svh] lg:[--peek:0.36]",
  drift: ["70%", "0%", "30%"],
};
/** Cursor parallax in px at the pointer's furthest reach. */
const PULL = 18;

function Cloud({
  layer,
  progress,
  mx,
  my,
  still,
}: {
  layer: Layer;
  progress: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  still: boolean;
}) {
  const [from, rest, to] = layer.drift;
  // Arrives while the section scrolls up, holds while it fills the screen,
  // then rolls back out a little as it leaves.
  const x = useTransform(progress, [0, 0.42, 0.62, 1], [from, rest, rest, to]);
  const px = useTransform(mx, (v) => v * PULL);
  const py = useTransform(my, (v) => v * PULL * 0.6);
  const edge =
    layer.side === "left"
      ? "left-[calc(var(--h)*-0.542*var(--peek))]"
      : "right-[calc(var(--h)*-0.542*var(--peek))]";

  return (
    <motion.div
      style={still ? undefined : { x }}
      className={`absolute ${layer.place} ${edge} ${layer.size} h-[var(--h)] w-[calc(var(--h)*0.542)] will-change-transform`}
    >
      <motion.div style={still ? undefined : { x: px, y: py }} className="size-full">
        <div
          className={`absolute top-1/2 left-1/2 aspect-[1000/542] w-[var(--h)] -translate-x-1/2 -translate-y-1/2 ${
            layer.side === "left" ? "rotate-90" : "-rotate-90"
          }`}
        >
          <Image
            src={SIDE_CLOUD.src}
            alt=""
            fill
            draggable={false}
            sizes="(min-width: 1024px) 100vh, 36vh"
            quality={CLOUD_QUALITY}
            // The cut-out is a sunset-pink cloud; drained to plain white here.
            className="object-contain [filter:saturate(0)_brightness(1.06)_drop-shadow(0_30px_40px_rgba(0,0,0,0.35))] select-none"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Right-hand cloud beside the contact statement; drifts in on scroll and
 * responds slightly to the cursor. The marble pillar sits behind it.
 */
export function ContactClouds({
  target,
}: {
  target: RefObject<HTMLElement | null>;
}) {
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 60, damping: 18, mass: 0.6 };
  const mx = useSpring(rawX, spring);
  const my = useSpring(rawY, spring);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  return (
    // Masked at top and bottom so clouds dissolve into the neighbouring
    // sections instead of being sliced off by the section edge.
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]"
    >
      {/* The column stands just behind the right-hand cloud. */}
      <CloudPillar progress={scrollYProgress} mx={mx} my={my} still={reduce} />
      <Cloud layer={RIGHT} progress={scrollYProgress} mx={mx} my={my} still={reduce} />
    </div>
  );
}
