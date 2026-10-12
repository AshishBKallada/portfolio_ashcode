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
import { useEffect } from "react";
import { HERO_CLOUD } from "@/components/sections/hero/heroIntroCycle";
import { SIDE_CLOUD } from "@/components/sections/contact/ContactClouds";

type Layer = {
  src: string;
  /** Box placement and size; the image fills it. */
  box: string;
  /** Depth 0 (far) → 1 (near): drives blur, opacity, scroll and cursor travel. */
  depth: number;
  /** The side cutout's flat edge is its bottom; flip so it always faces off-screen. */
  flip?: "x" | "y" | "xy";
  /**
   * Scroll drift away from the edge the layer is cut off by, so its flat
   * edge never slides into view: top layers rise, bottom layers sink, and
   * the sky parts around the figure as you fly up through it.
   */
  drift: "up" | "down";
  rotate?: number;
};

// Four depths of photographic cloud, the way the Awwwards 2021 site built
// its sky: far layers soft and slow, near layers sharp and fast. The lower
// left stays clear for the statement.
const LAYERS: Layer[] = [
  { src: SIDE_CLOUD, box: "-top-[7%] -left-[6%] w-[34vw] max-md:w-[64vw]", depth: 0.1, flip: "y", rotate: 2, drift: "up" },
  { src: SIDE_CLOUD, box: "-top-[9%] -right-[8%] w-[40vw] max-md:w-[72vw]", depth: 0.25, flip: "xy", rotate: -2, drift: "up" },
  { src: HERO_CLOUD, box: "top-[56%] -right-[14%] w-[36vw] max-md:hidden", depth: 0.55, drift: "down" },
  { src: SIDE_CLOUD, box: "-bottom-[14%] -right-[6%] w-[46vw] max-md:-bottom-[24%] max-md:w-[80vw]", depth: 0.95, rotate: -3, drift: "down" },
];

function SkyLayer({
  layer,
  scroll,
  mx,
  my,
  still,
}: {
  layer: Layer;
  scroll: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  still: boolean;
}) {
  const { depth } = layer;
  // Nearer clouds rush past faster; each moves away from its cut edge.
  const sign = layer.drift === "up" ? -1 : 1;
  const y = useTransform(scroll, (v) => v * sign * (0.15 + depth * 0.9));
  const px = useTransform(mx, (v) => v * (6 + depth * 40));
  const py = useTransform(my, (v) => v * (4 + depth * 22));

  return (
    <motion.div style={still ? undefined : { y }} className={`absolute ${layer.box}`}>
      <motion.div style={still ? undefined : { x: px, y: py }}>
        <div
          className={still ? "" : "cloud-float"}
          style={{
            animationDuration: `${14 - depth * 6}s`,
            animationDelay: `${-depth * 7}s`,
          }}
        >
          <Image
            src={layer.src}
            alt=""
            width={1000}
            height={layer.src === HERO_CLOUD ? 1000 : 542}
            sizes="45vw"
            draggable={false}
            style={{
              opacity: 0.35 + depth * 0.6,
              filter: `blur(${(1 - depth) * 5}px)`,
              rotate: `${layer.rotate ?? 0}deg`,
              scale:
                layer.flip === "x" ? "-1 1" : layer.flip === "y" ? "1 -1" : layer.flip === "xy" ? "-1 -1" : undefined,
            }}
            className="h-auto w-full select-none"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Layered parallax sky behind the hero figure; decorative. */
export function HeroSky() {
  const reduce = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 50, damping: 18, mass: 0.7 };
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
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {/* Golden-hour light pooling behind the figure. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_55%_45%,color-mix(in_srgb,var(--gold)_22%,transparent),transparent_70%)]" />
      {LAYERS.map((layer, i) => (
        <SkyLayer key={i} layer={layer} scroll={scrollY} mx={mx} my={my} still={reduce} />
      ))}
    </div>
  );
}
