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
      {/* Top Section - Hero */}
      <div className="w-full flex flex-col md:flex-row items-start justify-between px-6 md:px-12 lg:px-16 xl:px-20 pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-12">
        {/* Left Side - Heading */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black dark:text-white leading-tight font-chaney mb-4">
            Projects
          </h1>
          <p className="text-lg md:text-xl text-black/80 dark:text-white/80 font-safiro">
            Scroll to explore →
          </p>
        </div>

        {/* Right Side - Description */}
        <div className="w-full md:w-1/2 md:pl-8 lg:pl-12">
          <p className="text-sm md:text-base text-black/70 dark:text-white/70 leading-relaxed font-safiro">
            Libérez-vous de la complexité: ASHCODE pilote vos projets — pérennes ou éphémères — de bout en bout. Accompagnement clé en main, conception sur-mesure, vous vous concentrez sur l'essentiel.
          </p>
        </div>
      </div>

      <div
        ref={horizontalRef}
        className="flex absolute bottom-12 left-0 w-full"
        style={{ height: "auto" }}
      >
        {pages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            className="min-w-screen w-screen flex items-end px-6 md:px-12 lg:px-16 xl:px-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full items-end">
              {page.map((project, index) => (
                <div
                  key={`${pageIndex}-${index}`}
                  className="bg-white dark:bg-black border border-black dark:border-white p-6 md:p-8 lg:p-10 min-h-[200px] md:min-h-[00px] lg:min-h-[400px] flex flex-col"
                >
                  <h3 className="text-xl md:text-2xl font-chaney text-black dark:text-white mb-3 md:mb-4">
                    {project.title}
                  </h3>
                  <p className="text-base md:text-lg text-black/70 dark:text-white/70 leading-relaxed mb-4 md:mb-6 font-safiro flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs md:text-sm text-black/50 dark:text-white/50 font-safiro"
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

