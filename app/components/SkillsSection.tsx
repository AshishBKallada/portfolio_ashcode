"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SkillsSection() {
  const elixirBottleRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elixirBottleRef.current || !sectionRef.current) return;

    gsap.to(elixirBottleRef.current, {
      rotation: 125,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 2.5,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const skillCategories = {
    "Frontend": [
      "React",
      "Next.js",
      "React Native",
      "Tamagui",
      "Tailwind CSS",
      "ShadCN",
      "ANTD",
      "HTML",
      "CSS",
      "Bootstrap",
      "JavaScript",
      "Ajax",
      "jQuery",
      "Redux",
      "Framer-motion",
      "MUI",
      "GSAP"
    ],
    "Backend": [
      "Node.js",
      "Express.js",
      "TypeScript",
      "REST API",
      "MVC architecture",
      "Clean architecture",
      "JWT",
      "EJS",
      "gRPC",
      "Kafka"
    ],
    "Database": [
      "MongoDB",
      "PostgreSQL",
      "MySQL"
    ],
    "Integrations": [
      "Nodemailer",
      "Zegocloud",
      "Passport.js",
      "Firebase",
      "Socket.IO",
      "Cloudinary",
      "Razorpay",
      "Chart.js"
    ],
    "Deployment": [
      "NGINX",
      "AWS EC2",
      "Amazon Route 53",
      "Vercel",
      "Hostinger",
      "Render",
      "Android deployment",
      "iOS deployment"
    ],
    "Testing": [
      "Mocha",
      "ESLint"
    ],
    "Familiar with": [
      "Data Structures and Algorithms",
      "Git",
      "GitHub",
      "Docker",
      "Kubernetes",
      "OOPS",
      "Figma",
      "Postman",
      "Moon Modeler",
      "Java",
      "PHP",
      "JSON",
      "CI/CD",
      "Microservices",
      "AWS"
    ],
  };

  return (
    <section
      ref={sectionRef}
      id="skills" 
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
    >
      {/* Top Gradient Section (Reverse of AboutMeSection) */}
      <div 
        className="relative w-full h-[30vh] md:h-[40vh]"
        style={{
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #E9D5FF 10%, #C4B5FD 20%, #A78BFA 30%, #8B5CF6 40%, #6B46C1 50%, #4C1D95 60%, #2d1b4e 70%, #000000 80%, #000000 100%)'
        }}
      />
      
      {/* Main Content Section with Black Background */}
      <div className="relative w-full flex-1 bg-black py-6 px-6 md:px-12 lg:px-16 flex items-center">
        {/* Elixir Bottle Background */}
        <div ref={elixirBottleRef} className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/elixir-bottle.png"
            alt="Elixir Bottle"
            fill
            className="object-contain opacity-70"
            style={{ objectPosition: 'center' }}
          />
        </div>
        
        <div className="relative w-full max-w-8xl mx-auto z-10">
          <div className="w-full">
            <div className="mb-12 md:mb-16">
              <div className="flex flex-col gap-2 md:gap-4">
                <div className="flex items-center">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-chaney leading-none text-white text-center md:text-left">
                    MODERN
                  </h1>
                  
                  {/* Hand-drawn image */}
                  <div className="flex-shrink-0">
                    <Image
                      src="/doodlearrow.png"
                      alt="Hand drawn"
                      width={60}
                      height={60}
                      className="object-contain -mt-16"
                    />
                  </div>
                  
                  {/* Text */}
                  <p className="text-[0.5rem] -ml-12 md:text-[0.65rem] lg:text-xs font-safiro text-white italic">
                    yes, i m damn <br/> sure about that
                  </p>
                </div>
                
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-chaney leading-none text-white text-center md:text-left">
                  TECH STACK
                </h1>
              </div>
            </div>
            
            <div className="flex flex-col">
              {/* Category Headings Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-x-4 md:gap-x-6 lg:gap-x-8 mb-6 md:mb-8">
                {Object.keys(skillCategories).map((category) => (
                  <div key={category} className="text-sm md:text-base text-white/60 font-safiro">
                    {category}
                  </div>
                ))}
              </div>
              
              {/* Skills Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-4 md:gap-y-6">
                {Object.entries(skillCategories).map(([category, skills]) => (
                  <div key={category} className="flex flex-col">
                    <div className="flex flex-col gap-2 md:gap-3">
                      {skills.map((skill) => (
                        <div
                          key={`${category}-${skill}`}
                          className="text-sm md:text-base text-gray-300 font-safiro"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
