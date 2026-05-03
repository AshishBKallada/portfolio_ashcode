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
    <main className="relative w-full min-h-screen overflow-hidden bg-transparent text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-transparent" />
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(255,255,255,0.06) calc(8.333333% - 1px), rgba(255,255,255,0.06) 8.333333%)",
        }}
      />

      <section className="relative z-10 w-full min-h-screen px-2 py-20 md:px-4 lg:px-6">
        <div className="mb-12 w-full lg:mb-16">
          <h1 className="font-chaney text-4xl font-bold uppercase text-white md:text-5xl lg:text-6xl xl:text-7xl">
            <span className="font-chaney text-2xl uppercase tracking-wider text-white/90 md:text-3xl lg:text-4xl xl:text-5xl">
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
                  <div className="absolute inset-0 overflow-hidden bg-neutral-100 [backface-visibility:hidden]">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-black/10" />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end overflow-y-auto border border-white/15 bg-black/[0.06] p-4 backdrop-blur-md [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-5">
                    <h2 className="font-safiro text-lg font-bold text-white md:text-xl">
                      {project.fullName}
                    </h2>
                    <p className="mt-1 font-safiro text-xs leading-relaxed text-white/75 md:text-sm">
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
            className="border border-white/25 bg-transparent px-10 py-4 font-safiro text-sm text-white transition-colors hover:bg-white/10 md:text-base"
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

