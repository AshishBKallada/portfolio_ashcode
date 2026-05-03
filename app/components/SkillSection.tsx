"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import type { ColorScheme } from "../lib/color-scheme";

export type SkillRow = {
  name: string;
  stack: string;
  index: string;
  tags: string;
};

/** Same taxonomy as before — exported for reuse. */
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

/** Flat list (e.g. exports, tests). UI groups by category instead. */
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
  /** Override category → skills map; defaults to `SKILL_CATEGORIES`. */
  categories?: Record<string, readonly string[]>;
  title?: string;
  subtitle?: string;
  centerImage?: { src: string | StaticImageData; alt: string; width: number; height: number };
  className?: string;
  id?: string;
  colorScheme?: ColorScheme;
  rows?: SkillRow[];
  labels?: { name: string; stack: string; index: string; tags: string };
};

export default function SkillSection({
  categories = SKILL_CATEGORIES,
  title = "Stack & tools",
  subtitle = "Skills grouped by where they sit in the stack—pick a lane, then scan the tags.",
  centerImage,
  className = "",
  id = "skills",
  colorScheme = "light",
}: SkillSectionProps) {
  const light = colorScheme === "light";

  const shell = "mx-auto w-full max-w-[min(100%,90rem)] px-5 md:px-10 lg:px-14";

  const heading = light ? "text-neutral-950" : "text-white";
  const sub = light ? "text-neutral-600" : "text-white/65";
  const catHeading = light
    ? "font-safiro text-lg font-semibold tracking-[-0.02em] text-neutral-950 md:text-xl"
    : "font-safiro text-lg font-semibold text-white md:text-xl";
  const tagLight =
    "inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 font-safiro text-[12px] font-medium leading-none text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:border-black/18 hover:shadow-sm md:text-[13px]";
  const tagDark =
    "inline-flex items-center rounded-full border border-white/12 bg-white/[0.07] px-3 py-1.5 font-safiro text-[12px] font-medium text-white/95 transition hover:bg-white/[0.1] md:text-[13px]";
  const arrowRing = light
    ? "inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/12 bg-white text-lg text-neutral-900 shadow-sm transition hover:border-black/25 hover:bg-neutral-50 md:h-12 md:w-12"
    : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-lg text-white transition hover:bg-white/10 md:h-12 md:w-12";

  const groups = Object.entries(categories);

  return (
    <section
      id={id}
      className={`relative isolate w-full py-16 transition-colors duration-300 md:py-20 lg:py-24 ${light ? "bg-white text-neutral-950" : "bg-zinc-950 text-white"} ${className}`}
      aria-label="Skills and capabilities"
    >
      {centerImage ? (
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.06]">
          <Image
            src={centerImage.src}
            alt={centerImage.alt}
            width={centerImage.width}
            height={centerImage.height}
            className="h-auto max-h-[min(60vh,28rem)] w-auto max-w-[min(50vw,18rem)] object-contain"
          />
        </div>
      ) : null}

      <div className={`relative z-10 w-full ${shell}`}>
        <h2 className={`font-safiro text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.02em] ${heading}`}>
          {title}
        </h2>
        <p className={`mt-3 max-w-2xl font-safiro text-[15px] leading-relaxed md:text-base ${sub}`}>{subtitle}</p>

        <div className="mt-6">
          <Link href="/#project" className={arrowRing} aria-label="Scroll to projects">
            →
          </Link>
        </div>

        <div className="mt-12 space-y-12 md:mt-14 md:space-y-14">
          {groups.map(([category, skills]) => (
            <section key={category} aria-labelledby={`skill-cat-${slugId(category)}`}>
              <h3 id={`skill-cat-${slugId(category)}`} className={catHeading}>
                {category}
              </h3>
              <ul className="mt-3 flex list-none flex-wrap gap-2 md:mt-4 md:gap-2.5">
                {skills.map((skill) => (
                  <li key={`${category}-${skill}`}>
                    <span className={light ? tagLight : tagDark}>{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function slugId(s: string) {
  return s.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "group";
}
