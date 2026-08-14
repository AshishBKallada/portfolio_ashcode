export type Project = {
  slug: string;
  title: string;
  year: number;
  summary: string;
  description: string;
  tags: string[];
  image: string;
  imageWidth: number;
  imageHeight: number;
  liveUrl?: string;
  githubUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "atlas",
    title: "Atlas",
    year: 2026,
    summary: "A lightweight internal dashboard for tracking product usage.",
    description:
      "Atlas is a sample product dashboard built around a small set of metrics: active users, conversion, and retention. The goal was a calm interface that makes weekly reviews faster, not a wall of charts. This page is placeholder copy — swap it with a real case study when you are ready.",
    tags: ["Next.js", "TypeScript", "Product"],
    image: "/images/linkedin/mockup.avif",
    imageWidth: 750,
    imageHeight: 562,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/ashishbkallada",
  },
  {
    slug: "northwind",
    title: "Northwind",
    year: 2025,
    summary: "A marketing site for a fictional climate data studio.",
    description:
      "Northwind is a sample marketing site with a long-form landing page, project index, and a simple contact flow. It was designed to feel editorial: large type, lots of space, and almost no chrome. Replace this write-up with the real story, screenshots, and outcomes.",
    tags: ["Design", "Next.js", "Content"],
    image: "/images/linkedin/mockup-responsive.avif",
    imageWidth: 750,
    imageHeight: 562,
    liveUrl: "https://example.com",
  },
  {
    slug: "pulse",
    title: "Pulse",
    year: 2025,
    summary: "A mobile-first habit tracker with a quiet daily review.",
    description:
      "Pulse is a sample habit app focused on one question a day instead of streaks and badges. The interface stays out of the way so the review itself feels like the product. Use this page as a template for app case studies: problem, approach, and what shipped.",
    tags: ["Product", "React Native"],
    image: "/images/linkedin/mockup-laptop.avif",
    imageWidth: 750,
    imageHeight: 563,
    githubUrl: "https://github.com/ashishbkallada",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
