"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Lenis from "lenis";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getAllProjects } from "@/app/data/projects";

export default function ProjectsPage() {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const projects = getAllProjects();

  return (
    <main className="relative w-full min-h-screen bg-white text-black">
      <Navbar />
      
      <section className="relative w-full min-h-screen py-20 px-8 md:px-16 lg:px-24">
        <div className="w-full mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black font-chaney uppercase">
            <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-chaney uppercase tracking-wider">
              ALL PROJECTS
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group cursor-pointer transition-all duration-300"
            >
              <div className="relative w-full h-64 mb-4 overflow-hidden bg-zinc-100">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-black font-safiro mb-2 group-hover:text-zinc-600 transition-colors">
                {project.fullName}
              </h2>
              <p className="text-sm md:text-base text-zinc-600 font-safiro leading-relaxed">
                {project.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="bg-white border border-black text-black px-10 py-4 text-sm md:text-base font-safiro hover:bg-zinc-900 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

