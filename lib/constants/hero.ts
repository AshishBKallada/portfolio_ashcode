import { SITE } from "./site";

export const HERO_IMAGE = "/hero-gemini.png";

export const HERO_COPY = {
  headline: ["Obsession beats", "talent."] as const,
  note:
    "Full-stack engineer shipping React, Node, and TypeScript — from interfaces to databases, for founders and teams who need it live.",
  ctaLabel: "Start experience",
  availability: SITE.availability,
  scroll: "Scroll down",
} as const;

export const HERO_MARQUEE = [
  SITE.availability,
  "一期一会",
  SITE.locationShort,
  SITE.role,
  "Currently shipping",
  "Open to collaborations",
] as const;
