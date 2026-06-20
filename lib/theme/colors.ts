/** Single source of truth for raw color values. Change here to update site-wide. */
export const colors = {
  accent: "#ff1a1a",
  accentRgb: "255, 26, 26",

  loader: {
    bg: "#000000",
    text: "#E1E0CC",
  },

  terminal: {
    close: "#ff5f57",
    minimize: "#febc2e",
    maximize: "#28c840",
  },

  /** Hero text stays black in both themes */
  hero: {
    text: "#000000",
    textHover: "#ffffff",
    marqueeBg: "rgba(255,255,255,0.75)",
  },

  projectPreview: {
    kada: "#1f3bff",
    curengo: "#0f2a1e",
    verdura: "#1a3a22",
    womarpools: "#0a2540",
  },
} as const;
