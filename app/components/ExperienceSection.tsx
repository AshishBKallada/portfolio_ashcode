"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceSectionProps {
  animationDelay?: number;
  duration?: number;
}

export default function ExperienceSection({
  animationDelay = 0,
  duration = 1,
}: ExperienceSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const intro = introRef.current;
    const section1 = section1Ref.current;
    const section2 = section2Ref.current;

    if (!container || !intro || !section1 || !section2) return;

    // Calculate total width for horizontal scroll
    const introWidth = intro.offsetWidth;
    const section1Width = section1.offsetWidth;
    const section2Width = section2.offsetWidth;
    const totalWidth = introWidth + section1Width + section2Width;

    // Set container width
    gsap.set(container, { width: totalWidth });

    // Create horizontal scroll animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: container.parentElement,
      start: "top top",
      end: () => `+=${totalWidth - window.innerWidth}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const x = -(totalWidth - window.innerWidth) * progress;
        gsap.set(container, { x: x });
      },
    });


    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      id="experience"
      className="w-full bg-white overflow-hidden"
    >
      {/* Horizontal Scroll Container */}
      <div className="relative w-full h-screen">
        <div 
          ref={containerRef}
          className="flex h-screen"
        >
          {/* Page 1: My journey so far */}
          <div 
            ref={introRef}
            className="w-screen h-screen flex-shrink-0 bg-white flex items-center justify-center px-16"
          >
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black font-chaney">
                <span className="text-base md:text-lg lg:text-xl font-bold text-black font-chaney">
                  my journey so far !
                </span>
              </h2>
            </div>
          </div>

          {/* Page 2: Experience Section 1 */}
          <div 
            ref={section1Ref}
            className="w-screen h-screen flex-shrink-0 bg-black flex items-center justify-center px-16 relative overflow-hidden"
          >
            {/* Empty section */}
          </div>

          {/* Page 3: Experience Section 2 */}
          <div 
            ref={section2Ref}
            className="w-screen h-screen flex-shrink-0 bg-white flex items-center justify-center px-16 relative"
          >
            {/* Empty section */}
          </div>
        </div>
      </div>
    </section>
  );
}
