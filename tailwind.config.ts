import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        main: ["var(--font-mitshuka)", "cursive", "system-ui", "sans-serif"],
        headline: ["var(--font-instrument-serif)", "Georgia", "serif"],
        serif: ['"Instrument Serif"', "var(--font-instrument-serif)", "serif"],
      },
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};

export default config;
