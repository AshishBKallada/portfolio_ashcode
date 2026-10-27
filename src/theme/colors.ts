/**
 * Theme values for JS (canvas, OG images, inline styles).
 * Keep in sync with `theme/tokens.css`.
 */
export const theme = {
  page: {
    bg: "#ddddd1",
    /** The page with the navbar switch on white. */
    bgWhite: "#ffffff",
    fg: "#1a0505",
    fgMuted: "rgba(26, 5, 5, 0.8)",
    fgSubtle: "rgba(26, 5, 5, 0.6)",
    border: "rgba(26, 5, 5, 0.16)",
  },
  brand: {
    DEFAULT: "#ec4726",
    on: "#ffffff",
  },
  ink: "#1a0505",
  cream: "#f4f1ea",
  bone: "#f4f1ea",
  panel: "#220707",
  oxblood: "#6b1414",
  flame: "#ec4726",
  gold: "#d4a94e",
  paper: "#f7f5f2",
  about: {
    bg: "#ddddd1",
    fg: "#1a0505",
    muted: "rgba(26, 5, 5, 0.8)",
    accent: "#ec4726",
  },
} as const;
