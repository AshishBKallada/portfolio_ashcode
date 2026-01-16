"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function MarqueeSection() {
  const marqueeRow1Ref = useRef<HTMLDivElement>(null);
  const marqueeRow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row1 = marqueeRow1Ref.current;
    if (row1) {
      const firstItem = row1.querySelector<HTMLElement>(':first-child');
      const row1Width = firstItem ? firstItem.offsetWidth * 2 : 0;

      gsap.to(row1, {
        x: row1Width,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    }

    const row2 = marqueeRow2Ref.current;
    if (row2) {
      const firstItem = row2.querySelector<HTMLElement>(':first-child');
      const row2Width = firstItem ? firstItem.offsetWidth * 2 : 0;

      gsap.to(row2, {
        x: -row2Width,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    }
  }, []);

  const row1Items = [
    "ASHCODE", "16+", "FULL STACK DEVELOPER", "2024", "CODING MEETS PASSION", 
    "26+",     "PROJECTS", "ASHCODE", "100%", "FULL STACK DEVELOPER", "CODING MEETS PASSION"
  ];

  const row2Items = [
    "CODING MEETS PASSION", "ASHCODE", "50+", "FULL STACK DEVELOPER", "2024", 
    "PROJECTS", "ASHCODE", "26+", "CODING MEETS PASSION", "16+", "FULL STACK DEVELOPER"
  ];

  return (
    <section className="w-full bg-white overflow-hidden py-8 md:py-12">
      <div className="overflow-hidden mb-4">
        <div ref={marqueeRow1Ref} className="flex whitespace-nowrap items-center">
          {[...row1Items, ...row1Items].map((item, i) => (
            <div key={i} className="inline-flex items-center px-6 md:px-12 flex-shrink-0">
              <span className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black font-chaney uppercase">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        <div ref={marqueeRow2Ref} className="flex whitespace-nowrap items-center">
          {[...row2Items, ...row2Items].map((item, i) => (
            <div key={i} className="inline-flex items-center px-6 md:px-12 flex-shrink-0">
              <span className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black font-chaney uppercase">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

