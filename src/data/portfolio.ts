// Copy and pictures for the kinetic home page (components/kinetic), top to bottom.
// Hero, about, LinkedIn, contact, footer. Photographs of Ashish are his own LinkedIn posts;
// the river and bridge are openly licensed (public/images/kinetic/credits.json).
import { site } from "./site";

export const person = {
  first: "Ashish",
  middle: "B",
  last: "Kallada",
  full: site.signal.fullName,
  wordmark: site.name,
  role: "Full-stack developer",
  // Inferred from the IST clock and the Kallada river the surname shares: confirm before launch.
  place: "Kerala, India",
  timeZone: "Asia/Kolkata",
  status: site.signal.availability,
  email: site.email,
} as const;

export const hero = {
  sentence:
    "I build web products end to end, from the first sketch to the last deploy, and I build them to last.",
  photo: {
    src: "/images/kinetic/river-puthoor.jpg",
    alt: "The Kallada river at Puthoor at dusk, trees dark against a pale sky",
    caption: "The Kallada at Puthoor",
  },
  action: {
    label: "Start a project",
    href: `mailto:${site.email}?subject=${encodeURIComponent("A project for AshCode")}`,
  },
} as const;

/** About: the name pinned as two words while four photographs of the work pass beneath. */
export const about = {
  heading: ["Ash", "Code"],
  portraits: [
    {
      src: "/images/linkedin/posts/post-08.jpg",
      alt: "Ashish at a laptop in an open office, chin on hand",
      position: "50% 40%",
      title: "Interfaces that last",
      role: "Design and front end",
      text: site.aboutEdition.cards[0].text,
    },
    {
      src: "/images/linkedin/posts/post-02.jpg",
      alt: "Ashish at his desk building a jewellery shopping app",
      position: "38% 50%",
      title: "Typed, tested, shipped",
      role: "APIs and deploys",
      text: site.aboutEdition.cards[1].text,
    },
    {
      src: "/images/linkedin/posts/post-03.jpg",
      alt: "Ashish rolling up a sleeve against a wall lettered Discipline",
      position: "55% 35%",
      title: "Sketch to production",
      role: "End to end",
      text: site.aboutEdition.cards[2].text,
    },
    {
      src: "/images/linkedin/posts/post-06.jpg",
      alt: "Ashish speaking into a microphone in front of a seated audience",
      position: "54% 30%",
      title: "One line of contact",
      role: "Design, code and infra",
      text: site.aboutEdition.cards[3].text,
    },
  ],
  statement: site.aboutEdition.body,
  toolkit: site.signal.toolkit.map((label, i) => ({
    label,
    items: site.skills.rows[i].filter((s) => !s.startsWith("#")),
  })),
} as const;

/** LinkedIn: a pinned stage; each step brings one post and one comment left under the posts. */
export const linkedin = {
  heading: "LinkedIn",
  lede: "Short posts on shipping, security and the discipline behind the work.",
  href: site.socials.find((s) => s.label === "LinkedIn")?.href ?? "https://www.linkedin.com",
  cta: site.signal.linkedin.cta,
  steps: [
    {
      src: "/images/linkedin/posts/post-04.jpg",
      title: "SQL injection",
      alt: "LinkedIn post: Ashish at a laptop under terminal output, titled SQL injection",
      quote: "Very informative",
      name: "Najil Parakkal",
      ground: "#f4f4f1",
    },
    {
      src: "/images/linkedin/posts/post-05.jpg",
      title: "Why PWAs",
      alt: "LinkedIn post: Ashish checking his phone beside a PWA sign",
      quote: "Great advice Ashish B Kallada",
      name: "Justin Ram",
      ground: "#e8eee9",
    },
    {
      src: "/images/linkedin/posts/post-01.jpg",
      title: "Time is running out",
      alt: "LinkedIn post: two developers talking at laptops under a clock reading Time is running out",
      quote: "Don't lose focus bro",
      name: "Dinil Krishna A S",
      ground: "#eeede8",
    },
    {
      src: "/images/linkedin/posts/post-07.jpg",
      title: "A plan builder, step by step",
      alt: "LinkedIn post: a four-step plan builder form, on the Add plan step",
      fit: "contain",
      quote: "Thanks for sharing mahn!!!",
      name: "KRISHNADAS N",
      ground: "#e4ebe7",
    },
  ],
} as const;

/** Contact: a visit card over the river; its hours are shown in the visitor's own time. */
export const contact = {
  heading: "Let's talk",
  photo: {
    src: "/images/kinetic/river-punalur.jpg",
    alt: "The Kallada river at Punalur, green banks and palms reflected in still water",
  },
  // Sample working hours in IST: confirm before launch.
  hours: [
    { days: "Mon to Fri", from: 10, to: 19 },
    { days: "Saturday", from: 10, to: 14 },
  ],
  closed: "Sunday",
  action: hero.action,
} as const;

export const footer = {
  photo: {
    src: "/images/kinetic/bridge-punalur.jpg",
    alt: "The stone tower and iron chains of the Punalur suspension bridge over the Kallada",
    caption: "Punalur suspension bridge over the Kallada, 1877. Still standing.",
  },
  menu: [
    { label: "About", href: "#about" },
    { label: "LinkedIn", href: "#linkedin" },
    { label: "Contact", href: "#contact" },
    { label: "GitHub", href: site.socials[0].href },
    { label: "Email", href: `mailto:${site.email}` },
  ],
  socials: site.socials,
  credits: [
    { text: "Kallada River at Puthoor by Akhilan, CC BY-SA 4.0", href: "https://commons.wikimedia.org/w/index.php?curid=58275475" },
    { text: "Punalur kallada river by Sprouter13, CC BY-SA 4.0", href: "https://commons.wikimedia.org/w/index.php?curid=57838353" },
    { text: "Suspension Bridge, Punalur by Jpaudit, CC BY-SA 3.0", href: "https://commons.wikimedia.org/w/index.php?curid=17390424" },
  ],
} as const;
