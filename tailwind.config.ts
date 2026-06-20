import type { Config } from "tailwindcss";
import { colors } from "./lib/theme/colors";

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
        headline: ["var(--font-instrument-serif)", "Georgia", "serif"],
        almarai: ["var(--font-almarai)", "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "var(--font-instrument-serif)", "serif"],
      },
      colors: {
        primary: "#DEDBC8",
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        accent: {
          DEFAULT: colors.accent,
          rgb: colors.accentRgb,
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "grain": "grain 8s steps(10) infinite",
        "marquee": "marquee 28s linear infinite",
        "text-glow": "text-glow 5.5s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
        "point-left": "point-left 1.2s ease-in-out infinite",
        "float-y": "float-y 2.6s ease-in-out infinite",
      },
      keyframes: {
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 0 currentColor)" },
          "50%": { opacity: "0.7", filter: "drop-shadow(0 0 8px currentColor)" },
        },
        "text-glow": {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
        "point-left": {
          "0%, 100%": { transform: "rotate(-90deg) translateX(0)" },
          "50%": { transform: "rotate(-90deg) translateX(-8px)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "grain": {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-5%,-10%)" },
          "20%": { transform: "translate(-15%,5%)" },
          "30%": { transform: "translate(7%,-25%)" },
          "40%": { transform: "translate(-5%,25%)" },
          "50%": { transform: "translate(-15%,10%)" },
          "60%": { transform: "translate(15%,0%)" },
          "70%": { transform: "translate(0%,15%)" },
          "80%": { transform: "translate(3%,35%)" },
          "90%": { transform: "translate(-10%,10%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
