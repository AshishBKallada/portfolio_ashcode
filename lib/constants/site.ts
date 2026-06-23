// Identity + presence info that shows up across the site.
// Update the email / availability here and every section picks it up.

export const SITE = {
  brand: "Ashcode",
  brandJp: "アッシュコード",
  fullName: "Ashish B Kallada",
  role: "Full-stack engineer",
  locationShort: "Kerala · IST",
  email: "ashercode4u@gmail.com",
  emailPersonal: "ashishbkallada@gmail.com",
  resume: "/ashishbkalladaresume.pdf",
  copyrightYear: 2026,
} as const;

export const SOCIAL_LINKS = [
  {
    label: "Github",
    handle: "@AshishBKallada",
    href: "https://github.com/AshishBKallada",
  },
  {
    label: "LinkedIn",
    handle: "in/ashishbkallada",
    href: "https://www.linkedin.com",
  },
  {
    label: "Resume",
    handle: "PDF · 02 pages",
    href: SITE.resume,
    newTab: true,
  },
] as const;

export const NAV_ITEMS = [
  { label: "Works", target: "projects" },
  { label: "About", target: "statement" },
  { label: "Contact", target: "contact" },
] as const;
