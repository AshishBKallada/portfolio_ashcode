"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { site } from "@/data/site";

const gallery = site.about.gallery;

export function AboutMedia() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduceMotion) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % gallery.length);
    }, 900);

    return () => window.clearInterval(timer);
  }, [visible, reduceMotion]);

  return (
    <div
      ref={containerRef}
      className="mt-8 flex aspect-[16/7] min-h-[16rem] gap-2 sm:mt-10 sm:min-h-[20rem] sm:gap-3 lg:min-h-[24rem]"
    >
      <div className="relative w-3/4 overflow-hidden rounded-xl bg-surface">
        {gallery.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="75vw"
            className={`object-cover transition-opacity duration-300 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="relative flex w-1/4 items-end overflow-hidden rounded-xl">
        <Image
          src={site.about.cardImage}
          alt=""
          width={1280}
          height={854}
          sizes="25vw"
          className="h-auto w-full object-contain object-bottom grayscale"
        />
      </div>
    </div>
  );
}
