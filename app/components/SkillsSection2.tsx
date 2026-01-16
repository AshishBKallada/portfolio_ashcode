"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SkillsSection2Props {
  animationDelay?: number;
  duration?: number;
}

export default function SkillsSection2({
  animationDelay = 0,
  duration = 1,
}: SkillsSection2Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const uiColumnRef = useRef<HTMLDivElement>(null);
  const frontendColumnRef = useRef<HTMLDivElement>(null);
  const backendColumnRef = useRef<HTMLDivElement>(null);
  const deploymentColumnRef = useRef<HTMLDivElement>(null);

  const skillsData = {
    UI: ["Figma", "Adobe XD", "Sketch", "Framer", "Principle", "After Effects"],
    Frontend: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Vue.js"],
    Backend: ["Node.js", "Express", "Python", "Django", "MongoDB", "PostgreSQL"],
    Deployment: ["AWS", "Vercel", "Docker", "Kubernetes", "GitHub Actions", "CI/CD"],
  };

  useEffect(() => {
    const section = sectionRef.current;
    const uiColumn = uiColumnRef.current;
    const frontendColumn = frontendColumnRef.current;
    const backendColumn = backendColumnRef.current;
    const deploymentColumn = deploymentColumnRef.current;

    if (!section || !uiColumn || !frontendColumn || !backendColumn || !deploymentColumn) return;

    const ctx = gsap.context(() => {
      const columns = [
        { ref: uiColumn, direction: -100 }, // Left
        { ref: frontendColumn, direction: 100 }, // Right
        { ref: backendColumn, direction: -100 }, // Left
        { ref: deploymentColumn, direction: 100 },
      ];

      const allItems: Array<{ item: HTMLElement; direction: number }> = [];
      
      columns.forEach((column) => {
        const items = gsap.utils.toArray<HTMLElement>(column.ref.children);
        items.forEach((item) => {
          allItems.push({ item, direction: column.direction });
          gsap.set(item, { x: column.direction, opacity: 0.2 });
        });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
        },
      });

      allItems.forEach(({ item, direction }, index) => {
        timeline.to(
          item,
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          index * 0.05
        );
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen py-20 px-6 md:px-12 lg:px-16 flex flex-col items-center justify-center bg-white"
    >
      <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black font-chaney mb-12 md:mb-16 text-center">
        SUPERPOWERS
      </h2>

      <div className="flex items-start justify-center gap-4 md:gap-6 lg:gap-8 w-full max-w-7xl">
        <div className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-3 md:gap-4">
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-black font-safiro mb-2 text-right">
              UI
            </h3>
            <div ref={uiColumnRef} className="flex flex-col">
              {skillsData.UI.map((skill, index) => (
                <div
                  key={index}
                  className="text-base md:text-lg lg:text-xl font-safiro text-black text-right"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-black font-safiro mb-2 text-right">
              Backend
            </h3>
            <div ref={backendColumnRef} className="flex flex-col">
              {skillsData.Backend.map((skill, index) => (
                <div
                  key={index}
                  className="text-base md:text-lg lg:text-xl font-safiro text-black text-right"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-3 md:gap-4">
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-black font-safiro mb-2 text-left">
              Frontend
            </h3>
            <div ref={frontendColumnRef} className="flex flex-col">
              {skillsData.Frontend.map((skill, index) => (
                <div
                  key={index}
                  className="text-base md:text-lg lg:text-xl font-safiro text-black text-left"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-black font-safiro mb-2 text-left">
              Deployment
            </h3>
            <div ref={deploymentColumnRef} className="flex flex-col">
              {skillsData.Deployment.map((skill, index) => (
                <div
                  key={index}
                  className="text-base md:text-lg lg:text-xl font-safiro text-black text-left"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
