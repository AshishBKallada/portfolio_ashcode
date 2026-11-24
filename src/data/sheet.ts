// Copy for the sheet portfolio: one page laid out like a printed portfolio on a dark desk.
// Photographs are Ashish's own LinkedIn posts (public/images/linkedin/posts).
import { site } from "./site";

const linkedinHref = site.socials.find((s) => s.label === "LinkedIn")?.href ?? "https://www.linkedin.com";
const githubHref = site.socials.find((s) => s.label === "GitHub")?.href ?? "https://github.com";

export const sheet = {
  name: "Ashish",
  full: site.signal.fullName,
  wordmark: site.name,
  role: "Full-stack Developer",
  // Inferred from the IST clock: confirm before launch.
  place: "Kerala — Global",
  email: site.email,
  www: site.url.replace(/^https?:\/\//, ""),
  spine: "AshCode building products that last",
  action: {
    label: "Start a project",
    href: `mailto:${site.email}?subject=${encodeURIComponent("A project for AshCode")}`,
  },
  contact: [
    { label: "Email:", value: site.email, href: `mailto:${site.email}` },
    { label: "Based:", value: "Kerala, India · IST" },
    { label: "Status:", value: site.signal.availability },
    { gap: true },
    { label: "LinkedIn:", value: "Ashish B Kallada", href: linkedinHref },
    { label: "GitHub:", value: "@ashishbkallada", href: githubHref },
    { gap: true },
    { label: "www.", value: site.url.replace(/^https?:\/\//, ""), href: site.url },
  ],
  cover: {
    src: "/images/linkedin/posts/post-08.jpg",
    alt: "Ashish at a laptop in an open office, chin on hand",
  },
  note: "Process: interface, API, database and deploy, owned end to end. Impact: products that still read well a year after launch.",
  reel: [
    { src: "/images/linkedin/posts/post-04.jpg", title: "SQL injection" },
    { src: "/images/linkedin/posts/post-02.jpg", title: "A jewellery app, in the making" },
    { src: "/images/linkedin/posts/post-03.jpg", title: "Discipline" },
    { src: "/images/linkedin/posts/post-05.jpg", title: "Why PWAs" },
    { src: "/images/linkedin/posts/post-07.jpg", title: "A plan builder, step by step" },
    { src: "/images/linkedin/posts/post-01.jpg", title: "Time is running out" },
  ],
  about: {
    statement: site.aboutEdition.body,
    photo: {
      src: "/images/linkedin/posts/post-06.jpg",
      alt: "Ashish speaking into a microphone in front of a seated audience",
    },
    ways: [
      { title: "Interfaces that last", text: site.aboutEdition.cards[0].text },
      { title: "Typed, tested, shipped", text: site.aboutEdition.cards[1].text },
      { title: "Sketch to production", text: site.aboutEdition.cards[2].text },
      { title: "One line of contact", text: site.aboutEdition.cards[3].text },
    ],
    toolkit: site.signal.toolkit.map((label, i) => ({
      label,
      items: site.skills.rows[i].filter((s) => !s.startsWith("#")),
    })),
  },
  linkedin: {
    href: linkedinHref,
    cta: site.signal.linkedin.cta,
    lede: "Short posts on shipping, security and the discipline behind the work.",
    posts: site.signal.linkedin.posts,
    words: site.signal.linkedin.kindWords.items.filter((w) => !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(w.text)),
  },
  colophon: [
    ["Developer", "Portfolio"],
    ["AshCode", "Collection"],
    ["Edition", "2026"],
    ["Of", "Work"],
    ["Made with", "Next.js"],
    ["For the", "Web"],
    ["By", "AshCode"],
  ],
} as const;
