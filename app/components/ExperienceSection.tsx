"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactSection from "./ContactSection";

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
      className="w-full bg-white"
    >
      <div className="relative">
        {/* Heading Section - Sticky */}
        <div className="sticky top-0 w-full h-screen flex items-center justify-center bg-white px-6 md:px-12 z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center font-chaney whitespace-nowrap">
            <span className="text-base md:text-lg lg:text-xl font-bold text-black text-center font-chaney whitespace-nowrap">
              huh, how was my journey so far ?
            </span>
          </h2>
        </div>

        {/* Experience 1 - Web Developer at BeyondScale - Sticky, scrolls over heading */}
        <div className="sticky top-0 w-full flex flex-col lg:flex-row min-h-screen z-20">
          {/* Left Column - Dark Background with Content */}
          <div className="w-full lg:w-2/3 h-screen lg:h-auto lg:min-h-screen flex-shrink-0 bg-black relative overflow-hidden">
            <Image
              src="/me.jpeg"
              alt="Experience Background"
              fill
              className="object-cover object-top grayscale opacity-50"
            />       
               <div className="absolute inset-0 bg-black/40 z-10"></div>

            <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-12 lg:p-16">
              <div className="flex flex-col gap-6">
                {/* Number Circle */}
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <span className="text-black text-xl font-bold font-safiro">1</span>
                </div>

                {/* Paragraph Text */}
                <div className="max-w-xl">
                  <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed font-safiro">
                    Successfully delivered <span className="font-semibold">16+ projects</span> while leading and mentoring junior developers. Worked on high-impact <span className="font-semibold">government projects for Andhra Pradesh</span>, ensuring quality standards and timely delivery of critical applications.
                  </p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col gap-4">
                {/* Large Heading */}
                <div className="overflow-visible">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-tight font-chaney uppercase">
                    <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight font-chaney uppercase">
                      WEB<br />DEVELOPER
                    </span>
                  </h1>
                </div>

               
              </div>
            </div>
          </div>

          {/* Right Column - Colorful Background */}
          <div className="w-full lg:w-1/3 h-screen lg:h-auto bg-black lg:min-h-screen flex-shrink-0 relative overflow-hidden">
          
            <div className="relative w-full h-full p-6 md:p-12">
              <div className="w-full h-full flex flex-col justify-between">
                {/* Top Section */}
                <div className="flex justify-between items-start">
                  <div className="text-white text-xs md:text-sm uppercase tracking-wider font-safiro">
                    OCT 2024 - PRESENT
                  </div>
                 
                </div>

                {/* Center Section - Stats */}
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="text-7xl md:text-8xl lg:text-9xl font-bold text-white font-chaney">
                    16+
                  </div>
                  <div className="text-white text-sm md:text-base font-safiro text-center">
                    projects delivered
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="text-white text-xs md:text-sm font-safiro">
                  BeyondScale Technologies
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Experience 2 - Freelance Developer - Sticky, scrolls over Experience 1 */}
      <div className="sticky top-0 w-full h-screen z-30 bg-white flex items-center justify-center overflow-hidden">
        {/* Image */}
        <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
          <div className="relative w-full aspect-square max-h-full">
            <Image
              src="/stubble5.png"
              alt="Freelance Experience"
              fill
              className="object-contain grayscale"
            />
          </div>
        </div>
        
        {/* Text Content - Above Image */}
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-12 lg:p-16">
            <div className="flex flex-col gap-6">
              {/* Number Circle */}
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                <span className="text-white text-xl font-bold font-safiro">2</span>
              </div>

              {/* Paragraph Text */}
              <div className="max-w-xl">
                <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed font-safiro">
                  Started my journey as a freelance developer, working with diverse clients to build <span className="font-semibold">custom web solutions</span>. Managed complete project lifecycles from initial consultation to deployment and maintenance. Developed proficiency in <span className="font-semibold">client communication, project management, and time estimation</span>.
                </p>
              </div>
            </div>

           
          </div>

          {/* Right Side Content */}
          <div className="absolute top-0 right-0 h-full flex flex-col justify-between items-end p-6 md:p-12 z-50">
            {/* Date - Top Right */}
            <div className="text-black text-xs md:text-sm uppercase tracking-wider font-safiro">
              JULY 2023 - SEPT 2024
            </div>

            {/* Text - Center Right */}
            <div className="text-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight font-chaney uppercase text-right">
              FRE<br />ELA<br />NCE
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section - Scrolls over Experience 2 */}
      <div className="relative w-full min-h-screen z-40 bg-white">
        <ContactSection />
      </div>
      </div>
    </section>
  );
}
