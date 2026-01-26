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
      className="w-full min-h-[80vh] py-6 px-2 md:px-3 lg:px-4 bg-white flex items-center"
    >
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-3 font-chaney pb-1">AQUIRED SKILLS</h2>
          <div className="w-full h-0.5 bg-black mb-3"></div>
          
          <ul className="space-y-1 text-black text-sm md:text-base list-disc list-inside pl-3 py-6">
            {Object.entries(skillCategories).map(([category, skills]) => (
              <li key={category} className="mb-1 leading-relaxed">
                <strong className="font-semibold">{category}:</strong> {skills.join(", ")}
              </li>
            ))}
          </ul>
          
          <div className="mt-56 text-sm text-black leading-relaxed max-w-xl">
          <span className="text-black">
            <span className="font-semibold">Throughout my journey</span>, I have learned new technologies and <span className="font-semibold">conducted my own research</span> to stay updated in the fast-changing tech world.
          </span>
        </div>
        </div>
      </div>
    </section>
  );
}
