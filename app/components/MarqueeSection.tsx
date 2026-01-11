"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function MarqueeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingDown = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const marquees = container.querySelectorAll<HTMLElement>(".marquee");
    const arrows = container.querySelectorAll<HTMLElement>(".marquee img");

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && !isScrollingDown.current) {
        isScrollingDown.current = true;
        gsap.to(marquees, {
          x: "-200%",
          duration: 4,
          ease: "none",
          repeat: -1,
        });
        gsap.to(arrows, {
          rotate: 180,
          duration: 0.3,
        });
      } else if (e.deltaY < 0 && isScrollingDown.current) {
        isScrollingDown.current = false;
        gsap.to(marquees, {
          x: "0%",
          duration: 4,
          ease: "none",
          repeat: -1,
        });
        gsap.to(arrows, {
          rotate: 0,
          duration: 0.3,
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const marqueeText = "THRIVE BEYOND LIMITS";
  const marquees = Array(6).fill(null);

  return (
    <section className="w-full bg-black py-8 overflow-hidden">
      <div ref={containerRef} className="flex">
        {marquees.map((_, index) => (
          <div
            key={index}
            className="marquee flex-shrink-0 flex items-center justify-center gap-4 px-6"
            style={{ transform: "translateX(-100%)" }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white whitespace-nowrap">
              {marqueeText}
            </h1>
            <img
              src="/yinyang-abstract-back-white-swirl-white-background-splashing.png"
              alt="Yin Yang"
              className="h-8 md:h-12 w-auto text-white"
              style={{ filter: "drop-shadow(0 0 10px white)" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

