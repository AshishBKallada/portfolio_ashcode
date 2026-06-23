import { SITE } from "./site";

export const INTRO_COPY = {
  headlineLeft: "Hi, I'm",
  headlineRight: `${SITE.fullName.split(" ")[0]}.`,
  lead:
    `A ${SITE.role.toLowerCase()} building production web apps — React and Next.js on the front, Node and Express behind the API, and the databases that hold it all together. From government platforms to health-tech and founder-led products.`,
  body:
    "I take projects from rough idea to shipped software — scoping with stakeholders, designing interfaces that stay out of the way, and writing code that teams can maintain after launch. Small teams, tight deadlines, real users.",
  experience:
    "Previously, I've shipped for the Kuppam Area Development Authority (Andhra Pradesh), built hospital ops at Curengo, and delivered brand and product sites for Verdura and Womarpools — experience across government scale, regulated health-tech, and fast-moving founder work.",
  cta: "Let's talk",
  skillsCta: "View stack",
} as const;
