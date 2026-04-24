"use client";

import { useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const intro = introRef.current;
    const section1 = section1Ref.current;
    const section2 = section2Ref.current;
    const wrap = container?.parentElement ?? null;

    if (!section || !container || !intro || !section1 || !section2 || !wrap)
      return;

    const scroller = document.getElementById("portfolio-main");
    if (!scroller) return;

    const panels = [intro, section1, section2];

    const setup = () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });

      const w = wrap.clientWidth;
      panels.forEach((el) => {
        el.style.width = `${w}px`;
        el.style.minWidth = `${w}px`;
      });

      const totalWidth = w * 3;
      gsap.set(container, { width: totalWidth, x: 0 });

      const sc = scroller as HTMLElement;
      ScrollTrigger.create({
        trigger: section,
        scroller: sc,
        start: "top top",
        end: () => `+=${Math.max(0, totalWidth - sc.clientWidth)}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const x = -(totalWidth - sc.clientWidth) * progress;
          gsap.set(container, { x });
        },
      });
    };

    setup();
    window.addEventListener("resize", setup);

    return () => {
      window.removeEventListener("resize", setup);
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
      gsap.set(container, { clearProps: "width,x" });
      panels.forEach((el) => {
        el.style.width = "";
        el.style.minWidth = "";
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="w-full shrink-0 overflow-hidden bg-white"
    >
      {/* Horizontal Scroll Container */}
      <div className="relative w-full h-screen">
        <div 
          ref={containerRef}
          className="flex h-screen"
        >
          {/* Page 1: My journey so far */}
          <div 
            ref={introRef}
            className="w-screen h-screen flex-shrink-0 bg-white flex items-center justify-center px-16"
          >
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black font-chaney">
                <span className="text-base md:text-lg lg:text-xl font-bold text-black font-chaney">
                  my journey so far !
                </span>
              </h2>
            </div>
          </div>

          {/* Page 2: Experience Section 1 */}
          <div
            ref={section1Ref}
            className="h-screen flex-shrink-0 bg-crimson-red flex items-center justify-center px-16 relative overflow-hidden"
          >
            {/* Empty section */}
          </div>

          {/* Page 3: Experience Section 2 */}
          <div
            ref={section2Ref}
            className="h-screen flex-shrink-0 bg-white flex items-center justify-center px-16 relative"
          >
            {/* Empty section */}
          </div>
        </div>
      </div>
    </section>
  );
}
