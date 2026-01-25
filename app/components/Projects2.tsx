"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAllProjects } from "@/app/data/projects";

gsap.registerPlugin(ScrollTrigger);

interface Projects2Props {
  animationDelay?: number;
  duration?: number;
}

export default function Projects2({
  animationDelay = 0,
  duration = 1,
}: Projects2Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(1);
  const router = useRouter();

  const projects = getAllProjects();

  useEffect(() => {
    const section = sectionRef.current;
    const button = buttonRef.current;
    const buttonContainer = buttonContainerRef.current;

    if (!section || !button || !buttonContainer) return;

    const ctx = gsap.context(() => {
      const getButtonBottomPosition = () => {
        const rect = buttonContainer.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const scrollY = window.scrollY;
        return (rect.top + scrollY + rect.height - button.offsetHeight) - (sectionRect.top + scrollY) - 100;
      };

      gsap.set(button, {
        position: "fixed",
        top: "100px",
        left: "50%",
        x: "-50%",
        y: 0,
        zIndex: 50,
        opacity: 0,
        pointerEvents: "none",
      });

      const distance = getButtonBottomPosition();

      const mainScrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onEnter: () => {
          gsap.to(button, {
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.3,
          });
        },
        onLeave: () => {
          gsap.set(button, {
            opacity: 0,
            pointerEvents: "none",
          });
        },
        onEnterBack: () => {
          gsap.to(button, {
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.3,
          });
        },
        onLeaveBack: () => {
          gsap.set(button, {
            opacity: 0,
            pointerEvents: "none",
          });
        },
      });

      gsap.to(button, {
        y: distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
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
      className="relative w-full min-h-screen bg-white text-black py-20 px-8 md:px-16 lg:px-24"
    >
      <div className="w-full mb-12 lg:mb-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black font-chaney uppercase">
          <span className="text-base md:text-lg lg:text-xl xl:text-2xl font-chaney uppercase tracking-wider whitespace-nowrap">
            FEATURED PROJECTS
          </span>
        </h2>
      </div>
   

      <div className="w-full h-full flex flex-row gap-12 lg:gap-12">
        <div className="w-3/4 flex flex-col justify-between">
          <div className="flex flex-row gap-2 flex-wrap">
            {projects.map((project, index) => {
              const isActive = activeProject === project.id;
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setActiveProject(project.id)}
                >
                  <p
                    className={`text-xl md:text-2xl lg:text-3xl xl:text-4xl font-safiro transition-all duration-300 leading-tight block ${
                      isActive
                        ? "font-bold text-black"
                        : "font-normal text-zinc-300"
                    }`}
                  >
                    {project.name} ({String(project.id).padStart(2, '0')})
                    {index < projects.length - 1 && (
                      <span className="text-zinc-300"> /</span>
                    )}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 lg:mt-6 flex flex-row gap-32 items-start">
            <div className="text-xs md:text-sm text-zinc-400 font-safiro uppercase tracking-wider whitespace-nowrap">
              04 METHOD
            </div>
            <p className="text-sm md:text-base text-black leading-relaxed max-w-lg font-safiro">
              The scope of my work covers all stages within Web Development and Digital Solutions. I offer an end to end level of service from early concepts through to practical completion and deployment.
            </p>
          </div>
        </div>

        <div className="w-1/4 flex items-center justify-center min-h-[60vh] lg:min-h-[85vh]">
          <div className="relative w-full h-full max-w-3xl">
            <Image
              src="/experience-image.jpg"
              alt="Project Illustration"
              width={900}
              height={700}
              className="w-full h-auto object-contain grayscale opacity-80"
              priority
            />
          </div>
        </div>
      </div>

    
    </section>
  );
}

