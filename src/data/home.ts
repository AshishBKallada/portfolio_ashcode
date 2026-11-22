// Copy and pictures for the home page sections (components/signal/home).
import { site } from "./site";

/**
 * About: the four ways of working, each hung beside one of the marble pieces from the old
 * heroes, passing under the pinned title like exhibits along the corridor.
 */
export const aboutExhibits = [
  {
    src: "/images/hero/hero-figure-marble.webp",
    title: "Interfaces that last",
    role: "Design and front end",
    text: site.aboutEdition.cards[0].text,
  },
  {
    src: "/images/gallery/laptop-angel.webp",
    title: "Typed, tested, shipped",
    role: "APIs and deploys",
    text: site.aboutEdition.cards[1].text,
  },
  {
    src: "/images/gallery/courier-marble.webp",
    title: "Sketch to production",
    role: "End to end",
    text: site.aboutEdition.cards[2].text,
  },
  {
    src: "/images/gallery/flight-marble.webp",
    title: "One line of contact",
    role: "Design, code and infra",
    text: site.aboutEdition.cards[3].text,
  },
] as const;

export const aboutTitle = ["Carved, not", "assembled"] as const;

/** LinkedIn: three posts rise as a triptych, the middle one largest. */
export const linkedinSection = {
  title: ["Notes from the build,", "posted on LinkedIn"],
  lede: "Short posts on shipping, security and the discipline behind the work.",
  href: site.socials.find((s) => s.label === "LinkedIn")?.href ?? "https://www.linkedin.com",
  cta: site.signal.linkedin.cta,
  /** Left, centre, right. */
  posts: [
    { src: "/images/gallery/post-04.webp", alt: "LinkedIn post: SQL injection" },
    { src: "/images/gallery/post-01.webp", alt: "LinkedIn post: Time is running out" },
    { src: "/images/gallery/post-03.webp", alt: "LinkedIn post: Discipline" },
  ],
} as const;

/** Contact: a type-led close beside the stair, cropped to its narrow window like a doorway. */
export const contact = {
  title: ["Let's build something", "that lasts"],
  lede: `${site.signal.contact} Tell me about the idea.`,
  photo: {
    src: "/images/contact/white-stair-door.webp",
    width: 480,
    height: 1100,
    alt: "A white staircase seen through a narrow opening in a white wall",
    credit: "Photo: Todd Quackenbush, Unsplash",
  },
  details: [
    { label: "Work", value: "Products, interfaces, motion" },
    { label: "Where", value: "Remote, any time zone" },
    { label: "Status", value: site.signal.availability },
  ],
  action: {
    label: "Start a project",
    href: `mailto:${site.email}?subject=${encodeURIComponent("A project for AshCode")}`,
  },
} as const;

export const footerLinks = [
  { label: "Work", href: "/#index" },
  { label: "Résumé", href: "/resume" },
  ...site.socials,
] as const;
