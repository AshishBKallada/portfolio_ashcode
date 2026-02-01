"use client";

export default function SkillsSection() {

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
      id="skills" 
      className="w-full min-h-[80vh] py-6 px-6 md:px-12 lg:px-16 bg-white flex items-center"
    >
      <div className="relative w-full max-w-8xl mx-auto">
        <div className="w-full">
          <div className="mb-12 md:mb-16">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-chaney leading-none text-black text-center md:text-left">
              MODERN <br/>TECH STACK
            </h1>
          </div>
          
          <ul className="space-y-1 text-black text-sm md:text-base list-disc list-inside pl-3 py-6">
            {Object.entries(skillCategories).map(([category, skills]) => (
              <li key={category} className="mb-1 leading-relaxed">
                <strong className="font-semibold text-sm md:text-base">{category}:</strong> {skills.join(", ")}
              </li>
            ))}
          </ul>
          
        
        </div>
      </div>
    </section>
  );
}
