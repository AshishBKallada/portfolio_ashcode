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
  hero: {
    /** The hero statement for screen readers (SkyHero). */
    statementMain: "developer",
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
        { title: "Time is running out", src: "/images/linkedin/posts/post-01.jpg" },
        { title: "A jewellery app, in the making", src: "/images/linkedin/posts/post-02.jpg" },
        { title: "Discipline", src: "/images/linkedin/posts/post-03.jpg" },
        { title: "SQL injection", src: "/images/linkedin/posts/post-04.jpg" },
        { title: "Why PWAs", src: "/images/linkedin/posts/post-05.jpg" },
        { title: "On stage", src: "/images/linkedin/posts/post-06.jpg" },
        { title: "A plan builder, step by step", src: "/images/linkedin/posts/post-07.jpg" },
        { title: "Heads down", src: "/images/linkedin/posts/post-08.jpg" },
      ],
      /** Real comments left under the posts above (KindWords, in the Index), word for word. */
      kindWords: {
        heading: "Kind words",
        lede: "What people leave under the posts.",
        items: [
          { text: "Nice one, Ashish! Keep the tips coming! ⚡️", name: "Jishad Ali", via: "comment" },
          {
            text: "Welcome to BeyondScale Ashish B Kallada! Looking forward to working with you.",
            name: "Shashank Punuru",
            via: "comment",
          },
          { text: "Great advice Ashish B Kallada", name: "Justin Ram", via: "comment" },
          { text: "Thanks for sharing mahn!!!", name: "KRISHNADAS N", via: "comment" },
          { text: "You should Thank your Relatives for the motivation...🙃", name: "Anurag Band", via: "comment" },
          { text: "Don't lose focus bro", name: "Dinil Krishna A S", via: "comment" },
          { text: "Inspiring 👏", name: "Anandu R Nair", via: "comment" },
          { text: "Very informative", name: "Najil Parakkal", via: "comment" },
          { text: "Interesting 🤝", name: "Kiran Biju P", via: "comment" },
        ],
      },
    },
  },
  /** Corner record player: the track lives in public/audio (a YouTube URL also works). */
  music: {
    src: "/audio/edamame.mp3",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/ashishbkallada" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ashish-b-kallada" },
  ],
} as const;
