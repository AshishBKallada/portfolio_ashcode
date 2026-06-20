export const BRAND = {
  name: "Ashcode",
  nameJp: "アッシュコード",
  watermark: "ashcode",
  initial: "A",
} as const;

export const PRIMARY_EMAIL = "ashercode4u@gmail.com";

export const LOCATION = {
  label: "Kerala",
  timezone: "IST",
  base: "Kochi, IN",
  heroTag: "Full-stack engineer / Kerala, India",
} as const;

export const AVAILABILITY = {
  status: "Available · Q3 2026",
  statusShort: "Available Q3 26",
  statsLabel: "Open · Q3 26",
} as const;

export const NAV_ITEMS = [
  { label: "Works", target: "projects" },
  { label: "About", target: "statement" },
  { label: "Contact", target: "contact" },
] as const;

export const SECTION_INDEX = {
  projects: "03",
  contact: "04",
} as const;

export const CONTACT_STATS = [
  { label: "Status", value: AVAILABILITY.statsLabel },
  { label: "Now", value: "Shipping Curengo" },
  { label: "Base", value: LOCATION.base },
] as const;

export const SOCIAL_LINKS = [
  { label: "Github", handle: "@AshishBKallada", href: "https://github.com/AshishBKallada" },
  { label: "LinkedIn", handle: "in/ashishbkallada", href: "https://www.linkedin.com" },
  { label: "Resume", handle: "PDF · 02 pages", href: "/ashishbkalladaresume.pdf" },
] as const;
