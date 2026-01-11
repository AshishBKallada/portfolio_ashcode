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
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Reserved for future animations if needed
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full min-h-screen flex items-center justify-center bg-transparent px-6 py-16"
    >
      <div className="relative w-full max-w-8xl bg-transparent dark:bg-transparent shadow-none rounded-3xl p-10 md:p-14 lg:p-16 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-12 items-center">
          <div className="space-y-4">
          
            <p className="text-xl md:text-2xl text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
              I create digital experiences that spark curiosity and leave a mark. Every interface I design is a space
              where creativity and functionality meet to tell unique stories. I craft intuitive, performant products
              that feel effortless—because great experiences should simply work.
            </p>
          </div>

         
        </div>

        <div className="mt-56 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
          <span className="text-zinc-800 dark:text-white font-semibold">UX/UI Designer</span>
          <span className="text-zinc-500 dark:text-zinc-400"> and </span>
          <span className="text-zinc-800 dark:text-white font-semibold">Developer</span>
          <span className="text-zinc-500 dark:text-zinc-400">
            , crafting intuitive interfaces and digital experiences that connect with people.
          </span>
        </div>
        <div className="w-full flex justify-end absolute bottom-0 right-0 pr-4 pb-4 pointer-events-none" style={{zIndex: 10}}>
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
    </section>
  );
}

