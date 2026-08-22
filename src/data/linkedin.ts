export type LinkedInItem = {
  id: string;
  title: string;
  tag: string;
  note: string;
  image: string;
  width: number;
  height: number;
};

export const linkedinSays = {
  title: "What my LinkedIn says",
  subtitle: "more than a highlight reel",
  items: [
    {
      id: "intro",
      title: "Intro",
      tag: "Web",
      note: "First impression, still sharp.",
      image: "/images/linkedin/intro.avif",
      width: 750,
      height: 485,
    },
    {
      id: "mockup-2",
      title: "Product",
      tag: "UI",
      note: "Interfaces with actual weight.",
      image: "/images/linkedin/mockup-2.avif",
      width: 750,
      height: 562,
    },
    {
      id: "responsive",
      title: "Responsive",
      tag: "Web Design",
      note: "One system. Every screen.",
      image: "/images/linkedin/mockup-responsive.avif",
      width: 750,
      height: 562,
    },
    {
      id: "mockup-1",
      title: "Screens",
      tag: "App",
      note: "Flows, not just frames.",
      image: "/images/linkedin/mockup-1.avif",
      width: 750,
      height: 562,
    },
    {
      id: "still-life",
      title: "Still life",
      tag: "Visual",
      note: "Quiet shots. Loud craft.",
      image: "/images/linkedin/still-life.avif",
      width: 750,
      height: 503,
    },
    {
      id: "intro-project",
      title: "Project",
      tag: "Case study",
      note: "The story after ship.",
      image: "/images/linkedin/intro-project.avif",
      width: 750,
      height: 439,
    },
  ] satisfies LinkedInItem[],
} as const;
