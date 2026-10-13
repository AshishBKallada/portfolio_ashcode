"use client";

import {
  cubicBezier,
  motion,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";

/** Flying through: the banks gather speed as they near the lens, then ease off. */
const rush = cubicBezier(0.5, 0, 0.3, 1);

export const CLOUDS = {
  cumulus: { src: "/images/clouds/cumulus.png", ratio: 1000 / 563 },
  wisp: { src: "/images/clouds/wisp.png", ratio: 1000 / 548 },
  dusk: { src: "/images/clouds/dusk.png", ratio: 1 },
};

type Bank = {
  img: keyof typeof CLOUDS;
  /** Centre of the cloud on the stage, in % of its width and height. */
  at: [number, number];
  /** Width in vw at desktop; phones scale it up by --m. */
  w: number;
  /** 0 = far haze that stays to frame the headline, 1 = right at the lens. */
  depth: number;
  /** Where it slides as the camera passes through, in vw / vh. */
  exit: [number, number];
  flip?: boolean;
};

// Near banks close the frame and fly past the lens; far banks drift a little
// and stay behind as atmosphere around the revealed headline. Clouds never
// fade, so near banks travel far enough to clear the screen completely,
// even at their full swell and the wider phone size.
const BANKS: Bank[] = [
  { img: "cumulus", at: [12, 12], w: 40, depth: 0.15, exit: [-8, -6] },
  { img: "dusk", at: [88, 16], w: 26, depth: 0.15, exit: [8, -6] },
  { img: "wisp", at: [80, 88], w: 50, depth: 0.2, exit: [10, 8], flip: true },
  { img: "wisp", at: [50, 22], w: 70, depth: 0.5, exit: [0, -140] },
  { img: "wisp", at: [24, 78], w: 66, depth: 0.6, exit: [-150, 80] },
  { img: "cumulus", at: [78, 74], w: 62, depth: 0.6, exit: [150, 80], flip: true },
  { img: "cumulus", at: [18, 40], w: 58, depth: 0.8, exit: [-160, -20] },
  { img: "wisp", at: [84, 40], w: 62, depth: 0.8, exit: [160, -25], flip: true },
  { img: "cumulus", at: [50, 56], w: 96, depth: 1, exit: [0, 160] },
];

function CloudBank({
  bank,
  progress,
  mx,
  my,
  still,
}: {
  bank: Bank;
  progress: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  still: boolean;
}) {
  const { src, ratio } = CLOUDS[bank.img];
  const near = bank.depth >= 0.5;
  const x = useTransform(progress, [0, 0.8], ["0vw", `${bank.exit[0]}vw`], { ease: rush });
  const y = useTransform(progress, [0, 0.8], ["0vh", `${bank.exit[1]}vh`], { ease: rush });
  // Drawn at the size it swells to and scaled down from there, so it never
  // stretches past its own pixels on the way to the lens.
  const grow = 1 + bank.depth * 1.2;
  const scale = useTransform(progress, [0, 0.8], [1 / grow, 1], { ease: rush });
  // Off-screen near banks stop being drawn once they've flown clear.
  const visibility = useTransform(progress, (v) => (near && v >= 0.8 ? "hidden" : "visible"));
  const px = useTransform(mx, (v) => v * bank.depth * 26);
  const py = useTransform(my, (v) => v * bank.depth * 16);

  if (still && near) return null;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${bank.at[0]}%`,
        top: `${bank.at[1]}%`,
        width: `calc(${bank.w * grow}vw * var(--m))`,
        aspectRatio: ratio,
        zIndex: Math.round(bank.depth * 10),
      }}
    >
      <motion.div
        style={still ? { scale: 1 / grow } : { x, y, scale, visibility }}
        className="size-full"
      >
        <motion.div style={still ? undefined : { x: px, y: py }} className="size-full">
          <div className="relative size-full">
            <Image
              src={src}
              alt=""
              fill
              draggable={false}
              loading="eager"
              sizes={`(min-width: 640px) ${Math.round(bank.w * grow)}vw, ${Math.round(bank.w * grow * 1.7)}vw`}
              className={`object-contain select-none ${bank.flip ? "-scale-x-100" : ""}`}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * The bank of clouds the projects stage opens inside. `progress` runs 0→1 as
 * the camera flies through: near banks swell, slide past the edges and thin
 * out, far wisps only drift and lighten, staying to frame what's behind.
 * Each bank leans toward the cursor by its depth.
 * Opacity ranges run explicitly from 0 to 1 so they hold their end values
 * however motion drives them.
 */
export function CloudVeil({
  progress,
  mx,
  my,
  still,
}: {
  progress: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  still: boolean;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 [--m:1.7] sm:[--m:1]">
      {BANKS.map((bank, i) => (
        <CloudBank key={i} bank={bank} progress={progress} mx={mx} my={my} still={still} />
      ))}
    </div>
  );
}
