"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { mainScrollScroller, prefersReducedMotion } from "../lib/main-scroller";

gsap.registerPlugin(ScrollTrigger);

const BG_IMAGE = "/hero-background.jpg";

type IntroCardSectionProps = {
  heading?: string;
  subheading?: string;
};

export default function IntroCardSection({
  heading = "Hi there, I am ASHISH B KALLADA from God's own country 🌴",
  subheading = "Full-stack developer — I build and ship web products from slick UIs to APIs that scale.",
}: IntroCardSectionProps) {
  const imageStageRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = imageStageRef.current;
    const card = imageCardRef.current;
    if (!stage || !card) return;

    if (prefersReducedMotion()) {
      gsap.set(card, { clearProps: "all" });
      return;
    }

    const scroller = mainScrollScroller();
    const sc = scroller ? { scroller } : {};

    const ctx = gsap.context(() => {
      gsap.set(card, {
        scale: 0.32,
        transformOrigin: "0% 0%",
      });

      gsap.to(card, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top 92%",
          end: "top 18%",
          scrub: 0.6,
          ...sc,
        },
      });
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="intro"
      className="relative z-10 flex w-full shrink-0 flex-col bg-white px-1 sm:px-1.5 md:px-2"
      aria-label="Introduction"
    >
      <div className="flex w-full flex-col">
        <div className="relative isolate flex min-h-[min(85dvh,40rem)] w-full shrink-0 items-center justify-center px-6 py-20 md:min-h-[min(80dvh,44rem)] md:px-10 md:py-24">
          <div className="flex max-w-4xl flex-col items-center gap-4 text-center md:gap-5">
            <h2 className="font-safiro text-[clamp(1.75rem,4.5vw,2.85rem)] font-normal leading-[1.12] tracking-[-0.02em] text-[#2a2624] md:text-[clamp(2rem,3.8vw,3.25rem)]">
              {heading}
            </h2>
            <p className="max-w-[min(100%,32rem)] font-safiro text-[clamp(1rem,2.2vw,1.2rem)] font-light leading-[1.5] text-[#9a9590] md:max-w-2xl md:text-[clamp(1.05rem,1.8vw,1.35rem)]">
              {subheading}
            </p>
          </div>
        </div>

        <div className="flex flex-col p-2 md:p-3">
          <div
            ref={imageStageRef}
            className="relative h-[100dvh] min-h-[100dvh] w-full"
          >
            <div
              ref={imageCardRef}
              className="absolute left-0 top-0 h-full w-full overflow-hidden rounded-[2rem] will-change-transform md:rounded-[3rem] lg:rounded-[3.5rem]"
            >
              <div className="absolute inset-0 scale-105">
                <Image
                  src={BG_IMAGE}
                  alt=""
                  fill
                  className="object-cover object-center blur-md brightness-[0.72] saturate-[1.15]"
                  sizes="100vw"
                  priority={false}
                />
              </div>
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/35"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
