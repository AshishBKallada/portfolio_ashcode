"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/app/data/projects";

gsap.registerPlugin(ScrollTrigger);

// Get first 4 projects
const displayedProjects = projects.slice(0, 4);

function ProjectCard({
  name,
  image,
}: {
  name: string;
  image: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold leading-tight text-white md:text-3xl">
        {name}
      </h3>
      <div className="relative w-full aspect-video overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

function CircularTextButton() {
  return (
    <div className="relative h-28 w-28 lg:h-32 lg:w-32 flex-shrink-0">
      {/* Rotating circular text */}
      <svg
        className="absolute inset-0 h-full w-full animate-spin"
        style={{ animationDuration: "10s" }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id="circularTextPath"
            d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
            fill="none"
          />
        </defs>
        <text
          fontSize="16"
          fill="#7c3aed"
          fontWeight="600"
          letterSpacing="3"
        >
          <textPath href="#circularTextPath" startOffset="0%">
            {"Scroll to Explore \u00B7 Scroll to Explore \u00B7  Scroll to Explore  \u00B7"}
          </textPath>
        </text>
      </svg>

      {/* Purple circle button with arrow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 lg:h-16 lg:w-16">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white"
          >
            <path
              d="M7 17L17 7M17 7H7M17 7V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Projects2() {
  // Random positions and rotations for cube-float images
  const cubePositions = [
    { top: "10%", left: "5%", rotation: 15, size: 160, opacity: 1.0, zIndex: 0, targetRotation: 35, duration: 3, scrollY: 150 },
    { top: "20%", right: "8%", rotation: -25, size: 200, opacity: 1.0, zIndex: 20, targetRotation: -45, duration: 4, scrollY: -200 },
    { top: "50%", left: "2%", rotation: 45, size: 140, opacity: 1.0, zIndex: 0, targetRotation: 50, duration: 2.5, scrollY: 100 },
    { top: "60%", right: "12%", rotation: -30, size: 180, opacity: 1.0, zIndex: 20, targetRotation: -40, duration: 3.5, scrollY: -180 },
    { top: "80%", left: "10%", rotation: 60, size: 170, opacity: 1.0, zIndex: 0, targetRotation: 55, duration: 4.5, scrollY: 220 },
    { top: "15%", left: "50%", rotation: -45, size: 150, opacity: 1.0, zIndex: 20, targetRotation: -50, duration: 3.2, scrollY: -120 },
    { top: "70%", right: "5%", rotation: 20, size: 190, opacity: 1.0, zIndex: 0, targetRotation: 42, duration: 2.8, scrollY: 180 },
    { top: "40%", left: "15%", rotation: -60, size: 130, opacity: 1.0, zIndex: 20, targetRotation: -38, duration: 4.2, scrollY: -160 },
    { top: "85%", right: "20%", rotation: 35, size: 160, opacity: 1.0, zIndex: 0, targetRotation: 48, duration: 3.8, scrollY: 140 },
    { top: "30%", right: "25%", rotation: -15, size: 140, opacity: 1.0, zIndex: 20, targetRotation: -32, duration: 2.6, scrollY: -100 },
  ];

  const cubeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    cubePositions.forEach((pos, index) => {
      const cubeRef = cubeRefs.current[index];
      if (cubeRef) {
        // Rotation animation
        gsap.to(cubeRef, {
          rotation: `+=${pos.targetRotation}`,
          duration: pos.duration,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // Scroll-based vertical movement
        gsap.to(cubeRef, {
          y: pos.scrollY,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });
      }
    });

    return () => {
      cubeRefs.current.forEach((ref) => {
        if (ref) {
          gsap.killTweensOf(ref);
        }
      });
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex flex-col overflow-hidden">
      {/* Top Gradient Section (Same as AboutMeSection) */}
      <div 
        className="relative w-full h-[30vh] md:h-[40vh]"
        style={{
          background: 'linear-gradient(to bottom, #000000 0%, #000000 20%, #2d1b4e 30%, #4C1D95 40%, #6B46C1 50%, #8B5CF6 60%, #A78BFA 70%, #C4B5FD 80%, #E9D5FF 90%, #FFFFFF 100%)'
        }}
      />
      
      {/* Main Content Section */}
      <div className="relative w-full flex-1 bg-transparent px-6 py-16 md:px-12 md:py-24 lg:px-16 lg:py-32">
        {/* Randomly positioned cube-float images */}
      {cubePositions.map((pos, index) => (
        <div
          key={index}
          ref={(el) => {
            cubeRefs.current[index] = el;
          }}
          className="absolute pointer-events-none"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            transform: `rotate(${pos.rotation}deg)`,
            opacity: pos.opacity,
            zIndex: pos.zIndex,
          }}
        >
          <Image
            src="/cube-float.png"
            alt="Cube float"
            width={pos.size}
            height={pos.size}
            className="object-contain"
          />
        </div>
      ))}

      {/* Section Heading with Circular Button at right side */}
      <div className="relative z-10 mx-auto mb-16 max-w-7xl flex items-center justify-center gap-6 md:mb-24 md:justify-between">
        <h2 className="max-w-3xl text-center mx-auto text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl flex-1">
          <span className="text-[#6B46C1]">Projects</span>{" "}
          {"We Never Get Bored Of Talking About"}
        </h2>
        <div className="hidden md:block flex-shrink-0">
          <CircularTextButton />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Mobile: stacked layout */}
        <div className="flex flex-col gap-12 md:hidden">
          {displayedProjects.map((project, i) => (
            <div
              key={project.id}
              className="border-t border-gray-300 pt-8"
            >
              <ProjectCard
                name={project.fullName}
                image={project.image}
              />
            </div>
          ))}
        </div>

        {/* Desktop: 4-column staggered grid with dividers */}
        <div className="hidden md:grid md:grid-cols-4">
          {displayedProjects.map((project, i) => (
            <div
              key={project.id}
              className={`relative px-6 lg:px-8 ${
                i > 0 ? "border-l border-gray-300" : ""
              } ${i % 2 === 0 ? "pt-0 pb-32 lg:pb-40" : "pt-32 lg:pt-40"}`}
            >
              <ProjectCard
                name={project.fullName}
                image={project.image}
              />
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
