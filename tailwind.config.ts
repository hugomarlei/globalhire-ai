import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07120E",
        paper: "#F4FFF8",
        brand: {
          50: "#ECFFF2",
          100: "#CFFFE0",
          500: "#32E875",
          600: "#20C45A",
          900: "#0A4F29"
        },
        mint: "#32E875",
        coral: "#FF6B6B"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
