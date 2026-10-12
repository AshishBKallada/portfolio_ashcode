export const site = {
  name: "AshCode",
  loaderPhrase: "Veni, vidi, vici",
  role: "Developer",
  tagline: "I forge products that feel immortal, even when they're not.",
  email: "ashercode4u@gmail.com",
  location: "Remote",
  bio: "I'm a developer who treats code like craft — sharp, deliberate, and built to last. This site is a short index of selected work.",
  url: "https://ashcode.dev",
  intro: {
    bg: "#e63a26",
    poster: {
      lineOne: "Obsession",
      lineTwo: "beats",
      lineTwoItalic: "your",
      lineThree: "Talent.",
      credits: [
        { name: "AshCode", index: "00.", detail: "— Intro" },
        { name: "Developer", index: "01.", detail: "— Remote" },
      ],
      note: "Embarrassment rips talent\ninto craft.",
    },
    eyebrow: "Intro",
    number: "00",
    lineOneBefore: "Obsession beats",
    lineOneItalic: "talent.",
    lineTwo: "Embarrassment rips talent",
    lineThree: "into craft.",
    body: "This site is a short index of selected work — built by hand, shipped with weight, and judged by whether it still feels alive after the first impression fades.",
  },
  skills: {
    eyebrow: "Stack",
    // Each row scrolls across the band; odd rows run the opposite way.
    rows: [
      ["TYPESCRIPT", "JAVASCRIPT (ES2024)", "PYTHON", "SQL", "GO", "BASH", "HTML5", "CSS3"],
      ["REACT 19", "NEXT.JS", "NODE.JS", "EXPRESS", "TAILWIND CSS", "REST", "GRAPHQL", "tRPC"],
      ["POSTGRESQL", "MONGODB", "REDIS", "PRISMA", "DOCKER", "AWS", "VERCEL", "CI/CD"],
      ["THREE.JS", "R3F", "GSAP", "MOTION", "LENIS", "WEBGL", "GIT", "#FULL_STACK"],
    ],
    ring: "DIVINE RING OF MERITS · ",
  },
  about: {
    eyebrow: "About",
    headlineBefore: "Work that feels",
    headlineItalic: "carved",
    headlineAfter: ", not assembled.",
    image: "/images/about.jpg",
    overlay: "/images/about-overlay.png",
  },
  navbar: {
    bg: "#6b1414",
  },
  hero: {
    greeting: "Hello",
    name: "AshCode",
    figure: "/images/hero-angel.png",
    headlineLineOne: "I forge products",
    headlineLineTwoBefore: "that feel",
    headlineItalic: "immortal,",
    headlineLineTwoAfter: "",
    headlineLineThree: "even when they're not.",
    sublineBefore: "Currently building",
    sublineHighlightOne: "full-stack products",
    sublineMiddle: "and interfaces with",
    sublineHighlightTwo: "weight",
    note: "Obsession beats talent. Embarrassment rips talent into craft.",
    cta: { label: "Get in Touch", href: "/#contact" },
    /** Big two-line serif statement at the bottom left of the hero. */
    statementLineOne: "I forge products",
    statementLineTwoBefore: "that feel",
    /** Set in the cursive script face. */
    statementScript: "immortal",
    statementLineTwoAfter: ".",
    /** Bulleted tags beside the CTA. */
    tags: ["Full-stack", "Interfaces", "Motion"],
    role: "Full Stack Developer",
  },
  projects: {
    /** Cream still used by the resume page and the hidden contact poster. */
    bg: "#f7f5f2",
    meta: [
      "Built for shipping\nreal products.",
      "Build",
      "Responsibly",
      "Or don't.",
      "AshCode\nSelected work ©",
    ],
    lead: "Not here",
    wordOne: "To",
    wordTwo: "Follow",
    trail: "the hype.",
    figure: "/images/hero/hero-side.png",
    closing: "Who prefer weight\nover noise.",
    closingBody:
      "A short run of products built end to end, for people who would rather ship something that lasts than something that trends.",
  },
  /** Museum framing: every chapter is hung like a room in a gallery. */
  gallery: {
    heroCaption: ["Fig. I — Ascension", "Oil, chrome & TypeScript, 2026"],
    pantheon: {
      label: "The Pantheon",
      statue: "/images/hero-angel.png",
      statueAlt: "Marble archangel with gilded armbands and a spear, wings raised",
      placard: {
        no: "No. 02",
        title: "AshCode",
        lines: ["Full-stack developer", "Remote · India", "Active 2021 — present"],
        medium: "TypeScript, React, Node.js, PostgreSQL, motion",
      },
      tenets: [
        { numeral: "I", text: "Obsession beats talent." },
        { numeral: "II", text: "Embarrassment rips talent into craft." },
        { numeral: "III", text: "Weight over noise, every time." },
      ],
    },
    collection: {
      label: "The Collection",
      hint: "Scroll to walk the room →",
    },
    textMe: {
      label: "Text me",
      image: "/images/contact-text-me.png",
      imageAlt: "Halftone collage of a hand typing on a pink phone, with a torn note reading Text me",
    },
    colophon:
      "Set in Editorial New, General Sans, Anton & Pinyon Script. Built by hand with Next.js, GSAP and Motion.",
  },
  work: {
    eyebrow: "Work",
    headlineBefore: "Selected work shipped",
    headlineItalic: "end to end",
    headlineAfter: ", from first commit to production build.",
  },
  aboutPoster: {
    heading: "About me",
    caption: "Ashish B Kallada",
    intro:
      "My name is AshCode, I'm a full-stack developer building products remotely.",
    blocks: [
      {
        lead: "Ever since",
        text: "I shipped my first page I've cared about how things feel, not only how they work, from the first sketch to the last deploy.",
      },
      {
        lead: "I live to",
        text: "build things that stay standing and keep feeling alive long after launch.",
      },
    ],
  },
  contactStatement: {
    lines: ["Let's build", "something that", "feels"],
    script: "Immortal",
    sub: ["and ship work that performs", "because it was built by hand."],
    cta: "I'm ready when you are",
  },
  contactPoster: {
    lineOne: "Let's",
    lineTwoLead: "W",
    lineThree: "rk.",
    note: [
      "I build what others won't.",
      "Ship what others can't. ↩",
      "And reply within a day. 👀",
    ],
    image: "/images/contact-text-me.png",
    overlay: "AshCode.",
  },
  contact: {
    eyebrow: "Contact",
    headlineBefore: "Let's forge something that",
    headlineItalic: "lasts",
    body: "Open to freelance, full-time, and collaborations that deserve real craft.",
    image: "/images/contact-text-me.png",
    location: "Remote · India",
    timezone: "Asia/Kolkata",
    timezoneLabel: "IST",
    response: "Within 24 hours",
    coordinates: "12.97° N · 77.59° E",
    prompts: {
      email: "Write me a note",
      linkedin: "Say hello on",
      github: "Read my commits on",
    },
  },
  socials: [
    { label: "GitHub", href: "https://github.com/ashishbkallada" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ashishbkallada" },
  ],
  footer: {
    quoteBefore: "Yo twin, if da code bears the mark of ",
    quoteHighlightOne: "AshCode",
    quoteMiddle: ", its sm dop ",
    quoteHighlightTwo: "sh*t",
    quoteAfter: " (for real).",
    noteBefore: "Open to freelance, full-time, and collaborations. Reach me at",
    noteLink: "email",
    badge: "Independent developer",
    columns: [
      [
        { href: "/#work", label: "Work" },
        { href: "/#about", label: "About" },
        { href: "/#linkedin", label: "LinkedIn" },
        { href: "/#contact", label: "Contact" },
        {
          href: "https://github.com/ashishbkallada",
          label: "GitHub",
          external: true,
        },
      ],
    ],
  },
} as const;
