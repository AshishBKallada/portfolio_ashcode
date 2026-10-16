// Site-wide copy and links. Brand colours live in globals.css (@theme).
export const site = {
  name: "AshCode",
  role: "Developer",
  tagline: "I forge products that feel immortal, even when they're not.",
  email: "ashercode4u@gmail.com",
  location: "Remote",
  bio: "I'm a developer who treats code like craft — sharp, deliberate, and built to last. This site is a short index of selected work.",
  url: "https://ashcode.dev",
  skills: {
    rows: [
      ["TYPESCRIPT", "JAVASCRIPT (ES2024)", "PYTHON", "SQL", "GO", "BASH", "HTML5", "CSS3"],
      ["REACT 19", "NEXT.JS", "NODE.JS", "EXPRESS", "TAILWIND CSS", "REST", "GRAPHQL", "tRPC"],
      ["POSTGRESQL", "MONGODB", "REDIS", "PRISMA", "DOCKER", "AWS", "VERCEL", "CI/CD"],
      ["THREE.JS", "R3F", "GSAP", "MOTION", "LENIS", "WEBGL", "GIT", "#FULL_STACK"],
    ],
  },
  about: {
    headlineBefore: "Work that feels",
    headlineItalic: "carved",
    headlineAfter: ", not assembled.",
    gallery: [
      "/images/linkedin/intro.avif",
      "/images/linkedin/mockup-2.avif",
      "/images/linkedin/mockup-responsive.avif",
    ],
  },
  hero: {
    cta: { label: "Get in Touch", href: "/#contact" },
    /** Big two-line serif statement at the bottom left of the hero. */
    statementLineOne: "I forge products",
    statementLineTwoBefore: "that feel",
    /** Set in the cursive script face. */
    statementScript: "immortal",
    statementLineTwoAfter: ".",
    /** Bulleted tags beside the CTA. */
    tags: ["Full-stack", "Interfaces", "Motion"],
  },
  projects: {
    lead: "Not here",
    wordOne: "To",
    wordTwo: "Follow",
    trail: "the hype.",
    closing: "Who prefer weight\nover noise.",
    closingBody:
      "A short run of products built end to end, for people who would rather ship something that lasts than something that trends.",
  },
  aboutPoster: {
    heading: "About me",
    /** Cut-out portrait standing in front of the heading. */
    photo: "/images/about-figure.png",
    /** Signature set in the script face across the portrait. */
    signature: "Ashish B Kallada",
    bio: "I'm Ashish, a full-stack developer building products remotely. I care about how things feel, not only how they work, and I build them to stay standing long after launch.",
  },
  contactStatement: {
    lines: ["Let's build", "something that", "feels"],
    script: "Immortal",
    sub: ["and ship work that performs", "because it was built by hand."],
    cta: "I'm ready when you are",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/ashishbkallada" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ashishbkallada" },
  ],
} as const;
