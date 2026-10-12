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

/**
 * Pink cloud cutout, painted wide (1000×542) with one flat edge; turned ±90°
 * so the flat edge always faces off-screen. Never mirror it.
 */
export const SIDE_CLOUD = "/images/side-cutout.png";

type Layer = {
  side: "left" | "right";
  /** Front clouds frame the copy; back clouds add depth behind them. */
  depth: "front" | "back";
  /** Vertical anchor inside the section. */
  place: string;
  /** Sizing, visible share and visibility per breakpoint, as CSS vars. */
  size: string;
  /** Scroll drift in % of the cloud's own width: off-screen → framed → easing out. */
  drift: [string, string, string];
  /** Cursor parallax in px at the pointer's furthest reach. */
  pull: number;
  float: string;
};

// --h is the cloud's visual height; its visual width is --h × 0.542 and
// --peek is how much of that width sits off-screen at rest.
const LAYERS: Layer[] = [
  {
    side: "left",
    depth: "back",
    place: "top-[4%]",
    size: "hidden lg:block [--h:72svh] [--peek:0.55]",
    drift: ["-45%", "0%", "-20%"],
    pull: 8,
    float: "cloud-float [animation-duration:11s]",
  },
  {
    side: "right",
    depth: "back",
    place: "bottom-[2%]",
    size: "hidden lg:block [--h:72svh] [--peek:0.55]",
    drift: ["45%", "0%", "20%"],
    pull: 8,
    float: "cloud-float [animation-duration:12s] [animation-delay:-4s]",
  },
  {
    side: "left",
    depth: "front",
    place: "-top-[4%]",
    size: "[--h:36svh] [--peek:0.42] lg:hidden",
    drift: ["-70%", "0%", "-30%"],
    pull: 18,
    float: "cloud-float [animation-duration:9s] [animation-delay:-2s]",
  },
  {
    side: "right",
    depth: "front",
    place: "-bottom-[12%] lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2",
    size: "[--h:36svh] [--peek:0.42] lg:[--h:100svh] lg:[--peek:0.36]",
    drift: ["70%", "0%", "30%"],
    pull: 18,
    float: "cloud-float [animation-duration:10s] [animation-delay:-6s]",
  },
];

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
  const px = useTransform(mx, (v) => v * layer.pull);
  const py = useTransform(my, (v) => v * layer.pull * 0.6);
  const back = layer.depth === "back";
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
        <div className={`relative size-full ${still ? "" : layer.float}`}>
          <div
            className={`absolute top-1/2 left-1/2 aspect-[1000/542] w-[var(--h)] -translate-x-1/2 -translate-y-1/2 ${
              layer.side === "left"
                ? back ? "rotate-[82deg]" : "rotate-90"
                : back ? "-rotate-[82deg]" : "-rotate-90"
            } ${back ? "opacity-60 blur-[2px]" : ""}`}
          >
            <Image
              src={SIDE_CLOUD}
              alt=""
              fill
              draggable={false}
              sizes="(min-width: 1024px) 100vh, 36vh"
              className={`object-contain select-none ${
                back
                  ? ""
                  : "drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]"
              }`}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Two layers of clouds on each side of the contact statement. They drift in
 * from the edges as the section arrives, frame the copy while it fills the
 * screen and roll back out as it leaves; the front layer leans further toward
 * the cursor than the softer back layer, and each bobs on its own slow
 * rhythm. Phones keep one cloud in the empty top-left and bottom-right corners,
 * clear of the copy.
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
      {/* Warm glow behind the statement so the clouds read as lit from it. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(255,214,150,0.45),transparent_70%)]" />
      {LAYERS.map((layer) => (
        <Cloud
          key={`${layer.side}-${layer.depth}`}
          layer={layer}
          progress={scrollYProgress}
          mx={mx}
          my={my}
          still={reduce}
        />
      ))}
    </div>
  );
}
