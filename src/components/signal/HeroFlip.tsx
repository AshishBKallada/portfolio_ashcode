"use client";

import { type MotionValue, motion, useMotionValueEvent, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { HERO_FIGURE, HERO_FLIP_CANVAS, HERO_FLIP_ORIGIN, HERO_FLIP_POSES } from "@/lib/hero";

/** Share of the hero's reveal the somersault runs over. */
const FLIP: [number, number] = [0.04, 0.88];
const ANGLES = [0, ...HERO_FLIP_POSES.map((pose) => pose.angle), 360];

/** The pose nearest `deg` round the flip; the last slot is the takeoff again. */
const nearest = (deg: number) =>
  ANGLES.reduce((best, a, i) => (Math.abs(a - deg) < Math.abs(ANGLES[best] - deg) ? i : best), 0);

/**
 * The hero figure, front-flipping as the reveal scrolls. Only a handful of
 * poses are painted, so the one nearest the flip's angle shows, turned the rest
 * of the way: the spin reads continuous and the pose snaps in step with it.
 * Fills its box like an `object-contain object-bottom` image of HERO_FIGURE.
 */
export function HeroFlip({ reveal, still }: { reveal: MotionValue<number>; still: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const shown = useRef(0);

  const deg = useTransform(reveal, FLIP, [0, 360], { clamp: true });
  const rotate = useTransform(deg, (d) => d - ANGLES[nearest(d)]);

  // Swap poses straight on the elements: no render per scroll frame.
  const show = (d: number) => {
    const i = nearest(d) % (ANGLES.length - 1);
    if (i === shown.current) return;
    const poses = rootRef.current?.querySelectorAll<HTMLImageElement>("[data-pose]");
    poses?.[shown.current]?.style.setProperty("opacity", "0");
    poses?.[i]?.style.setProperty("opacity", "1");
    shown.current = i;
  };
  useMotionValueEvent(deg, "change", show);
  // Landing part-way down the page (a reload, a back navigation) starts on the right pose.
  useEffect(() => show(deg.get()), []); // eslint-disable-line react-hooks/exhaustive-deps

  const canvas = {
    left: `${HERO_FLIP_CANVAS.left * 100}%`,
    top: `${HERO_FLIP_CANVAS.top * 100}%`,
    width: `${HERO_FLIP_CANVAS.width * 100}%`,
    height: `${HERO_FLIP_CANVAS.height * 100}%`,
  };

  return (
    <div ref={rootRef} className="absolute inset-0 [container-type:size]">
      <motion.div
        style={{
          rotate: still ? 0 : rotate,
          transformOrigin: `${HERO_FLIP_ORIGIN.x * 100}% ${HERO_FLIP_ORIGIN.y * 100}%`,
          aspectRatio: `${HERO_FIGURE.width} / ${HERO_FIGURE.height}`,
          width: `min(100cqw, 100cqh * ${HERO_FIGURE.width / HERO_FIGURE.height})`,
        }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-pose
          src={HERO_FIGURE.src}
          alt=""
          draggable={false}
          width={HERO_FIGURE.width}
          height={HERO_FIGURE.height}
          className="absolute inset-0 h-full w-full select-none"
        />
        {still
          ? null
          : HERO_FLIP_POSES.map((pose) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={pose.src}
                data-pose
                src={pose.src}
                alt=""
                draggable={false}
                decoding="async"
                style={{ ...canvas, opacity: 0 }}
                className="absolute max-w-none select-none"
              />
            ))}
      </motion.div>
    </div>
  );
}
