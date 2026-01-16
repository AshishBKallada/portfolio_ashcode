"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface Projects2Props {
  animationDelay?: number;
  duration?: number;
}

export default function Projects2({
  animationDelay = 0,
  duration = 1,
}: Projects2Props) {
  const sectionRef = useRef<HTMLElement>(null);

  const projectImages = [
    "/experience-image.jpg",
    "/contact-image.jpg",
    "/me.jpeg",
    "/hero-background.jpg",
    "/skills-background.jpg",
    "/stones.png",
  ];

  useEffect(() => {
  }, []);

  const cardPositions = [
    { x: 0, y: 0, rotation: -5, zIndex: 1 },
    { x: 60, y: -20, rotation: 3, zIndex: 2 },
    { x: 120, y: -40, rotation: -2, zIndex: 3 },
    { x: 180, y: -20, rotation: 4, zIndex: 4 },
    { x: 240, y: -10, rotation: -3, zIndex: 5 },
    { x: 300, y: -30, rotation: 2, zIndex: 6 },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black py-10 px-4 md:px-6 lg:px-8"
    >
      <div className="w-full flex items-center justify-between mb-16 md:mb-20">
        <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-chaney uppercase">
          <span className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-chaney uppercase tracking-wider whitespace-nowrap">
            FEATURED CLIENT PROJECTS
          </span>
        </h2>

        <button className="border border-white text-white px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-safiro hover:bg-white hover:text-black transition-colors whitespace-nowrap">
          VIEW ALL PROJECTS →
        </button>
      </div>

      <div className="relative w-full flex items-center justify-center min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
          {projectImages.map((imageSrc, index) => {
            const position = cardPositions[index % cardPositions.length];
            return (
              <div
                key={index}
                className="absolute w-[300px] md:w-[350px] lg:w-[400px] h-[400px] md:h-[450px] lg:h-[500px] shadow-xl overflow-hidden"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y + 100}px`,
                  transform: `rotate(${position.rotation}deg)`,
                  zIndex: position.zIndex,
                }}
              >
                <Image
                  src={imageSrc}
                  alt={`Project ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 300px, (max-width: 1024px) 350px, 400px"
                />
              </div>
            );
          })}
      </div>
    </section>
  );
}

