import { SITE } from "./site";

export const INTRO_BADGES = [
  { label: "FS", title: "Full-stack", className: "bg-teal-600 text-white" },
  { label: "UI", title: "Interface design", className: "bg-surface text-ink border border-ink/15" },
  { label: "TS", title: "TypeScript", className: "bg-surface text-ink border border-ink/15" },
  { label: "IN", title: SITE.baseCity, className: "bg-amber-700/90 text-white" },
] as const;

export const INTRO_COPY = {
  metaSection: "(02)",
  metaLabel: "About · 自己紹介",
  lead:
    `Hi! I'm ${SITE.fullName.split(" ")[0]}, a ${SITE.role.toLowerCase()}. I build production web apps — React and Next.js on the front, Node and Express behind the API, and the databases that hold it all together. From government platforms to health-tech and founder-led products.`,
  body:
    "I take projects from rough idea to shipped software — scoping with stakeholders, designing interfaces that stay out of the way, and writing code that teams can maintain after launch. Small teams, tight deadlines, real users.",
  experience:
    "Previously, I've shipped for the Kuppam Area Development Authority (Andhra Pradesh), built hospital ops at Curengo, and delivered brand and product sites for Verdura and Womarpools — experience across government scale, regulated health-tech, and fast-moving founder work.",
  cta: "Let's talk",
  skillsCta: "View stack",
  image: "/intro-portrait.png",
  imageAlt: "Ashish Kallada — portrait",
} as const;
