"use client";

import { useRef, useState } from "react";

import SkillsModal from "./SkillsModal";
import type { ColorScheme } from "../lib/color-scheme";

export type SkillRow = {
  name: string;
  stack: string;
  index: string;
  tags: string;
};

/** Exported for reuse across the app. */
export const SKILL_CATEGORIES: Record<string, readonly string[]> = {
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

export function buildFlatSkillRows(): SkillRow[] {
  const rows: SkillRow[] = [];
  let n = 0;
  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    const stack = category.replace(/-/g, " ").toUpperCase();
    for (const skill of skills) {
      n += 1;
      rows.push({
        name: skill,
        stack,
        index: `(${String(n).padStart(2, "0")})`,
        tags: "—",
      });
    }
  }
  return rows;
}

export type SkillTile = {
  id: string;
  skill: string;
  category: string;
};

export function buildAllSkillTiles(): SkillTile[] {
  const out: SkillTile[] = [];
  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    for (const skill of skills) {
      out.push({
        id: `${category}:${skill}`,
        skill,
        category,
      });
    }
  }
  return out;
}

type SkillSectionProps = {
  line1?: string;
  line2?: string;
  className?: string;
  id?: string;
  colorScheme?: ColorScheme;
  showButton?: boolean;
};

export default function SkillSection({
  line1 = "Let Ashcode's full-stack craft",
  line2 = "conquer your product shipping.",
  className = "",
  id = "skills",
  colorScheme = "light",
  showButton = true,
}: SkillSectionProps) {
  const light = colorScheme === "light";
  const [skillsOpen, setSkillsOpen] = useState(false);
  const skillsButtonRef = useRef<HTMLButtonElement>(null);

  const pillBtn =
    "mt-8 inline-flex items-center justify-center rounded-full border border-[#3d2e26]/15 bg-[#ebe8e1] px-7 py-2.5 font-safiro text-sm font-medium text-[#3d2e26] shadow-[0_6px_18px_rgba(61,46,38,0.09),inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:shadow-[0_8px_22px_rgba(61,46,38,0.11)] md:mt-10 md:px-8 md:py-3 md:text-[15px]";

  return (
    <section
      id={id}
      className={`relative isolate flex min-h-[min(85dvh,40rem)] w-full flex-col items-center justify-center px-6 py-20 transition-colors duration-300 md:min-h-[min(80dvh,44rem)] md:px-10 md:py-24 ${light ? "bg-white" : "bg-zinc-950"} ${className}`}
      aria-label="Stack and tools"
    >
      <div className="flex flex-col items-center">
        <p
          className={`max-w-[min(100%,28rem)] text-center font-safiro text-[clamp(1.35rem,4.2vw,2.35rem)] font-light leading-[1.35] tracking-[-0.02em] md:max-w-2xl md:text-[clamp(1.5rem,3.5vw,2.5rem)] ${light ? "text-[#3d2e26]" : "text-white"}`}
        >
          {line1}
          <br />
          {line2}
        </p>
        {showButton ? (
          <button
            ref={skillsButtonRef}
            type="button"
            className={`${pillBtn} ${skillsOpen ? "invisible" : ""}`}
            onClick={() => setSkillsOpen(true)}
            aria-expanded={skillsOpen}
            aria-haspopup="dialog"
          >
            what skills ??
          </button>
        ) : null}
      </div>

      {showButton ? (
        <SkillsModal
          open={skillsOpen}
          onClose={() => setSkillsOpen(false)}
          anchorRef={skillsButtonRef}
          categories={SKILL_CATEGORIES}
        />
      ) : null}
    </section>
  );
}
