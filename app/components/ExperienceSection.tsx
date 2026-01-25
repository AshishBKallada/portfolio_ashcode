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
        <div className="sticky top-0 w-full h-screen flex items-center justify-center bg-white px-6 md:px-12 z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center font-chaney whitespace-nowrap">
            <span className="text-base md:text-lg lg:text-xl font-bold text-black text-center font-chaney whitespace-nowrap">
               my journey so far !
            </span>
          </h2>
        </div>

        <div className="sticky top-0 w-full flex flex-col lg:flex-row min-h-screen z-20">
          <div className="w-full lg:w-2/3 h-screen lg:h-auto lg:min-h-screen flex-shrink-0 bg-white relative overflow-hidden flex items-center justify-center px-1 md:px-2 lg:px-3 py-2">
            <div className="w-full max-w-3xl flex flex-col gap-8">
              <div className="text-xs md:text-sm text-black uppercase tracking-wider font-safiro">
                OCT 2024 - PRESENT / BEYONDSCALE TECHNOLOGIES
              </div>
              
              <div className="flex flex-col gap-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-tight font-chaney uppercase">
                  WEB DEVELOPER
                </h1>
                
                <div className="max-w-2xl">
                  <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed font-safiro">
                    Successfully delivered <span className="font-semibold text-black">16+ projects</span> while leading and mentoring junior developers. Worked on high-impact <span className="font-semibold text-black">government projects for Andhra Pradesh</span>, ensuring quality standards and timely delivery of critical applications.
                  </p>
                </div>
              </div>

              <div className="text-black text-xs md:text-sm font-safiro">
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 h-screen lg:h-auto lg:min-h-screen flex-shrink-0 bg-white relative overflow-hidden flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold text-black/20 font-chaney">
                15<sup>+</sup>
              </div>
              <div className="text-xs md:text-sm text-black/20 font-safiro uppercase tracking-widest mt-1">
                projects
              </div>
            </div>
          </div>
        </div>

      <div className="sticky top-0 w-full h-screen z-30 bg-white flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
          <div className="relative w-full aspect-square max-h-full">
            <div className="w-full h-full relative">
              {/* Text behind the image */}
              <span
                className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none font-bold text-black/10 text-[60px] md:text-[90px] lg:text-[140px] uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-chaney), sans-serif', letterSpacing: '0.2em', lineHeight: 1.6, fontStretch: 'expanded', WebkitTextStroke: '1px transparent', }}
                aria-hidden="true"
              >
                <span
                  className="inline-block"
                  style={{
                    willChange: "transform",
                    display: "inline-block"
                  }}
                  ref={el => {
                    if (el && typeof window !== "undefined") {
                      import("gsap").then(({ default: gsap }) => {
                        gsap.set(el, { y: -80 });
                        gsap.to(el, {
                          y: 0,
                          ease: "power1.out",
                          scrollTrigger: {
                            trigger: el,
                            start: "top 90%",
                            end: "top center",
                            scrub: 1,
                          },
                        });
                      });
                    }
                  }}
                >
                  FREELANCE
                </span>
              </span>
              {/* Main image */}
              <Image
                src="/stubble5-Photoroom.png"
                alt="Freelance Experience"
                fill
                className="object-contain grayscale relative z-10"
                ref={img => {
                  // Show full image (especially bottom portion) at the start
                  if (img && typeof window !== "undefined") {
                    import("gsap").then(({ default: gsap }) => {
                      // Kill previous tweens
                      gsap.killTweensOf(img);
                      // Start y=0 and animate up, so full image always visible in container
                      gsap.set(img, { y: 0 });
                      gsap.to(img, {
                        y: -120, // only slight upward movement; keeps bottom always in view
                        ease: "none",
                        scrollTrigger: {
                          trigger: img,
                          start: "top bottom",
                          end: "top top",
                          scrub: 1,
                        },
                      });
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-12 lg:p-16">
          <div className="flex flex-col gap-6">
            <div className="text-xs md:text-sm text-black uppercase tracking-wider font-safiro">
              JULY 2023 - SEPT 2024
            </div>

            <div className="max-w-xl">
              <p className="text-black text-sm md:text-base lg:text-lg leading-relaxed font-safiro">
                Started my journey as a freelance developer, working with diverse clients to build <span className="font-semibold">custom web solutions</span>. Managed complete project lifecycles from initial consultation to deployment and maintenance. Developed proficiency in <span className="font-semibold">client communication, project management, and time estimation</span>.
              </p>
            </div>
          </div>
        </div>

        
        </div>
      </div>

      <div className="relative w-full min-h-screen z-40 bg-white">
        <ContactSection />
      </div>
      </div>
    </section>
  );
}
