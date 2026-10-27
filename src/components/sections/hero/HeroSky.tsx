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
import { CLOUD_QUALITY, HERO_SEAT_CLOUD } from "@/lib/hero";

type Layer = {
  src: string;
  width: number;
  height: number;
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

// Two depths of white and pink cloud in the lower right: the far one soft and
// slow, the near one sharp and fast. The top stays clear for the navbar and
// the lower left for the statement.
const LAYERS: Layer[] = [
  { ...HERO_SEAT_CLOUD, box: "top-[58%] -right-[12%] w-[34vw] max-md:hidden", depth: 0.55, drift: "up" },
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
  const px = useTransform(mx, (v) => v * (14 + depth * 58));
  const py = useTransform(my, (v) => v * (10 + depth * 34));

  return (
    <motion.div style={still ? undefined : { y }} className={`absolute ${layer.box}`}>
      <motion.div style={still ? undefined : { x: px, y: py }}>
        <Image
          src={layer.src}
          alt=""
          width={layer.width}
          height={layer.height}
          sizes="45vw"
          quality={CLOUD_QUALITY}
          loading="eager"
          draggable={false}
          style={{
            opacity: 0.35 + depth * 0.6,
            filter: `blur(${(1 - depth) * 5}px) sepia(0.12) saturate(1.15)`,
            rotate: `${layer.rotate ?? 0}deg`,
            scale:
              layer.flip === "x" ? "-1 1" : layer.flip === "y" ? "1 -1" : layer.flip === "xy" ? "-1 -1" : undefined,
          }}
          className="h-auto w-full select-none"
        />
      </motion.div>
    </motion.div>
  );
}

/** Layered parallax sky behind the hero figure; decorative. */
export function HeroSky({ mx: mxProp, my: myProp }: { mx?: MotionValue<number>; my?: MotionValue<number> } = {}) {
  const reduce = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 62, damping: 16, mass: 0.55 };
  const localMx = useSpring(rawX, spring);
  const localMy = useSpring(rawY, spring);
  const mx = mxProp ?? localMx;
  const my = myProp ?? localMy;

  useEffect(() => {
    if (mxProp || myProp || reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mxProp, myProp, reduce, rawX, rawY]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
      {LAYERS.map((layer, i) => (
        <SkyLayer key={i} layer={layer} scroll={scrollY} mx={mx} my={my} still={reduce} />
      ))}
    </div>
  );
}
