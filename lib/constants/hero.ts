import { SITE } from "./site";

export const HERO_IMAGE = "/hero-gemini.png";

export const HERO_COPY = {
  tag: `${SITE.role} / ${SITE.location}`,
  headline: ["Obsession", "beats", "talent."] as const,
  ctaLabel: "Get in Touch",
  availability: SITE.availability,
  hexTag: "0x2f·7a · 4b · ff · 01 · 3c · ae →",
  scroll: "Scroll to explore",
} as const;

export const HERO_MARQUEE = [
  SITE.availability,
  "一期一会",
  SITE.locationShort,
  "努力は才能を超える",
  SITE.role,
  "武士道",
  "Obsession beats talent",
  "開発中",
  "Currently shipping",
  "不撓不屈",
  "Open to collaborations",
  "全力",
] as const;
