"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceSectionProps {
  animationDelay?: number;
  duration?: number;
}

export default function ExperienceSection({
  animationDelay = 0,
  duration = 1,
}: ExperienceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    gsap.set(content, { opacity: 0, y: 30 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(content, {
      opacity: 1,
      y: 0,
      duration: duration,
      ease: "power3.out",
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [duration]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="w-full min-h-screen flex bg-white"
    >
 

      {/* Main Content Area - White */}
      <div className="flex-1 bg-white py-12 md:py-16 px-4 md:px-6">
        <div ref={contentRef} className="max-w-[95%] mx-auto">
          {/* Section Heading */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-800 mb-2 font-chaney">
              EXPERIENCE
            </h2>
          </div>

          {/* Experience Timeline */}
          <div className="space-y-12 md:space-y-16">
            {/* Experience 1 - BeyondScale Technologies */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              {/* Timeline */}
              <div className="w-full md:w-1/4 flex-shrink-0">
                <div className="text-sm md:text-base text-zinc-500 font-semibold font-safiro">
                  OCT 2024 - PRESENT
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-zinc-800 mt-2 font-chaney">
                  Web Developer
                </h3>
                <p className="text-sm md:text-base text-zinc-600 mt-1 font-safiro">
                  BeyondScale Technologies Private Limited
                </p>
              </div>

              {/* Image */}
              <div className="w-full md:w-1/4 flex-shrink-0">
                <div className="relative w-full">
                  <Image
                    src="/4A7854D1-47E5-4B3F-930C-08883BB03802.jpeg"
                    alt="BeyondScale Experience"
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain grayscale"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm md:text-base text-zinc-700 leading-tight font-safiro text-right">
                  Successfully delivered <span className="text-zinc-600 font-semibold">16+ projects</span> while leading and mentoring junior developers. Worked on high-impact <span className="text-zinc-600 font-semibold">government projects for Andhra Pradesh</span>, ensuring quality standards and timely delivery of critical applications. Learned <span className="text-zinc-600 font-semibold">React Native</span> from scratch and applied it to build cross-platform mobile applications. Directly <span className="text-zinc-600 font-semibold">interacted with clients</span>, conducting live demos and presentations. Handled <span className="text-zinc-600 font-semibold">client and vendor communications</span> via email, resolving technical issues and managing support tickets. Took ownership of <span className="text-zinc-600 font-semibold">urgent company tasks</span> requiring immediate attention, demonstrating reliability and problem-solving under pressure.
                </p>
              </div>
            </div>

            {/* Experience 2 - Freelance */}
            <div className="flex flex-col gap-8 md:gap-12">
              {/* Top Row: Timeline and Content */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                {/* Timeline */}
                <div className="w-full md:w-1/4 flex-shrink-0">
                  <div className="text-sm md:text-base text-zinc-500 font-semibold font-safiro">
                    JULY 2023 - SEPT 2024
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-zinc-800 mt-2 font-chaney">
                    Freelance Developer
                  </h3>
                  <p className="text-sm md:text-base text-zinc-600 mt-1 font-safiro">
                    Self-Employed
                  </p>
                </div>

                {/* Content - Full Width */}
                <div className="flex-1">
                  <p className="text-sm md:text-base text-zinc-700 leading-tight font-safiro text-right">
                    Started my journey as a freelance developer, working with diverse clients to build <span className="text-zinc-600 font-semibold">custom web solutions</span>. Managed complete project lifecycles from initial consultation to deployment and maintenance. Developed proficiency in <span className="text-zinc-600 font-semibold">client communication, project management, and time estimation</span>. Created landing pages, business websites, and web applications tailored to specific client requirements. Built a strong foundation in <span className="text-zinc-600 font-semibold">HTML, CSS, JavaScript, and React</span>, while developing problem-solving skills and learning to adapt to different project requirements and technologies.
                  </p>
                </div>
              </div>

              {/* Image - Below, Right Aligned */}
              <div className="w-full flex justify-end">
                <div className="w-full md:w-1/3">
                  <div className="relative w-full">
                    <Image
                      src="/experience-image.jpg"
                      alt="Freelance Experience"
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain grayscale"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
