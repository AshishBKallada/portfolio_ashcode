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
      className="relative flex min-h-screen w-full flex-col overflow-hidden"
    >
      <div className="relative h-[30vh] w-full bg-white md:h-[40vh]" />

      <div className="relative flex w-full flex-1 items-center bg-white px-6 py-6 md:px-12 lg:px-16">
        <div className="relative z-10 mx-auto w-full max-w-8xl">
          <div className="w-full">
            <div className="mb-12 md:mb-16">
              <div className="flex flex-col gap-2 md:gap-4">
                <div className="flex items-center">
                  <h1 className="text-center font-chaney text-6xl font-bold leading-none text-black md:text-left md:text-7xl lg:text-8xl">
                    ILLEGAL
                  </h1>

                  <div className="flex-shrink-0">
                    <Image
                      src="/doodlearrow.png"
                      alt=""
                      width={60}
                      height={60}
                      className="-mt-16 object-contain"
                    />
                  </div>

                  <p className="-ml-12 font-safiro text-[0.5rem] italic text-black md:text-[0.65rem] lg:text-xs">
                    yes, i m damn <br /> sure about that
                  </p>
                </div>

                <h1 className="text-center font-chaney text-6xl font-bold leading-none text-black md:text-left md:text-7xl lg:text-8xl">
                  TECH STACK
                </h1>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-6 grid grid-cols-2 gap-x-4 md:mb-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8 xl:grid-cols-7">
                {Object.keys(skillCategories).map((category) => (
                  <div
                    key={category}
                    className="font-safiro text-sm text-black/70 md:text-base"
                  >
                    {category}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-3 md:gap-x-6 md:gap-y-6 lg:grid-cols-4 lg:gap-x-8 xl:grid-cols-7">
                {Object.entries(skillCategories).map(([category, skills]) => (
                  <div key={category} className="flex flex-col">
                    <div className="flex flex-col gap-2 md:gap-3">
                      {skills.map((skill) => (
                        <div
                          key={`${category}-${skill}`}
                          className="font-safiro text-sm text-black/80 md:text-base"
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
