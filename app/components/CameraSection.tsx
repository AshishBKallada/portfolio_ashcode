"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CameraSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    if (!section || !image || !text) return;

    gsap.set(image, { scale: 0.1 });
    gsap.set(text, { opacity: 1 });

    const ctx = gsap.context(() => {
      gsap.to(image, {
        scale: 1.5,
        rotate: 10,
        rotation: 10,
        rotationX: 10,
        rotationY: 10,
        rotationZ: 10,
        rotationOrigin: "center center",
        rotationXOrigin: "center center",
        rotationYOrigin: "center center",
        rotationZOrigin: "center center",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: true,
        },
      });

      gsap.to(text, {
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="w-full h-[90vh] flex items-center justify-center bg-white dark:bg-zinc-950 py-20 px-6 relative z-30"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          ref={textRef}
          className="flex flex-col items-center justify-center text-center space-y-6 z-0"
        >
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-chaney text-black dark:text-white">
              <span className="font-dancing">Crafting</span>{" "}
              <span className="font-chaney font-bold">Precision</span>
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-chaney font-bold text-black dark:text-white">
              with every line of code
            </h2>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-chaney font-bold text-black dark:text-white">
              and every pixel placed
            </h2>
          </div>
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-2xl mt-6">
            Where artistry meets functionality, creating digital experiences that resonate.
          </p>
          <div className="mt-12 text-xs text-zinc-500 dark:text-zinc-400">
            forged with dedication
          </div>
        </div>
      </div>
      <div 
        ref={imageRef} 
        className="relative w-full max-w-4xl flex items-center justify-center z-10"
      >
        <Image
          src="/elegant-japanese-katana-swords-with-red-scabbards-floral-detailing-crossed.png"
          alt="Elegant Japanese Katana Sword"
          width={800}
          height={600}
          className="object-contain grayscale"
          priority
        />
      </div>
    </section>
  );
}

