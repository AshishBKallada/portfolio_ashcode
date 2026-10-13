"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";

/** Ionic marble column cutout, 560×1000, capital up. */
export const PILLAR = "/images/pillar.png";
const MASK =
  "[mask-image:url(/images/pillar.png)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]";

/**
 * A marble column leaning out of the right-hand cloud of the contact
 * statement: it sits just behind that cloud, which swallows its base. It rises with the clouds as the section arrives,
 * settles at a tilt with the capital toward the copy, and sinks back a little
 * as the section leaves; a raking light crosses the stone and it leans with
 * the cursor like the clouds around it.
 */
export function CloudPillar({
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
  const y = useTransform(progress, [0, 0.42, 0.62, 1], ["45%", "0%", "0%", "12%"]);
  const rotate = useTransform(progress, [0, 0.42, 0.62, 1], [-30, -12, -12, -7]);
  const sheen = useTransform(progress, [0.25, 0.75], ["-100%", "100%"]);
  const px = useTransform(mx, (v) => v * 14);
  const py = useTransform(my, (v) => v * 8);

  return (
    <motion.div
      style={still ? { rotate: -12 } : { y, rotate }}
      className="absolute right-[calc(var(--ph)*0.56*-0.42)] bottom-[9%] h-[var(--ph)] w-[calc(var(--ph)*0.56)] origin-[50%_90%] will-change-transform [--ph:30svh] lg:top-[30%] lg:right-[calc(var(--ph)*0.56*-0.46)] lg:bottom-auto lg:[--ph:74svh]"
    >
      <motion.div style={still ? undefined : { x: px, y: py }} className="size-full">
        <div className="relative size-full">
          <Image
            src={PILLAR}
            alt=""
            fill
            draggable={false}
            sizes="(min-width: 1024px) 46vh, 20vh"
            className="object-contain drop-shadow-[-30px_40px_50px_rgba(0,0,0,0.45)] select-none"
          />
          {/* Shade the outer flank so light reads as coming from the copy.
              Plain alpha, no blend modes: blending a moving layer makes the
              browser recomposite everything under it every frame. */}
          <div
            className={`absolute inset-0 bg-[linear-gradient(270deg,rgba(60,8,8,0.4),transparent_55%)] ${MASK}`}
          />
          {!still && (
            // The sweep slides on transform inside a fixed mask, so it moves
            // on the compositor instead of repainting every frame.
            <div className={`absolute inset-0 overflow-hidden ${MASK}`}>
              <motion.div
                style={{ x: sheen }}
                className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,250,240,0.28)_50%,transparent_60%)]"
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
