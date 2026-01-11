"use client";

import Image from "next/image";
import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProjectsSectionProps {
  animationDelay?: number;
  duration?: number;
}

export default function ProjectsSection({
  animationDelay = 0,
  duration = 1,
}: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const horizontal = horizontalRef.current;
    if (!section || !horizontal) return;

    // total scrollable width minus viewport
    const totalScroll = horizontal.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(horizontal, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalScroll}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-featured platform with payment processing and real-time inventory.",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
    },
    {
      title: "Task Management App",
      description: "Collaborative app with real-time updates and team features.",
      tech: ["Next.js", "TypeScript", "Firebase"],
    },
    {
      title: "Social Media Dashboard",
      description: "Analytics dashboard for social media management.",
      tech: ["React", "Python", "Django", "PostgreSQL"],
    },
    {
      title: "Real Estate Platform",
      description: "Property listing with advanced search and map integration.",
      tech: ["Next.js", "TypeScript", "MongoDB", "Mapbox"],
    },
    {
      title: "Fitness Tracking App",
      description: "Mobile-first fitness app with workout plans and progress tracking.",
      tech: ["React Native", "Node.js", "MongoDB"],
    },
    {
      title: "Portfolio Website",
      description: "Modern animated portfolio with smooth scroll animations.",
      tech: ["Next.js", "GSAP", "Tailwind CSS"],
    },
    {
      title: "Food Delivery App",
      description: "Complete solution with real-time order tracking.",
      tech: ["React Native", "Node.js", "MongoDB"],
    },
    {
      title: "Learning Management System",
      description: "LMS platform with video courses and progress tracking.",
      tech: ["Next.js", "TypeScript", "PostgreSQL"],
    },
    {
      title: "Cryptocurrency Tracker",
      description: "Real-time price tracking with portfolio management.",
      tech: ["React", "TypeScript", "WebSocket"],
    },
  ];

  // group projects into 3 pages
  const pages = useMemo(() => {
    const size = Math.ceil(projects.length / 3);
    return [projects.slice(0, size), projects.slice(size, size * 2), projects.slice(size * 2)];
  }, [projects]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full h-screen overflow-hidden bg-white dark:bg-black"
    >
      <div className="absolute top-10 left-6 z-20 text-black dark:text-white">
        <h2 className="text-4xl md:text-5xl font-bold font-chaney">Projects</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Scroll to explore →</p>
      </div>

      <div
        ref={horizontalRef}
        className="flex h-full"
      >
        {pages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            className="min-w-screen w-screen h-full flex items-center justify-center px-6 md:px-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 max-w-7xl w-full border border-black dark:border-white">
              {page.map((project, index) => (
                <div
                  key={`${pageIndex}-${index}`}
                  className="p-8 md:p-10 border-b border-r border-black dark:border-white last:border-b-0"
                >
                  <h3 className="text-xl md:text-2xl font-chaney text-black dark:text-white mb-4">
                    {project.title}
                  </h3>
                  <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-sm text-zinc-500 dark:text-zinc-400"
                      >
                        {tech}
                        {techIndex < project.tech.length - 1 && <span className="mx-1">·</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

