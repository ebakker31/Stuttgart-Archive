import type { Config } from "tailwindcss";

/**
 * Stuttgart Archive — brand design tokens.
 * Archival, museum-grade, German-precision. Independent of any official
 * Porsche visual system. Warm parchment light mode + deep graphite dark mode,
 * silver dividers, and a single restrained oxblood/muted-red accent.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1240px" },
    },
    extend: {
      colors: {
        // Surfaces driven by CSS variables (see globals.css) for light/dark.
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        // Brand constants
        parchment: {
          DEFAULT: "#F4F1EA",
          deep: "#EAE5D8",
          card: "#FBF9F4",
        },
        graphite: {
          DEFAULT: "#26292D",
          deep: "#191B1E",
          soft: "#33373C",
        },
        silver: {
          DEFAULT: "#C9CCD1",
          deep: "#A7ABB2",
          line: "#D8D4C8",
        },
        oxblood: {
          DEFAULT: "#8C2B2B",
          deep: "#6E2020",
          soft: "#A8453F",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Newsreader", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        label: "0.18em",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        archive: "0 1px 2px rgba(25,27,30,0.04), 0 8px 24px -12px rgba(25,27,30,0.18)",
        "archive-lg": "0 2px 4px rgba(25,27,30,0.05), 0 24px 48px -20px rgba(25,27,30,0.28)",
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(circle at 1px 1px, rgba(25,27,30,0.035) 1px, transparent 0)",
      },
      backgroundSize: {
        grain: "22px 22px",
      },
    },
  },
  plugins: [],
};

export default config;
