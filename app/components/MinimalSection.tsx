"use client";

import { useEffect, useRef } from "react";

export default function MinimalSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Reserved for future animations if needed
  }, []);

  return (
    <section
      ref={sectionRef}
      id="minimal"
      className="w-full min-h-screen flex items-center justify-center bg-white px-6 py-16"
    >
      <div className="relative w-full max-w-8xl shadow-none rounded-3xl p-10 md:p-14 lg:p-16 overflow-hidden">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Main heading - large centered text */}
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-chaney text-black dark:text-white">
              <span className="font-dancing">Building</span>{" "}
              <span className="font-chaney font-bold">Digital</span>
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-chaney font-bold text-black dark:text-white">
              experiences with code
            </h2>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-chaney font-bold text-black dark:text-white">
              and creative solutions
            </h2>
          </div>

          {/* Descriptive paragraph */}
          <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-2xl mt-6">
            Web applications, mobile apps, APIs, databases, cloud infrastructure, and scalable systems; all built with modern technologies and best practices.
          </p>

          {/* Bottom text */}
          <div className="mt-12 text-xs text-zinc-500 dark:text-zinc-400">
            trusted by passion
          </div>
        </div>
      </div>
    </section>
  );
}

