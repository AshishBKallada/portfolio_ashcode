export type LinkedInItem = {
  id: string;
  title: string;
  tag: string;
  image: string;
  width: number;
  height: number;
};

export const linkedinSays = {
  headlineBefore: "What my",
  headlineItalic: "LinkedIn",
  headlineAfter: "says.",
  items: [
    {
      id: "intro",
      title: "Intro",
      tag: "Web",
      image: "/images/linkedin/intro.avif",
      width: 750,
      height: 485,
    },
    {
      id: "mockup-2",
      title: "Product",
      tag: "UI",
      image: "/images/linkedin/mockup-2.avif",
      width: 750,
      height: 562,
    },
    {
      id: "responsive",
      title: "Responsive",
      tag: "Web Design",
      image: "/images/linkedin/mockup-responsive.avif",
      width: 750,
      height: 562,
    },
    {
      id: "mockup-1",
      title: "Screens",
      tag: "App",
      image: "/images/linkedin/mockup-1.avif",
      width: 750,
      height: 562,
    },
    {
      id: "still-life",
      title: "Still life",
      tag: "Visual",
      image: "/images/linkedin/still-life.avif",
      width: 750,
      height: 503,
    },
    {
      id: "intro-project",
      title: "Project",
      tag: "Case study",
      image: "/images/linkedin/intro-project.avif",
      width: 750,
      height: 439,
    },
    {
      id: "mockup",
      title: "Desktop",
      tag: "Product",
      image: "/images/linkedin/mockup.avif",
      width: 750,
      height: 562,
    },
    {
      id: "laptop",
      title: "Laptop",
      tag: "Mockup",
      image: "/images/linkedin/mockup-laptop.avif",
      width: 750,
      height: 563,
    },
  ] satisfies LinkedInItem[],
} as const;
