import type { Config } from "tailwindcss";

/**
 * Design tokens — SSOT for product + marketing utilities.
 * Landing semantic colors `shell.*` read RGB triplets from `.brand-shell` in `app/globals.css`.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"]
      },
      borderRadius: {
        lg: "10px",
        xl: "12px",
        "2xl": "16px"
      },
      colors: {
        ink: "#06120F",
        graphite: "#0F1714",
        slate: "#141E1A",
        paper: "#F5F7F6",
        /** Marketing / landing only — requires ancestor `.brand-shell` */
        shell: {
          fg: "rgb(var(--shell-fg-rgb) / <alpha-value>)",
          muted: "rgb(var(--shell-muted-rgb) / <alpha-value>)",
          subtle: "rgb(var(--shell-subtle-rgb) / <alpha-value>)",
          line: "rgb(var(--shell-line-rgb) / <alpha-value>)",
          glass: "rgb(var(--shell-glass-rgb) / <alpha-value>)",
          band: "rgb(var(--shell-band-rgb) / <alpha-value>)"
        },
        brand: {
          50: "#E9F5F0",
          100: "#C8E9DD",
          200: "#95D4C2",
          500: "#2A9B76",
          600: "#1F7F5F",
          700: "#17664C",
          900: "#0A3428"
        },
        mint: "#2A9B76",
        cyber: "#5BA9BC",
        violet: "#7168D4",
        amber: "#C8943A",
        coral: "#D96B6B"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(0, 0, 0, 0.14)",
        glow: "0 0 0 1px rgba(42, 155, 118, 0.12), 0 18px 48px rgba(42, 155, 118, 0.055)"
      }
    }
  },
  plugins: []
};

export default config;
