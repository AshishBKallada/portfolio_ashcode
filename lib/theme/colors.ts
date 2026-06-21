// Single source of truth for raw hex colors used in JS/inline styles.
// Tailwind tokens (paper, ink, surface) live in tailwind.config.ts + globals.css —
// those handle light/dark theming. This file is for values that can't ride on
// CSS variables: SVG fills, canvas/WebGL inputs, inline gradients, etc.

export const colors = {
  // Brand accent — used for the splash cursor, status pings, hairlines, and
  // the play-ring glow on the floating audio button.
  accent: "#ff1a1a",
  accentRgb: "255, 26, 26",

  // Loader keeps a fixed palette regardless of theme — it runs before the
  // theme resolves.
  loader: {
    bg: "#000000",
    fg: "#E1E0CC",
  },

  // Cream tone shown briefly as a brand swatch. Mirrors --ink in dark mode.
  primary: "#DEDBC8",

  // macOS-style window controls in the Statement terminal frame.
  macTraffic: {
    close: "#ff5f57",
    minimize: "#febc2e",
    maximize: "#28c840",
  },

  // Per-project preview backdrops — shown behind the cursor thumbnail.
  projectBg: {
    kada: "#1f3bff",
    curengo: "#0f2a1e",
    verdura: "#1a3a22",
    womarpools: "#0a2540",
  },
} as const;

export type Colors = typeof colors;
