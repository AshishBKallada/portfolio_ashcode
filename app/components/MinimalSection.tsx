"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MinimalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;

    if (!section || !image || !text) return;

    const ctx = gsap.context(() => {
      // Image animation: scale up and move out of view
      gsap.fromTo(
        image,
        {
          scale: 1,
          y: 0,
        },
        {
          scale: 7.5,
          y: -600,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: true,
          },
        }
      );

      // Text animation: scale from smaller to current size
      gsap.fromTo(
        text,
        {
          scale: 0.2,
          opacity: 0.5,
        },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="minimal"
      className="w-full min-h-screen relative overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* Text Section - Behind */}
      <div className="absolute inset-0 flex items-center justify-center px-6 py-16" style={{ zIndex: 1 }}>
        <div ref={textRef} className="relative w-full max-w-8xl shadow-none rounded-3xl p-10 md:p-14 lg:p-16 overflow-hidden">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Main heading - large centered text */}
            <div className="space-y-1 mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-chaney text-black dark:text-white">
                <span className="font-dancing">Building</span>{" "}
                <span className="font-chaney font-bold">Digital</span>
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-chaney font-bold text-black dark:text-white">
                experiences with code
              </h2>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-chaney font-bold text-black dark:text-white">
                and creative solutions
              </h2>
            </div>

            {/* Descriptive paragraph */}
            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-2xl mt-6">
              Web applications, mobile apps, APIs, databases, cloud infrastructure, and scalable systems; all built with modern technologies and best practices.
            </p>

            {/* Bottom text */}
            <div className="mt-12 text-xs text-zinc-500 dark:text-zinc-400">
              trusted by passion
            </div>
          </div>
        </div>
      </div>

      {/* Image Section - Above */}
      <div 
        ref={imageRef}
        className="absolute inset-0 pointer-events-none overflow-hidden" 
        style={{ zIndex: 2, backgroundColor: 'transparent' }}
      >
        <img
          src="/denge2.png"
          alt=""
          className="w-full h-full object-cover object-center grayscale"
          style={{ display: 'block' }}
        />
      </div>
      
    </section>
  );
}

