"use client";

import { getAllProjects } from "@/app/data/projects";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Projects2() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const allProjects = getAllProjects();
  const featuredProjects = allProjects.slice(0, 4);

  useEffect(() => {
    const updateDateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setCurrentDateTime(new Date().toLocaleString("en-US", options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden">
      <div className="w-full px-16 py-12 md:py-16 flex items-center justify-center relative z-10">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-8 w-full">
          <div className="relative inline-block mb-8 md:mb-12">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-chaney leading-none">
              Work<sup className="align-super text-xs md:text-sm ml-2 mb-12 font-normal">({allProjects.length})</sup>
            </h1>
          </div>
        
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mb-6 md:mb-8">
          <div className="space-y-8 md:space-y-10">
          

            <div>
             
              <p className="text-sm md:text-base text-black leading-relaxed">
                For fresh initiatives and press inquiries, or simply send me an email at{" "}
                <a href="mailto:essoo@aol.com" className="underline hover:no-underline">
                  ashercode4u@gmail.com
                </a>
              </p>
               <button className="mt-3 px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors text-sm md:text-base">
                View All Projects →
              </button>
            </div>
          </div>
          </div>

          <div className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pb-2 mb-6">
              {featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50 border border-black/10 hover:border-black hover:bg-gray-100 transition-all cursor-pointer flex items-center justify-center"
                >
                  <div className="text-center p-2 md:p-3">
                    <div className="text-[10px] md:text-xs font-mono text-black/40 mb-1">
                      {String(project.id).padStart(2, '0')}
                    </div>
                    <div className="text-xs md:text-sm font-safiro text-black font-medium">
                      {project.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
