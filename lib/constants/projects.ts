import { colors } from "@/lib/theme/colors";

export type Project = {
  number: string;
  name: string;
  tag: string;
  year: string;
  impactLabel: string;
  impactValue: string;
  description: string;
  tech: string[];
  image: string;
  alt: string;
  bgColor: string;
  href: string;
};

export const PROJECTS: Project[] = [
  {
    number: "01",
    name: "KADA",
    tag: "Gov · Full-stack",
    year: "2025",
    impactLabel: "Citizens served",
    impactValue: "1M+",
    description:
      "Digital platform for the Kuppam Area Development Authority — a Government of Andhra Pradesh initiative — unifying citizen services, land records and project tracking into a single surface.",
    tech: ["Next.js", "Node", "PostgreSQL"],
    image: "/project1.avif",
    alt: "KADA Andhra Pradesh government platform",
    bgColor: colors.projectBg.kada,
    href: "#",
  },
  {
    number: "02",
    name: "Curengo",
    tag: "HealthTech · SaaS",
    year: "2025",
    impactLabel: "Patients managed",
    impactValue: "50K+",
    description:
      "Hospital management system handling OPD, IPD, billing, lab and pharmacy in one place — built so small clinics and mid-size hospitals get the same operating leverage as the big chains.",
    tech: ["Next.js", "Node", "MongoDB"],
    image: "/project2.avif",
    alt: "Curengo hospital management system",
    bgColor: colors.projectBg.curengo,
    href: "#",
  },
  {
    number: "03",
    name: "Verdura",
    tag: "Sustainability · Web",
    year: "2025",
    impactLabel: "Trees pledged",
    impactValue: "120K+",
    description:
      "Green culture platform connecting urban communities with reforestation drives, native plant guides and a transparent tracker for every sapling pledged and planted.",
    tech: ["Next.js", "Tailwind", "Sanity"],
    image: "/bali.webp",
    alt: "Verdura green culture website",
    bgColor: colors.projectBg.verdura,
    href: "#",
  },
  {
    number: "04",
    name: "Womarpools",
    tag: "Brand · Web",
    year: "2025",
    impactLabel: "Bookings lift",
    impactValue: "+3.4×",
    description:
      "Marketing site and lead pipeline for a luxury pool design studio — cinematic galleries, quote flow and a CMS the team actually wants to use.",
    tech: ["Next.js", "Tailwind", "Sanity"],
    image: "/hero-image.png",
    alt: "Womarpools luxury pool design website",
    bgColor: colors.projectBg.womarpools,
    href: "#",
  },
];

export const PROJECTS_COPY = {
  headlineLeft: "Selected",
  headlineRight: "works.",
  lede:
    "A few of the ones I'm proud of. I didn't build these alone — but on each one I played a crucial role and took the risky calls that kept the requirements landing on time. The kind of bets you only make when the deadline is real.",
} as const;
