import { SITE } from "./site";

export const CONTACT_COPY = {
  headline: "Let's talk.",
  subtitle: "お話ししましょう",
  backToTop: "Back to top",
} as const;

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
