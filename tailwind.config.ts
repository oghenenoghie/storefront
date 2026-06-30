import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#0A0A0A",
        white: "#FFFFFF",
        cream: "#F7F4F0",
        sand: "#E8E0D5",
        gold: "#C9A96E",
        "gold-light": "#E0C896",
        charcoal: "#2C2C2C",
        muted: "#8A8A8A",
        border: "#E2DDD8",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jost)", "Helvetica Neue", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        display: ["clamp(3rem, 6vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        hero: ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        widest: "0.25em",
        wider: "0.15em",
        wide: "0.08em",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease forwards",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};

export default config;
