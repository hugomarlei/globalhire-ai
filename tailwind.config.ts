import type { Config } from "tailwindcss";

/**
 * SSOT cores produto: `brand`, `ink`, `paper` (legado + charts).
 * SSOT UI semântica: variáveis em `app/globals.css` → `background`, `foreground`, `card`, `primary`, etc.
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
        border: "rgb(var(--border) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)"
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)"
        },
        surface: {
          muted: "rgb(var(--surface-muted) / <alpha-value>)",
          elevated: "rgb(var(--surface-elevated) / <alpha-value>)"
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)"
        },
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        ink: "#070A0D",
        graphite: "#101418",
        slate: "#151B22",
        paper: "#F4F7F5",
        brand: {
          50: "#E9F5F0",
          100: "#C8E9DD",
          200: "#95D4C2",
          500: "#2A9B76",
          600: "#1F7F5F",
          700: "#17664C",
          800: "#125542",
          900: "#0A3428"
        },
        mint: "#2A9B76",
        cyber: "#5BA9BC",
        violet: "#7168D4",
        amber: "#C8943A",
        coral: "#D96B6B"
      },
      boxShadow: {
        soft: "0 22px 70px rgba(0, 0, 0, 0.16)",
        glow: "0 0 0 1px rgba(42, 155, 118, 0.14), 0 20px 56px rgba(42, 155, 118, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
