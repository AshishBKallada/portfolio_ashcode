"use client";

import { useEffect, useRef } from "react";

interface AboutMeSectionProps {
  animationDelay?: number;
  duration?: number;
  trigger?: string | Element | null;
}

export default function AboutMeSection({
  animationDelay = 0,
  duration = 1.5,
  trigger,
}: AboutMeSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  }, []);

  return (
    <div
      ref={sectionRef}
      className="w-full min-h-screen flex items-center justify-center px-16 py-16"
    >
      <div className="relative w-full max-w-8xl shadow-none rounded-3xl p-10 md:p-14 lg:p-16 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-12 items-center">
          <div className="space-y-4">

            <p className="text-xl md:text-2xl text-white leading-relaxed max-w-3xl">
              I bridge the gap between abstract imagination and technical precision. By merging high-performance engineering with intentional design, I craft digital experiences that feel intuitive and move with purpose. To me, code is more than logic, it’s a medium for storytelling, ensuring every interaction leaves a lasting impression.
            </p>
          </div>


        </div>

        <div className="mt-56 text-sm text-white leading-relaxed max-w-xl">
          <span className="text-white font-semibold">Mentor</span>
          <span className="text-white/70"> and </span>
          <span className="text-white font-semibold">Full Stack Developer </span>
          <span className="text-white/70">
            building scalable applications and performant digital experiences that work effortlessly for the people who use them          </span>
        </div>
        <div className="w-full flex justify-end absolute bottom-0 right-0 pb-4 pointer-events-none" style={{ zIndex: 10 }}>
          <div className="relative w-56 h-72 md:w-64 md:h-80 lg:w-72 lg:h-96 overflow-hidden">
            <img
              src="/3d-rendering-triangle-water.jpg"
              alt="Portrait"
              className="absolute bottom-0 right-0 w-4/5 h-4/5 object-cover grayscale"
              style={{ zIndex: 2 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

