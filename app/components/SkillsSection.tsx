"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SkillsSectionProps {
  animationDelay?: number;
  duration?: number;
}

export default function SkillsSection({
  animationDelay = 0,
  duration = 1,
}: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    gsap.set(content, { opacity: 0, y: 30 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(content, {
      opacity: 1,
      y: 0,
      duration: duration,
      ease: "power3.out",
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [duration]);

  const skillCategories = {
    "Frontend I": ["/react", "/nextjs", "/react-native", "/javascript", "/typescript"],
    "Tailwind": ["/tailwind"],
    "Backend II": ["/node", "/express"],
    "Database III": ["/mongodb", "/postgresql", "/mysql"],
    "DevOps IV": ["/aws", "/docker", "/kubernetes", "/vercel"],
    "Animation V": ["/gsap", "/framer-motion"],
    "UI Frameworks VI": ["/mui", "/tamagui", "/nativebase"],
  };

  const categories = [
    "Frontend I",
    "Tailwind",
    "Backend II",
    "Database III",
    "DevOps IV",
    "Animation V",
    "UI Frameworks VI",
  ];

  // Get skills based on selected category
  const getFilteredSkills = () => {
    if (!selectedCategory) {
      // Show all skills when no category is selected
      return Object.values(skillCategories).flat();
    }
    return skillCategories[selectedCategory as keyof typeof skillCategories] || [];
  };

  const filteredSkills = getFilteredSkills();

  // Get all skills for display
  const allSkills = Object.values(skillCategories).flat();

  return (
    <section
      ref={sectionRef}
      id="skills" 
      className="w-full min-h-screen py-20 px-4 md:px-6 relative overflow-hidden grayscale "
      style={{
        backgroundImage: "url('/skillbg1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/80 z-0"></div>
      
      <div className="relative w-full h-full flex items-center z-10">
        {/* Left side - One skill per row */}
        <div
          ref={contentRef}
          className="flex-1 flex flex-col gap-2 md:gap-3 pl-4 md:pl-6"
        >
          {Object.entries(skillCategories).flatMap(([category, skills]) =>
            skills.map((skill, skillIdx) => (
              <div key={`${category}-${skillIdx}`} className="flex items-center">
                <span className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-chaney text-white uppercase tracking-tight">
                  {skill.replace("/", "")}
                </span>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Center Text - 2 lines + dot */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="text-center w-full">
          <div className="text-sm md:text-base lg:text-lg font-safiro text-white/60 uppercase tracking-wide">
            EVERY SKILL
          </div>
          <div className="text-sm md:text-base lg:text-lg font-safiro text-white/60 uppercase tracking-wide mt-1">
            IS AN ASSET
          </div>
          <div className="text-2xl md:text-3xl lg:text-4xl font-safiro text-white mt-2 text-left ml-4 md:ml-6">
            ·
          </div>
        </div>
      </div>

      {/* Bottom Center Text - 3 lines + dot */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <div className="text-center w-full">
          <div className="text-xs md:text-sm font-safiro text-white/50 uppercase tracking-wide">
            ASSET
          </div>
          <div className="text-xs md:text-sm font-safiro text-white/50 uppercase tracking-wide mt-1">
            OVER
          </div>
          <div className="text-xs md:text-sm font-safiro text-white/50 uppercase tracking-wide mt-1">
            ASSET
          </div>
          <div className="text-xl md:text-2xl lg:text-3xl font-safiro text-white mt-2 text-left ml-4 md:ml-6">
            ·
          </div>
        </div>
      </div>
    </section>
  );
}
