"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const getInTouchOption = {
    id: "contact",
    timeEstimate: "1 minute",
    title: "GET IN TOUCH.",
    description: "Use a traditional contact form to send us a quick message. We usually reply the same day.",
    image: "/pillar2.png",
  };

  const otherOptions = [
    {
      id: "brief",
      timeEstimate: "2-5 minutes",
      title: "SUBMIT A NEW BRIEF.",
      description: "In just 5 steps provide us with all the most vital information about your project so we can get started sooner.",
      image: "/scroll-with-japanese-calligraphy-wooden-stand-with-two-rolledup-scrolls.jpg",
    },
    {
      id: "call",
      timeEstimate: "3 minutes",
      title: "BOOK A FREE CALL.",
      description: "Book a free 30-minute consultation with one of our Creative Directors to see if we'll be a good fit for your project.",
      image: "/hand-dials-old-red-rotary-phone-dusted-with-time.jpg",
    },
  ];

  const renderContactCard = (option: typeof getInTouchOption, showImage: boolean = true) => {
    return (
      <div className="bg-white text-black relative overflow-hidden group cursor-pointer transition-all duration-300 h-full">
        <div className={`h-full flex flex-col ${showImage ? 'justify-between' : 'justify-start'} p-4 md:p-6 lg:p-8 xl:p-10`}>
          <div className="flex flex-col">
            <div className="bg-zinc-200 text-black group-hover:bg-zinc-300 inline-block px-3 py-1.5 rounded-full text-xs font-medium mb-8 w-fit transition-colors duration-300">
              {option.timeEstimate}
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold mb-6 leading-tight tracking-tight uppercase font-chaney">
              {option.title}
            </h2>

            <p className="text-sm md:text-base lg:text-sm leading-tight max-w-sm opacity-80">
              {option.description}
            </p>
          </div>

          {showImage && (
            <div className="relative w-48 md:w-56 lg:w-64 h-48 md:h-56 lg:h-64 self-start">
              <Image
                src={option.image}
                alt={option.title}
                fill
                className="object-cover object-center grayscale transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 192px, 256px"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const allOptions = [getInTouchOption, ...otherOptions];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const contactHeroes = section.querySelectorAll<HTMLElement>(".contact-hero");
      const firstHero = contactHeroes[0];
      const bottomHeroes = Array.from(contactHeroes).slice(1);
      
      contactHeroes.forEach((hero) => {
        gsap.set(hero, { height: 0, overflow: "hidden" });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".parent-contact",
          start: "top 120%",
          end: "bottom -120%",
          scrub: true,
        },
      });

      tl.to(firstHero, {
        height: "30vh",
        duration: 1,
      })
      .to(bottomHeroes, {
        height: "60vh",
        duration: 1,
      }, "-=0.5");
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full min-h-screen flex flex-col bg-white ">
      <div className="w-full h-16 md:h-24 lg:h-32 bg-white"></div>
      <div className="p-4">
        <div className="">
          <h1 className="text-[16vw] md:text-[12vw] font-chaney uppercase leading-[0.8] text-black">
            Contact
          </h1>
        </div>
        <div className="w-full parent-contact flex flex-col gap-4">
          <div className="w-full contact-hero mb-4 flex gap-4 overflow-hidden">
            <div className="w-full border border-black h-full">
              {renderContactCard(getInTouchOption, false)}
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-4">
            {otherOptions.map((option) => (
              <div
                key={option.id}
                className={`contact-hero flex-1 mb-4 flex gap-4 overflow-hidden ${option.id === "brief" ? "md:border-r-0" : ""}`}
              >
                <div className={`w-full border border-black h-full ${option.id === "brief" ? "md:border-r border-black" : ""}`}>
                  {renderContactCard(option, option.id !== "call")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-16 md:h-24 lg:h-32 bg-white"></div>
    </section>
  );
}
