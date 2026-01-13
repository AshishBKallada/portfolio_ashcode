"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function MarqueeSection() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const isScrollingDown = useRef(false);
  const marqueeAnimation = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Initial animation - moving right
    // Get the width of one set of items for seamless loop
    const firstItem = marquee.querySelector<HTMLElement>(':first-child');
    const marqueeWidth = firstItem ? firstItem.offsetWidth * 4 : 0;

    marqueeAnimation.current = gsap.to(marquee, {
      x: marqueeWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    const handleWheel = (e: WheelEvent) => {
      const firstItem = marquee.querySelector<HTMLElement>(':first-child');
      const marqueeWidth = firstItem ? firstItem.offsetWidth * 4 : 0;

      const icons = marquee.querySelectorAll<HTMLElement>('.marquee-icon');
      
      if (e.deltaY > 0 && !isScrollingDown.current) {
        // Scrolling down - reverse direction
        isScrollingDown.current = true;
        marqueeAnimation.current?.kill();

        marqueeAnimation.current = gsap.to(marquee, {
          x: -marqueeWidth,
          duration: 20,
          ease: "none",
          repeat: -1,
        });

        // Rotate all icons (marquee moving left)
        gsap.to(icons, {
          rotate: 180,
          duration: 0.3,
          ease: "power2.out",
        });
      } else if (e.deltaY < 0 && isScrollingDown.current) {
        // Scrolling up - back to original direction
        isScrollingDown.current = false;
        marqueeAnimation.current?.kill();

        marqueeAnimation.current = gsap.to(marquee, {
          x: marqueeWidth,
          duration: 20,
          ease: "none",
          repeat: -1,
        });

        // Rotate all icons back (marquee moving right)
        gsap.to(icons, {
          rotate: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      marqueeAnimation.current?.kill();
    };
  }, []);

  const marqueeText = "THRIVE BEYOND LIMITS";
  const marqueeItems = Array(8).fill(null);

  return (
    <section className="w-full bg-white overflow-hidden border-t border-black/10 py-3 relative">
      <div ref={marqueeRef} className="flex whitespace-nowrap items-center">
        {marqueeItems.map((_, i) => (
          <div key={i} className="inline-flex items-center gap-4 px-8 flex-shrink-0">
            <span className="text-sm md:text-base font-medium text-black/60">
              {marqueeText}
            </span>
            <img
              src="/yinyang-abstract-back-white-swirl-white-background-splashing.png"
              alt="Yin Yang"
              className="marquee-icon h-8 md:h-12 w-auto opacity-100"
              // style={{ filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.3))" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

