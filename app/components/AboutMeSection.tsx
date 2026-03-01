"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

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
  const technicalTextRef = useRef<HTMLParagraphElement>(null);
  const astronautRef = useRef<HTMLDivElement>(null);
  const floatTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    let ctx: gsap.Context | undefined;
    if (technicalTextRef.current) {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });

        tl.fromTo(
          technicalTextRef.current,
          { autoAlpha: 0, x: -60 },
          {
            autoAlpha: 1,
            x: 0,
            duration: duration,
            ease: "power2.out",
          }
        )
          .to(
            technicalTextRef.current,
            {
              autoAlpha: 0,
              x: 60,
              duration: duration,
              ease: "power2.in",
            },
            `+=0.8`
          );
      }, sectionRef);

      // Clean up GSAP context on unmount
      return () => {
        ctx && ctx.revert();
      };
    }
  }, [animationDelay, duration]);

  // Floating astronaut animation
  useEffect(() => {
    if (!astronautRef.current) return;

    const createRandomFloat = () => {
      const randomX = (Math.random() - 0.5) * 200; // Random X between -100 and 100
      const randomY = (Math.random() - 0.5) * 200; // Random Y between -100 and 100
      const randomRotation = (Math.random() - 0.5) * 30; // Random rotation between -15 and 15
      const randomDuration = 3 + Math.random() * 4; // Random duration between 3-7 seconds

      return {
        x: randomX,
        y: randomY,
        rotation: randomRotation,
        duration: randomDuration,
      };
    };

    const animateFloat = () => {
      if (!astronautRef.current) return;
      
      const { x, y, rotation, duration } = createRandomFloat();
      
      floatTweenRef.current = gsap.to(astronautRef.current, {
        x: `+=${x}`,
        y: `+=${y}`,
        rotation: `+=${rotation}`,
        duration: duration,
        ease: "sine.inOut",
        onComplete: animateFloat, // Loop the animation
      });
    };

    // Start the floating animation
    animateFloat();

    return () => {
      if (astronautRef.current) {
        gsap.killTweensOf(astronautRef.current);
      }
    };
  }, []);


  return (
    <div
      ref={sectionRef}
      className="w-full min-h-screen flex flex-col py-0"
    >
      {/* Top Section with Gradient */}
      <div 
        className="relative w-full flex-1 flex  justify-between px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #000000 0%, #000000 20%, #2d1b4e 30%, #4C1D95 40%, #6B46C1 50%, #8B5CF6 60%, #A78BFA 70%, #C4B5FD 80%, #E9D5FF 90%, #FFFFFF 100%)'
        }}
      >
        {/* Floating Astronaut */}
        <div
          ref={astronautRef}
          className="absolute pointer-events-none z-10"
          style={{
            top: '20%',
            right: '10%',
            width: '500px',
            height: '500px',
            transform: 'translate3d(0, 0, 0) rotate(0deg)',
            willChange: 'transform',
          }}
        >
          <Image
            src="/3d-render-purple-witch-hat-icon.png"
            alt="Astronaut"
            width={500}
            height={500}
            className="object-contain"
            style={{ willChange: "transform" }}
          />
        </div>

        {/* Top Left Text */}
        <div className="space-y-2 md:space-y-3 max-w-4xl relative z-20">
          <p
            ref={technicalTextRef}
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight opacity-0"
            style={{ willChange: "opacity, transform" }}
          >
            I bridge the gap between abstract imagination and technical precision.
          </p>
        </div>

    
      </div>

      {/* Bottom Section with White Background */}
      <div className="relative w-full bg-white px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl space-y-4">
          <p className="text-2xl md:text-3xl lg:text-4xl font-safiro text-black leading-tight">
          By merging high-performance engineering with intentional design, I craft digital experiences that feel intuitive and move with purpose.
          </p>
        </div>
      </div>
    </div>
  );
}

