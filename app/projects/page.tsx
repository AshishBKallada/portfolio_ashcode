"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Lenis from "lenis";
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
    <main className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[url('/hero-bgx.jpg')] bg-cover bg-center bg-fixed" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-black/45" />
      <div
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(255,255,255,0.06) calc(8.333333% - 1px), rgba(255,255,255,0.06) 8.333333%)",
        }}
      />

      <section className="relative z-10 w-full min-h-screen py-20 px-2 md:px-4 lg:px-6">
        <div className="w-full mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-chaney uppercase">
            <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-chaney uppercase tracking-wider text-white/95">
              ALL PROJECTS
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group cursor-pointer transition-all duration-300"
            >
              <div className="relative mb-4 aspect-square w-full [perspective:1200px]">
                <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  <div className="absolute inset-0 overflow-hidden bg-white/10 [backface-visibility:hidden]">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-black/35" />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end overflow-y-auto bg-black p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-5">
                    <h2 className="font-safiro text-lg font-bold text-white md:text-xl">
                      {project.fullName}
                    </h2>
                    <p className="mt-1 font-safiro text-xs leading-relaxed text-white/85 md:text-sm">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="border border-white bg-transparent px-10 py-4 text-sm md:text-base font-safiro text-white transition-colors hover:bg-white/10"
          >
            ← Back to Home
          </Link>
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}

