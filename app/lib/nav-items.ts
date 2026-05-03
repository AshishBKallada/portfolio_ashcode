export const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "Footer", id: "footer" },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]["id"];
