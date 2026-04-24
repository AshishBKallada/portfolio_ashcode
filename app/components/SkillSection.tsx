"use client";

import Image, { type StaticImageData } from "next/image";

import type { ColorScheme } from "../lib/color-scheme";

export type SkillRow = {
  /** Primary label — e.g. skill or domain name */
  name: string;
  /** Stack / platform / layer */
  stack: string;
  /** Short index label, e.g. "(a.)" */
  index: string;
  /** Comma-separated or free-text detail column */
  tags: string;
};

/** Same taxonomy as the former `SkillsSection` — one row per skill. */
const SKILL_CATEGORIES: Record<string, readonly string[]> = {
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

/** One row per skill — tall list; pass as `rows={buildFlatSkillRows()}` if you need it. */
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

/** One row per category — compact, Evolve-style dense block with all skills in the last column. */
function buildCompactCategoryRows(): SkillRow[] {
  return Object.entries(SKILL_CATEGORIES).map(([category, skills], i) => ({
    name: category.replace(/-/g, " ").toUpperCase(),
    stack: `${skills.length} tools`,
    index: `(${String.fromCharCode(97 + i)}.)`,
    tags: skills.map((s) => s.toUpperCase()).join(", "),
  }));
}

const DEFAULT_ROWS: SkillRow[] = buildCompactCategoryRows();

type SkillSectionProps = {
  rows?: SkillRow[];
  /** Column labels above the grid (Evolve-style). */
  labels?: { name: string; stack: string; index: string; tags: string };
  /** Optional center image; row hovers pass underneath (lower z-index). */
  centerImage?: { src: string | StaticImageData; alt: string; width: number; height: number };
  className?: string;
  id?: string;
  colorScheme?: ColorScheme;
};

export default function SkillSection({
  rows = DEFAULT_ROWS,
  labels = {
    name: "Category",
    stack: "Scope",
    index: "",
    tags: "Tools & skills",
  },
  centerImage,
  className = "",
  id = "skills",
  colorScheme = "dark",
}: SkillSectionProps) {
  const light = colorScheme === "light";
  const innerShell =
    "mx-auto w-full max-w-[min(100%,90rem)] px-5 md:px-10 lg:px-14";

  const gridBg = light
    ? `repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(0,0,0,0.06) calc(8.333333% - 1px), rgba(0,0,0,0.06) 8.333333%),
            repeating-linear-gradient(180deg, transparent 0, transparent calc(2.125rem - 1px), rgba(0,0,0,0.05) calc(2.125rem - 1px), rgba(0,0,0,0.05) 2.125rem)`
    : `repeating-linear-gradient(90deg, transparent 0, transparent calc(8.333333% - 1px), rgba(255,255,255,0.045) calc(8.333333% - 1px), rgba(255,255,255,0.045) 8.333333%),
            repeating-linear-gradient(180deg, transparent 0, transparent calc(2.125rem - 1px), rgba(255,255,255,0.045) calc(2.125rem - 1px), rgba(255,255,255,0.045) 2.125rem)`;

  return (
    <section
      id={id}
      className={`relative isolate w-full overflow-hidden py-14 transition-colors duration-300 md:py-20 lg:py-24 ${light ? "bg-white text-black" : "bg-[#0a0a0a] text-white"} ${className}`}
      aria-label="Skills and capabilities"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ backgroundImage: gridBg }}
        aria-hidden
      />

      {centerImage ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <Image
            src={centerImage.src}
            alt={centerImage.alt}
            width={centerImage.width}
            height={centerImage.height}
            className="h-auto max-h-[min(72vh,38rem)] w-auto max-w-[min(42vw,20rem)] object-contain opacity-95 md:max-w-[min(36vw,22rem)]"
          />
        </div>
      ) : null}

      <div className="relative z-10 w-full">
        <div className={innerShell}>
          <div
            className={`mb-4 grid grid-cols-2 gap-x-4 gap-y-2 border-b pb-4 font-mono text-[10px] font-normal uppercase tracking-[0.16em] md:mb-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)_4rem_minmax(0,1.4fr)] md:gap-x-10 md:gap-y-0 md:pb-5 md:text-[11px] lg:text-xs ${light ? "border-black/12 text-black/45" : "border-white/15 text-white/45"}`}
            aria-hidden
          >
            <span>{labels.name}</span>
            <span className="md:col-auto">{labels.stack}</span>
            <span className="hidden text-right md:block">{labels.index}</span>
            <span className="col-span-2 text-right md:col-span-1">{labels.tags}</span>
          </div>
        </div>

        <ul className="flex w-full flex-col">
          {rows.map((row, i) => (
            <li key={`${row.name}-${i}`} className="w-full">
              <div
                className={`group w-full border-b transition-colors duration-200 ease-out ${light ? "border-black/[0.1] hover:bg-black hover:border-white/15" : "border-white/[0.1] hover:bg-white hover:border-black/[0.08]"}`}
              >
                <div
                  className={`${innerShell} grid grid-cols-2 gap-x-4 gap-y-1 py-2 md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)_4rem_minmax(0,1.4fr)] md:gap-x-10 md:gap-y-0 md:py-2.5 lg:py-3`}
                >
                  <span
                    className={`self-center font-mono text-[11px] font-medium uppercase leading-snug tracking-[0.11em] transition-colors md:text-xs md:tracking-[0.13em] lg:text-sm ${light ? "text-black/90 group-hover:text-white" : "text-white/95 group-hover:text-black"}`}
                  >
                    {row.name}
                  </span>
                  <span
                    className={`self-center font-mono text-[11px] font-normal uppercase leading-snug tracking-[0.1em] transition-colors md:text-xs md:tracking-[0.12em] lg:text-sm ${light ? "text-black/55 group-hover:text-white/85" : "text-white/60 group-hover:text-black"}`}
                  >
                    {row.stack}
                  </span>
                  <span
                    className={`hidden self-center text-right font-mono text-[10px] lowercase tracking-normal transition-colors md:block md:text-[11px] lg:text-xs ${light ? "text-black/45 group-hover:text-white/70" : "text-white/50 group-hover:text-black/70"}`}
                  >
                    {row.index}
                  </span>
                  <span
                    className={`col-span-2 self-center text-left font-mono text-[10px] font-normal uppercase leading-relaxed tracking-[0.09em] transition-colors md:col-span-1 md:text-right md:text-[11px] md:leading-relaxed md:tracking-[0.1em] lg:text-xs ${light ? "text-black/55 group-hover:text-white/85" : "text-white/55 group-hover:text-black"}`}
                  >
                    <span
                      className={`mr-2 transition-colors md:hidden ${light ? "text-black/40 group-hover:text-white/55" : "text-white/40 group-hover:text-black/55"}`}
                    >
                      {row.index}
                    </span>
                    {row.tags}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
