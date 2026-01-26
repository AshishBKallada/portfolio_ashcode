"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { getAllProjects } from "@/app/data/projects";

export default function Projects2() {
  const [viewMode, setViewMode] = useState<2 | 3 | 5>(3); // 2, 3, or 5 items per row
  const [showDescription, setShowDescription] = useState(false); // Toggle description visibility
  const modalRef = useRef<HTMLDivElement>(null);
  const allProjects = getAllProjects();
  
  // Get different projects for the grid (first 9 projects)
  const gridProjects = allProjects.slice(0, 9);
  
  // Helper function to get 1 sentence description from project overview
  const getDescription = (overview: string): string => {
    const sentences = overview.split('. ').filter(s => s.trim().length > 0);
    if (sentences.length >= 1) {
      return `${sentences[0]}.`;
    }
    return overview;
  };

  // GSAP animation for modal
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (showDescription) {
      // Show modal with drop animation
      gsap.set(modal, { display: 'block', pointerEvents: 'auto' });
      gsap.fromTo(
        modal,
        {
          y: -20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
        }
      );
    } else {
      // Hide modal with reverse animation
      gsap.to(modal, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(modal, { display: 'none', pointerEvents: 'none' });
        }
      });
    }
  }, [showDescription]);

  return (
    <section className="relative w-full bg-white text-black">
      <div className="w-full px-2 mx-auto py-12 md:py-16">
        {/* Section Title with Icons */}
        <div className="mb-3 md:mb-4 flex items-center gap-3">
          <h1 className="text-lg md:text-xl lg:text-2xl text-black leading-tight">
            <span className="text-base md:text-lg lg:text-xl  text-black leading-tight">
              <span className="text-xs md:text-sm lg:text-base font-safiro text-black leading-tight">
                featured <span className="text-gray-900">projects</span>
              </span>
            </span>
          </h1>
          
          {/* Plus/Minus Icon with Modal */}
          <div className="relative">
            <button 
              onClick={() => setShowDescription(!showDescription)}
              className="w-4 h-4 md:w-5 md:h-5 cursor-pointer flex items-center justify-center"
            >
            {showDescription ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-black">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-black">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </button>
          
          {/* Modal for Description - positioned below + icon, full width */}
          <div
            ref={modalRef}
            className="absolute top-full left-[calc(-50vw+50%)] w-screen z-50 bg-white shadow-lg"
            style={{ display: 'none' }}
          >
            <div className="w-full px-4 md:px-6 lg:px-8 py-4 md:py-5">
              <p className="text-sm md:text-base text-black leading-relaxed max-w-7xl mx-auto">
                A curated selection of my recent work showcasing innovative solutions and creative problem-solving across various domains. Dive in to explore a range of projects that highlight my skills in full-stack development, UI/UX design, and the implementation of modern technologies. Each project reflects my dedication to delivering impactful results and driving value through technology.
              </p>
            </div>
          </div>
        </div>
          
          {/* Three Icons */}
          <div className="flex items-center gap-2 md:gap-3 ml-auto">
            {/* Icon 1 - 2 items per row (List view - two vertical rectangles) */}
            <div 
              className={`w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-opacity ${
                viewMode === 2 ? 'opacity-100' : 'opacity-50'
              }`}
              onClick={() => setViewMode(2)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-black">
                <rect x="4" y="4" width="6" height="16" />
                <rect x="14" y="4" width="6" height="16" />
              </svg>
            </div>
            
            {/* Icon 2 - 3 items per row (Grid view - four squares) */}
            <div 
              className={`w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-opacity ${
                viewMode === 3 ? 'opacity-100' : 'opacity-50'
              }`}
              onClick={() => setViewMode(3)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-black">
                <rect x="3" y="3" width="8" height="8" />
                <rect x="13" y="3" width="8" height="8" />
                <rect x="3" y="13" width="8" height="8" />
                <rect x="13" y="13" width="8" height="8" />
              </svg>
            </div>
            
            {/* Icon 3 - 5 items per row (Dense grid view) */}
            <div 
              className={`w-4 h-4 md:w-5 md:h-5 cursor-pointer transition-opacity ${
                viewMode === 5 ? 'opacity-100' : 'opacity-50'
              }`}
              onClick={() => setViewMode(5)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-black">
                <rect x="2" y="2" width="3.5" height="3.5" />
                <rect x="6.5" y="2" width="3.5" height="3.5" />
                <rect x="11" y="2" width="3.5" height="3.5" />
                <rect x="15.5" y="2" width="3.5" height="3.5" />
                <rect x="20" y="2" width="3.5" height="3.5" />
                <rect x="2" y="7" width="3.5" height="3.5" />
                <rect x="6.5" y="7" width="3.5" height="3.5" />
                <rect x="11" y="7" width="3.5" height="3.5" />
                <rect x="15.5" y="7" width="3.5" height="3.5" />
                <rect x="20" y="7" width="3.5" height="3.5" />
              </svg>
            </div>
          </div>
          
          {/* View All Button */}
          <button className="px-4 py-2 border border-black bg-white text-black text-xs md:text-sm hover:bg-black hover:text-white transition-colors">
            view all →
          </button>
        </div>

        {/* Image Grid */}
        <div className={`grid grid-cols-1 gap-3 md:gap-4 ${
          viewMode === 2 
            ? 'md:grid-cols-2' 
            : viewMode === 3
            ? 'md:grid-cols-3'
            : 'md:grid-cols-5'
        }`}>
          {gridProjects.map((project, index) => (
            <div key={index} className="flex flex-col">
              <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden group cursor-pointer mb-2">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <p className="text-xs md:text-sm text-black leading-relaxed">
                {getDescription(project.details.overview)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
