"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { CLOUDS } from "@/components/sections/projects/CloudVeil";
import {
  EXIT_CLOUDS_IN,
  EXIT_CLOUDS_OUT,
  exitAt,
} from "@/components/sections/hero/heroIntroCycle";

gsap.registerPlugin(ScrollTrigger);

type Bank = {
  img: "cumulus" | "wisp";
  /** Centre when the screen is covered, in % of the stage. */
  at: [number, number];
  /** Width in vw; phones scale it by --m. */
  w: number;
  /** Off-screen start, in vw / vh from `at`. */
  from: [number, number];
  /** Where it drifts off to as the clouds part, in vw / vh from `at`. */
  to: [number, number];
  flip?: boolean;
};

// Four banks roll in from the sides and two from top and bottom; at the
// midpoint they overlap across the whole screen, then each carries on
// outward, so the gap opens from the middle.
const BANKS: Bank[] = [
  { img: "cumulus", at: [24, 30], w: 92, from: [-110, -10], to: [-95, -35] },
  { img: "wisp", at: [76, 28], w: 98, from: [110, -10], to: [95, -40], flip: true },
  { img: "cumulus", at: [28, 74], w: 98, from: [-110, 20], to: [-100, 40], flip: true },
  { img: "wisp", at: [74, 76], w: 98, from: [110, 20], to: [100, 40] },
  { img: "wisp", at: [50, 12], w: 110, from: [0, -80], to: [0, -90] },
  { img: "cumulus", at: [50, 56], w: 112, from: [0, 100], to: [0, 110] },
];

/**
 * The hero's exit curtain: once the figures have slid away, clouds roll in
 * from every edge and close over the screen while the About-me poster is
 * swapped in behind, then the banks part
 * outward from the middle to reveal it. The banks never fade: they wait just
 * beyond the edges at full strength and are flown through. Translate only,
 * so the cutouts stay sharp and the whole move rides the compositor.
 */
export function HeroCloudCover() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const banks = gsap.utils.toArray<HTMLElement>("[data-bank]", root);
      // Phones draw the banks wider (--m), so they travel further to clear.
      const m = () => parseFloat(getComputedStyle(root).getPropertyValue("--m")) || 1;
      const scrub = (from: number, to: number) => ({
        start: () => exitAt(from),
        end: () => exitAt(to),
        scrub: true,
        invalidateOnRefresh: true,
      });

      banks.forEach((el, i) => {
        const bank = BANKS[i];
        gsap.fromTo(
          el,
          { x: () => `${bank.from[0] * m()}vw`, y: `${bank.from[1]}vh` },
          {
            x: 0,
            y: 0,
            ease: "power2.out",
            immediateRender: true,
            scrollTrigger: scrub(EXIT_CLOUDS_IN[0], EXIT_CLOUDS_IN[1]),
          },
        );
        gsap.fromTo(
          el,
          { x: 0, y: 0 },
          {
            x: () => `${bank.to[0] * m()}vw`,
            y: `${bank.to[1]}vh`,
            ease: "power2.in",
            immediateRender: false,
            scrollTrigger: scrub(EXIT_CLOUDS_OUT[0], EXIT_CLOUDS_OUT[1]),
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[6] overflow-hidden [--m:1.9] md:[--m:1]"
    >
      {BANKS.map((bank, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${bank.at[0]}%`,
            top: `${bank.at[1]}%`,
            width: `calc(${bank.w}vw * var(--m))`,
            aspectRatio: CLOUDS[bank.img].ratio,
          }}
        >
          <div data-bank className="relative size-full will-change-transform">
            <Image
              src={CLOUDS[bank.img].src}
              alt=""
              fill
              loading="eager"
              sizes={`${Math.round(bank.w * 1.9)}vw`}
              className={`object-contain select-none ${bank.flip ? "-scale-x-100" : ""}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
