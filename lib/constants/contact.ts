import { SITE } from "./site";

export const CONTACT_COPY = {
  metaSection: "(04)",
  metaLabel: "Contact · コンタクト",
  availability: SITE.availabilityShort,
  eyebrow: `Based in ${SITE.baseCity} — open to remote.`,
  headline: "Let's talk.",
  subtitle: "お話ししましょう",
  detailsLabel: {
    email: "Email",
    replyTime: "Reply time",
    base: "Base",
  },
  detailsValue: {
    replyTime: "within 48h",
    base: `${SITE.baseCity} · ${SITE.timezoneShort}`,
  },
  builtWith: "Next.js · GSAP · Caffeine",
  builtIn: "Built solo in Kerala",
  backToTop: "Back to top",
  signature: "ashcode",
} as const;

export const CONTACT_ACTIONS = [
  { label: "Start a project", href: `mailto:${SITE.email}?subject=Project%20inquiry` },
  { label: "Email", href: `mailto:${SITE.email}` },
  { label: "GitHub", href: "https://github.com/AshishBKallada" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Resume", href: SITE.resume },
] as const;

export const CONTACT_EMAILS = [
  {
    label: "work",
    jp: "仕事",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    label: "say hi",
    jp: "挨拶",
    value: SITE.emailPersonal,
    href: `mailto:${SITE.emailPersonal}`,
  },
] as const;

export const CONTACT_HEADLINE = "Let's talk.";

export const CONTACT_STATS = [
  { label: "Status", value: "Open · Q3 26" },
  { label: "Now", value: "Shipping Curengo" },
  { label: "Base", value: SITE.baseCity },
] as const;
