"use client";

import Image from "next/image";
import { Parallax } from "@/components/motion/Parallax";
import { HERO_SEAT_CLOUD, CLOUD_QUALITY } from "@/lib/hero";

// Pieces of the hero's sky placed between the sections. Decorative.

/** [04] Archive: one small cloud resting on the last row, bringing the sky
 *  back just before the contact section's clouds. */
export function RestingCloud() {
  return (
    <div aria-hidden className="pointer-events-none absolute right-[14%] bottom-0 z-10 w-[clamp(9rem,17vw,17rem)] translate-y-[38%]">
      <Parallax speed={60}>
      <Image
        src={HERO_SEAT_CLOUD.src}
        alt=""
        width={HERO_SEAT_CLOUD.width}
        height={HERO_SEAT_CLOUD.height}
        sizes="17vw"
        quality={CLOUD_QUALITY}
        className="h-auto w-full select-none"
      />
      </Parallax>
    </div>
  );
}
