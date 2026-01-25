"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function MarqueeSection() {
  const marqueeRow1Ref = useRef<HTMLDivElement>(null);
  const marqueeRow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Row 1 - Scroll right
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

    // Row 2 - Scroll left
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

  // Row 1 content
  const row1Items = [
    "ASHCODE", "16+", "FULL STACK DEVELOPER", "2024", "CODING MEETS PASSION", 
    "26+", "PROJECTS", "ASHCODE", "100%", "FULL STACK DEVELOPER", "CODING MEETS PASSION"
  ];

  // Row 2 content
  const row2Items = [
    "CODING MEETS PASSION", "ASHCODE", "50+", "FULL STACK DEVELOPER", "2024", 
    "PROJECTS", "ASHCODE", "26+", "CODING MEETS PASSION", "16+", "FULL STACK DEVELOPER"
  ];

  return (
    <section className="w-full bg-white overflow-hidden py-8 md:py-12">
      {/* Row 1 */}
      <div className="overflow-hidden mb-4">
        <div ref={marqueeRow1Ref} className="flex whitespace-nowrap items-center">
          {[...row1Items, ...row1Items].map((item, i) => (
            <div key={i} className="inline-flex items-center px-16 md:px-36 flex-shrink-0">
              <span className="text-[20rem] md:text-[28rem] lg:text-[36rem] xl:text-[44rem] font-bold text-black/10 font-chaney uppercase leading-none">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="overflow-hidden">
        <div ref={marqueeRow2Ref} className="flex whitespace-nowrap items-center">
          {[...row2Items, ...row2Items].map((item, i) => (
            <div key={i} className="inline-flex items-center px-6 md:px-12 flex-shrink-0">
              <span className="text-8xl md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-bold text-black font-chaney uppercase">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

