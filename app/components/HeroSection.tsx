"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const podiumRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const image = imageRef.current;
    const podium = podiumRef.current;
    if (!hero || !image) return;

    const ctx = gsap.context(() => {
      gsap.to(image, {
        yPercent: 40,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, hero);

    if (podium) {
      gsap.to(podium, {
        y: -15,
        duration: 2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(image, {
        x: relX * 30,
        y: relY * 20,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(podium, {
        x: -relX * 30,
        y: -relY * 20,
        duration: 0.5,
        ease: "power2.out",
      });

    };

    const handlePointerLeave = () => {
      gsap.to(image, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      ctx.revert();
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div ref={heroRef} className="w-full h-full flex items-end justify-center bg-white relative overflow-hidden">
      <div className="absolute bottom-12 left-12 z-20 max-w-xs md:max-w-sm">
        <p className="text-xs md:text-sm text-black leading-none font-safiro">
          In 2021, I bought my first laptop just for gaming. Today, I'm a developer writing thousands of lines of code daily. Funny how things work out.        </p>
      </div>

      <div className="absolute bottom-12 right-12 z-20 max-w-xs md:max-w-sm">
        <p className="text-xs md:text-sm text-black leading-none font-safiro text-right">
          Full Stack Developer
        </p>
      </div>

      <div className="relative w-full max-w-5xl flex items-end justify-center h-full">
        <div ref={podiumRef} className="absolute bottom-0 z-[1] flex items-end justify-center w-full">
          <Image
            src="/rocky-podium-isolated-white-background.png"
            alt="Rocky Podium"
            width={900}
            height={600}
            className="object-contain"
            priority
          />
        </div>

        <h1 className="absolute top-8 md:top-12 lg:top-16 xl:top-20 text-[10rem] md:text-[16rem] lg:text-[20rem] xl:text-[24rem] font-chaney text-black dark:text-white opacity-20 select-none z-0">
          灰碼
        </h1>

        <div ref={imageRef} className="relative bottom-0 z-10 flex items-end">
          <Image
            src="/person-garment.png"
            alt="Hero"
            width={380}
            height={800}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}



