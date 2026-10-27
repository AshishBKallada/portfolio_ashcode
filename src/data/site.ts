// Site-wide copy and links. Colours: src/theme/tokens.css (+ theme/colors.ts).
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
    /** Hero headline — eyebrow + main word + subline (SkyHero). */
    statementEyebrow: "Full stack",
    statementMain: "developer",
    statementLineTwoPrefix: "Building web products",
    statementAccent: "end to end.",
    statementLineTwo: "Building web products end to end.",
    statementLineOne: "Full-stack developer",
    /** Bulleted tags beside the CTA. */
    tags: ["TypeScript", "React & Next.js", "APIs & infra"],
    /** Underlined link under the statement, top left. */
    link: { label: "Start a project", href: "/#contact" },
    /** Bordered card, bottom right: a globe cell and a claim cell. */
    card: { place: "Remote", claim: "Full-stack, from interface to infrastructure." },
    blurb: "Products, interfaces and motion work, built end to end and made to last.",
    /** Two-line hint, bottom centre (pointer devices only). */
    hint: ["Move to stir the cloud", "Scroll to meet the work"],
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
  /** About panel — editorial headline, kicker, and floating prompt cards. */
  aboutEdition: {
    dropCap: "W",
    headline: "ork that feels carved, not assembled.",
    kicker: "Full-stack development",
    body: "I'm Ashish, a full-stack developer building products remotely. I care about how things feel, not only how they work, and I build them to stay standing long after launch.",
    cta: { label: "Read the résumé", href: "/resume" },
    cards: [
      { text: "Design an interface that still reads well a year after launch.", featured: false },
      {
        text: "Ship typed APIs, tested deploys, and motion that respects reduced-motion.",
        featured: true,
      },
      { text: "Own the line from first sketch to last production deploy.", featured: false },
      { text: "Keep one point of contact across design, code, and infra.", featured: false },
    ],
  },
  aboutPoster: {
    heading: "About me",
    /** Cut-out from the shared reference (chair figure), on the red poster. */
    photo: "/images/about-chair-cutout.png",
    photoWidth: 661,
    photoHeight: 711,
    /** Small avatar elsewhere on the site (not the poster cutout). */
    avatar: "/images/about-figure.png",
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
  /** Signal-red redesign: the home page sections, top to bottom. */
  signal: {
    fullName: "Ashish B Kallada",
    availability: "Open to new work",
    meta: ["Developer", "Full-stack", "Remote"],
    approach: {
      columns: [
        "I work across interfaces, APIs and the infrastructure behind them. Typed end to end, tested where it matters, and shipped in small, steady steps.",
        "A studio of one, with a direct line from the first sketch to the last deploy.",
      ],
    },
    toolkit: ["Languages", "Frameworks", "Data & infra", "Motion & 3D"],
    notes: {
      quote: "I'd rather ship one thing that lasts than ten that trend.",
      stats: [
        { value: "03", label: "Products shipped end to end, interface to infrastructure." },
        { value: "04", label: "Stacks covered, from interface to infrastructure." },
        { value: "01", label: "Point of contact, from the first sketch to the last deploy." },
        { value: "Craft", label: "Code that still reads well a year after launch." },
      ],
    },
    contact: "Products, interfaces and motion work. Remote, across time zones.",
    linkedin: {
      cta: "Follow on LinkedIn",
      /** Panels in the liquid-glass carousel, in order. */
      posts: [
        { title: "Shipping the new intro", src: "/images/linkedin/intro.avif" },
        { title: "Designing for every screen", src: "/images/linkedin/mockup-responsive.avif" },
        { title: "A dashboard that stays calm", src: "/images/linkedin/mockup.avif" },
        { title: "From sketch to laptop", src: "/images/linkedin/mockup-laptop.avif" },
        { title: "Details that last", src: "/images/linkedin/mockup-2.avif" },
      ],
    },
  },
  /** Corner record player: the track lives in public/audio (a YouTube URL also works). */
  music: {
    src: "/audio/edamame.mp3",
    coverArt: "/images/hero/hero-figure-winged-courier.png",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/ashishbkallada" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ashishbkallada" },
  ],
} as const;
