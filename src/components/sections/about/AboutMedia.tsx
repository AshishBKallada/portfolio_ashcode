"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { site } from "@/data/site";
import { AboutOverlay } from "@/components/sections/about/AboutOverlay";

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
      className="relative mt-8 min-h-[16rem] w-full aspect-[16/7] sm:mt-10 sm:min-h-[20rem] lg:min-h-[24rem]"
    >
      <div className="absolute inset-0 overflow-hidden">
        {gallery.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="100vw"
            className={`object-cover transition-opacity duration-300 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <AboutOverlay targetRef={containerRef} />
    </div>
  );
}
