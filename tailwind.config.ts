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
        headline: ["var(--font-instrument-serif)", "Georgia", "serif"],
        almarai: ["var(--font-almarai)", "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "var(--font-instrument-serif)", "serif"],
      },
      colors: {
        primary: "#DEDBC8",
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "grain": "grain 8s steps(10) infinite",
        "marquee": "marquee 28s linear infinite",
        "text-glow": "text-glow 5.5s ease-in-out infinite",
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
          "0%, 100%": {
            opacity: "0.9",
            textShadow:
              "0 0 12px rgba(255,26,26,0.4), 0 0 40px rgba(255,26,26,0.22), 0 0 90px rgba(255,26,26,0.14)",
          },
          "50%": {
            opacity: "1",
            textShadow:
              "0 0 26px rgba(255,26,26,0.8), 0 0 80px rgba(255,26,26,0.55), 0 0 160px rgba(255,26,26,0.38)",
          },
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
