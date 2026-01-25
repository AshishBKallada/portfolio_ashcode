"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/app/data/projects";

interface Projects2Props {
  animationDelay?: number;
  duration?: number;
}

export default function Projects2({
  animationDelay = 0,
  duration = 1,
}: Projects2Props) {
  const [activeProject, setActiveProject] = useState(1);
  const projects = getAllProjects();
  const currentProject = projects.find(p => p.id === activeProject) || projects[0];

  return (
    <section className="relative w-full min-h-screen bg-white text-black py-20 px-8 md:px-16 lg:px-24">
    
   
      <div className="w-full h-full flex flex-row gap-12 lg:gap-16 xl:gap-20 items-start">
        {/* Left Column - All Project Names (Small) */}
        <div className="w-1/4 flex flex-col gap-8 lg:gap-10 xl:gap-12">
          {projects.map((project) => {
              const isActive = activeProject === project.id;
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setActiveProject(project.id)}
                >
                  <p
                  className={`text-xs md:text-sm lg:text-base font-safiro transition-all duration-300 leading-tight ${
                      isActive
                        ? "font-bold text-black"
                        : "font-normal text-zinc-300"
                    }`}
                  >
                  {String(project.id).padStart(2, '0')}/ {project.name.toUpperCase()}
                  </p>
                </Link>
              );
            })}
          </div>

        {/* Center Column - Project Image */}
        <div className="w-2/4 flex items-center justify-center">
          <div className="relative w-full h-[60vh] lg:h-[70vh] max-w-3xl">
            <Image
              key={`project-image-${currentProject.id}-${currentProject.image}`}
              src={currentProject.image}
              alt={currentProject.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority={activeProject === 1}
              unoptimized
            />
          </div>
        </div>

        {/* Right Column - Project Description/Definition */}
        <div className="w-1/4 flex items-start justify-start pt-8">
          <div className="w-full">
            <p className="text-xs md:text-sm lg:text-base text-black leading-tight font-safiro">
              {currentProject.details.overview}
            </p>
          </div>
        </div>
      </div>

      {/* View All Button - Bottom Right */}
      <div className="absolute bottom-8 md:bottom-12 lg:bottom-16 right-8 md:right-16 lg:right-24">
        <Link
          href="/projects"
          className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-white border border-black text-black font-safiro text-sm md:text-base uppercase tracking-wider transition-colors duration-300 hover:bg-black hover:text-white"
        >
          View All Projects →
        </Link>
      </div>
    </section>
  );
}

