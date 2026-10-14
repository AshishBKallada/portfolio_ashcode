"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { site } from "@/data/site";
import { aboutGallery } from "@/components/sections/hero/screenFeed";

gsap.registerPlugin(ScrollTrigger);

const gallery = site.about.gallery;

type Props = {
  children?: ReactNode;
  /** Playing on the hero laptop's screen: the hero's scroll engine slides
      the gallery (see screenFeed) instead of this section pinning itself. */
  embedded?: boolean;
};

export function AboutMedia({ children, embedded = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Embedded: hand the hero's scroll engine a way to slide the track, with
  // the same photo parallax as the pinned version.
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!embedded || !container || !track) return;
    const photos = Array.from(track.querySelectorAll<HTMLElement>("[data-parallax-photo]"));
    const distance = () => Math.max(track.scrollWidth - container.clientWidth, 0);
    aboutGallery.distance = distance;
    aboutGallery.set = (progress) => {
      const x = -distance() * progress;
      track.style.transform = `translate3d(${x}px,0,0)`;
      const frame = container.clientWidth;
      photos.forEach((photo, i) => {
        // Each photo drifts from -6% to 6% as its frame crosses the view.
        const t = Math.min(Math.max((-x - (i - 1) * frame) / (2 * frame), 0), 1);
        photo.style.transform = `translate3d(${-6 + 12 * t}%,0,0)`;
      });
    };
    return () => {
      aboutGallery.distance = undefined;
      aboutGallery.set = undefined;
    };
  }, [embedded]);

  // Pin the gallery and translate the track sideways as the page scrolls down.
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (embedded || !container || !track || reduceMotion) return;

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
  }, [embedded, reduceMotion]);

  // Pinned as one screen: the red header band holds still while only the
  // gallery below it scrolls sideways.
  return (
    <div ref={containerRef} className="flex h-dvh w-full flex-col">
      {children ? (
        <div
          style={{ backgroundColor: site.navbar.bg }}
          className="relative z-20 flex h-1/4 min-h-[13rem] shrink-0 flex-col justify-end px-4 pt-[68px] pb-5 text-cream [--border:rgba(244,241,234,0.35)] [--foreground:#f4f1ea] [--muted:rgba(244,241,234,0.78)] [--subtle:rgba(244,241,234,0.55)] sm:px-5"
        >
          {children}
        </div>
      ) : null}

      <div
        className={`relative min-h-0 flex-1 ${
          reduceMotion && !embedded
            ? "snap-x snap-mandatory overflow-x-auto"
            : "overflow-hidden"
        }`}
      >
        <div ref={trackRef} className="flex h-full w-max will-change-transform">
          {gallery.map((src, i) => (
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
              <span className="absolute bottom-4 left-4 bg-cream px-2 py-1 font-sans text-[11px] leading-none font-medium tracking-[0.14em] text-brand uppercase tabular-nums sm:bottom-5 sm:left-5">
                {String(i + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
