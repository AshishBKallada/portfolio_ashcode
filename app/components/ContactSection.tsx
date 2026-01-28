"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ContactSection() {
  const marqueeRow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const row2Items = ["ASHCODE"];

  return (
    <section className="w-full min-h-screen flex flex-col justify-between bg-white px-4 md:px-6 lg:px-8 py-12 md:py-16">
      {/* Marquee Section */}
    
      {/* Bottom Center - Three Rectangular Buttons */}
      <div className="w-full flex justify-center">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <button className="px-6 md:px-8 py-3 md:py-4 border border-black text-black text-sm md:text-base font-medium font-safiro cursor-pointer hover:-translate-y-1 transition-all duration-200">
            GET IN TOUCH
          </button>
          <button className="px-6 md:px-8 py-3 md:py-4 border border-black text-black text-sm md:text-base font-medium font-safiro cursor-pointer hover:-translate-y-1 transition-all duration-200">
            SEND A BRIEF
          </button>
          <button className="px-6 md:px-8 py-3 md:py-4 border border-black text-black text-sm md:text-base font-medium font-safiro cursor-pointer hover:-translate-y-1 transition-all duration-200">
            BOOK A CALL
          </button>
        </div>
      </div>
        <div className="w-full bg-white overflow-hidden py-8 md:py-12 flex items-center">
        <div className="overflow-hidden w-full">
          <div ref={marqueeRow2Ref} className="flex whitespace-nowrap items-center">
            {[...row2Items, ...row2Items, ...row2Items, ...row2Items].map((item, i) => (
              <div key={i} className="inline-flex items-center px-8 md:px-16 lg:px-20 flex-shrink-0">
                <span className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-purple-900 font-chaney uppercase">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    
      
    
    </section>
  );
}
