"use client";

import Image from "next/image";

export default function SkillsSection() {
  const skillCategories = {
    Frontend: [
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
      "GSAP",
    ],
    Backend: [
      "Node.js",
      "Express.js",
      "TypeScript",
      "REST API",
      "MVC architecture",
      "Clean architecture",
      "JWT",
      "EJS",
      "gRPC",
      "Kafka",
    ],
    Database: ["MongoDB", "PostgreSQL", "MySQL"],
    Integrations: [
      "Nodemailer",
      "Zegocloud",
      "Passport.js",
      "Firebase",
      "Socket.IO",
      "Cloudinary",
      "Razorpay",
      "Chart.js",
    ],
    Deployment: [
      "NGINX",
      "AWS EC2",
      "Amazon Route 53",
      "Vercel",
      "Hostinger",
      "Render",
      "Android deployment",
      "iOS deployment",
    ],
    Testing: ["Mocha", "ESLint"],
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
      "AWS",
    ],
  };

  return (
    <section
      id="skills"
      className="relative flex w-full shrink-0 flex-col overflow-hidden bg-white"
    >
      <div className="relative flex w-full items-start bg-white px-6 pb-8 pt-6 md:px-12 md:pb-10 md:pt-8 lg:px-16">
        <div className="relative z-10 mx-auto w-full max-w-8xl">
          <div className="w-full">
            <div className="mb-8 md:mb-10">
              <div className="flex flex-col gap-1.5 md:gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-center font-chaney text-4xl font-bold leading-none text-black md:text-left md:text-5xl lg:text-6xl">
                    ILLEGAL
                  </h1>

                  <div className="flex-shrink-0">
                    <Image
                      src="/doodlearrow.png"
                      alt=""
                      width={48}
                      height={48}
                      className="-mt-6 object-contain md:-mt-10 md:h-[52px] md:w-[52px]"
                    />
                  </div>

                  <p className="font-safiro text-[0.45rem] italic text-orange-500 md:-ml-2 md:text-[0.55rem] lg:text-[0.65rem]">
                    yes, i m damn <br /> sure about that
                  </p>
                </div>

                <h1 className="text-center font-chaney text-4xl font-bold leading-none text-black md:text-left md:text-5xl lg:text-6xl">
                  TECH STACK
                </h1>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-3 grid grid-cols-2 gap-x-2.5 md:mb-5 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4 lg:gap-x-5 xl:grid-cols-7">
                {Object.keys(skillCategories).map((category) => (
                  <div
                    key={category}
                    className="font-safiro text-[0.625rem] leading-snug text-black/70 md:text-[0.6875rem]"
                  >
                    {category}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-2.5 gap-y-2 md:grid-cols-3 md:gap-x-4 md:gap-y-3 lg:grid-cols-4 lg:gap-x-5 xl:grid-cols-7">
                {Object.entries(skillCategories).map(([category, skills]) => (
                  <div key={category} className="flex flex-col">
                    <div className="flex flex-col gap-1 md:gap-1.5">
                      {skills.map((skill) => (
                        <div
                          key={`${category}-${skill}`}
                          className="font-safiro text-[0.625rem] leading-snug text-black/80 md:text-[0.6875rem]"
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
