"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { site } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

const gallery = site.about.gallery;

export function AboutMedia({ children }: { children?: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Pin the gallery and translate the track sideways as the page scrolls down.
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track || reduceMotion) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - container.clientWidth;
      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Parallax inside each frame: the photo drifts against the track.
      gsap.utils
        .toArray<HTMLElement>("[data-parallax-photo]")
        .forEach((photo) => {
          gsap.fromTo(
            photo,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: photo.parentElement,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
    }, container);

    return () => ctx.revert();
  }, [reduceMotion]);

  // Pinned as one screen: the red header band holds still while only the
  // gallery below it scrolls sideways.
  return (
    <div ref={containerRef} className="flex h-dvh w-full flex-col">
      {children ? (
        <div
          style={{ backgroundColor: site.navbar.bg }}
          className="relative z-20 flex h-1/4 min-h-[13rem] shrink-0 flex-col justify-end px-4 pt-[68px] pb-5 text-white [--border:rgba(255,255,255,0.35)] [--foreground:#ffffff] [--muted:rgba(255,255,255,0.72)] [--subtle:rgba(255,255,255,0.5)] sm:px-5"
        >
          {children}
        </div>
      ) : null}

      <div
        className={`relative min-h-0 flex-1 ${
          reduceMotion
            ? "snap-x snap-mandatory overflow-x-auto"
            : "overflow-hidden"
        }`}
      >
        <div ref={trackRef} className="flex h-full w-max will-change-transform">
          {gallery.map((src) => (
            <div
              key={src}
              className="relative h-full w-screen shrink-0 snap-start overflow-hidden"
            >
              <div
                data-parallax-photo
                className="absolute inset-y-0 -inset-x-[8%] will-change-transform"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  loading="eager"
                  sizes="100vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
