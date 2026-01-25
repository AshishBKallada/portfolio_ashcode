"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import Lenis from "lenis";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getProjectBySlug, getAllProjects } from "@/app/data/projects";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

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

  const project = getProjectBySlug(slug);
  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex(p => p.slug === slug);
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;

  if (!project) {
    return (
      <main className="relative w-full min-h-screen bg-white text-black">
        <Navbar />
        <section className="relative w-full min-h-screen flex items-center justify-center py-20 px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black font-chaney mb-4">Project Not Found</h1>
            <Link
              href="/projects"
              className="text-black hover:text-zinc-600 font-safiro underline"
            >
              Back to All Projects
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="relative w-full min-h-screen bg-white text-black">
      <Navbar />
      
      <section className="relative w-full min-h-screen py-20 px-8 md:px-16 lg:px-24">
        <div className="mb-8">
          <Link
            href="/projects"
            className="text-sm text-zinc-600 hover:text-black font-safiro transition-colors"
          >
            ← Back to All Projects
          </Link>
        </div>

        <div className="w-full mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black font-chaney uppercase mb-4">
            {project.fullName}
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 font-safiro max-w-3xl">
            {project.description}
          </p>
        </div>

        <div className="relative w-full h-[60vh] mb-16 overflow-hidden bg-zinc-100">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-black font-chaney uppercase mb-6">
              Overview
            </h2>
            <p className="text-base md:text-lg text-black font-safiro leading-relaxed mb-8">
              {project.details.overview}
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-black font-chaney uppercase mb-6">
              Solution
            </h2>
            <p className="text-base md:text-lg text-black font-safiro leading-relaxed mb-8">
              {project.details.solution}
            </p>

            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-black font-chaney uppercase mb-4">
                Features
              </h3>
              <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-black font-safiro">
                {project.details.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-black font-chaney uppercase mb-4">
                Challenges
              </h3>
              <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-black font-safiro">
                {project.details.challenges.map((challenge, index) => (
                  <li key={index}>{challenge}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-xl md:text-2xl font-bold text-black font-chaney uppercase mb-4">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.details.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-zinc-100 text-black text-sm font-safiro rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-zinc-300">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="text-sm md:text-base text-black hover:text-zinc-600 font-safiro transition-colors"
            >
              ← {prevProject.name}
            </Link>
          ) : (
            <div></div>
          )}
          
          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="text-sm md:text-base text-black hover:text-zinc-600 font-safiro transition-colors"
            >
              {nextProject.name} →
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}



