"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SkillsSection2Props {
  animationDelay?: number;
  duration?: number;
}

export default function SkillsSection2({
  animationDelay = 0,
  duration = 1,
}: SkillsSection2Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const skillsContainerRef = useRef<HTMLDivElement>(null);
  
  // Skills organized by category
  const skillsByCategory = [
    {
      category: "Frontend",
      skills: ["React", "Next.js", "React Native", "Tailwind CSS", "ShadCN", "Ant Design", "HTML", "CSS", "Bootstrap", "JavaScript", "Ajax", "jQuery", "Redux", "Framer-motion", "MUI"]
    },
    {
      category: "Backend",
      skills: ["Node.js", "Express.js", "TypeScript", "REST API", "MVC architecture", "Clean architecture", "JWT", "EJS", "gRPC", "Kafka"]
    },
    {
      category: "Database",
      skills: ["MongoDB", "PostgreSQL", "MySQL"]
    },
    {
      category: "Integrations",
      skills: ["Nodemailer", "Zegocloud", "Passport.js", "Firebase", "Socket.IO", "Cloudinary", "Razorpay", "Chart.js"]
    },
    {
      category: "Deployment",
      skills: ["NGINX", "AWS EC2", "Amazon Route 53", "Vercel", "Hostinger", "Render"]
    },
    {
      category: "Testing",
      skills: ["Mocha", "ESLint"]
    },
    {
      category: "Familiar with",
      skills: ["Data Structures and Algorithms", "Git", "GitHub", "Docker", "Kubernetes", "OOPS", "Figma", "Postman", "Moon Modeler", "Java", "PHP", "JSON", "CI/CD", "Microservices", "AWS"]
    }
  ];

  // Create lines with category names
  const skillLines: Array<{ category: string; skills: string[] }> = [];
  skillsByCategory.forEach((categoryData) => {
    skillLines.push({
      category: categoryData.category,
      skills: categoryData.skills
    });
  });

  useEffect(() => {
    const section = sectionRef.current;
    const skillsContainer = skillsContainerRef.current;
    
    if (!section || !skillsContainer) return;

    const ctx = gsap.context(() => {
      // Get all line containers (div elements)
      const skillLines = gsap.utils.toArray<HTMLElement>(skillsContainer.children);

      // Set initial state for all lines
      gsap.set(skillLines, {
        opacity: 0,
        y: 50,
      });

      // Calculate scroll distance needed (one line per scroll increment)
      const totalLines = skillLines.length;
      const scrollDistance = totalLines * 200; // 200px per line

      // Create scroll trigger with scrub for smooth, reversible animation
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: `+=${scrollDistance}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          // Calculate which line should be visible
          // When progress is 1, show all lines (use totalLines - 1 to include last line)
          const currentLineIndex = Math.min(
            Math.floor(progress * (totalLines)),
            totalLines - 1
          );
          
          // Animate lines one by one based on scroll progress
          skillLines.forEach((line, index) => {
            if (index <= currentLineIndex) {
              // Show lines up to and including current index
              gsap.to(line, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            } else {
              // Hide lines after current index
              gsap.to(line, {
                opacity: 0,
                y: 50,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          });
        },
        onLeave: () => {
          // Ensure all lines are visible when section is scrolled past
          skillLines.forEach((line) => {
            gsap.set(line, {
              opacity: 1,
              y: 0,
            });
          });
        },
        onEnterBack: () => {
          // When scrolling back into section, maintain current state
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full min-h-screen py-20 px-6 md:px-12 lg:px-16 flex flex-col items-center justify-center bg-transparent"
    >
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-chaney mb-12 md:mb-16 text-center">
        TECHNIQUES
      </h2>
      
      {/* Skills in multiple lines separated by / */}
      <div ref={skillsContainerRef} className="flex flex-col gap-4 md:gap-6 lg:gap-8 w-full max-w-7xl">
        {skillLines.map((line, lineIndex) => (
          <div
            key={lineIndex}
            className="flex flex-wrap items-center justify-center gap-2 md:gap-4"
          >
            <span className="text-base md:text-lg lg:text-xl font-bold font-safiro text-white/50">
              {line.category}:
            </span>
            {line.skills.map((skill, skillIndex) => (
              <span key={skillIndex} className="skill-item text-base md:text-lg lg:text-xl font-safiro text-white inline-block">
                {skill}
                {skillIndex < line.skills.length - 1 && <span className="mx-2 md:mx-4 separator">/</span>}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
