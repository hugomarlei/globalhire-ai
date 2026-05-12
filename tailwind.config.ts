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
        ink: "#070A0D",
        graphite: "#101418",
        slate: "#151B22",
        paper: "#F4F7F5",
        brand: {
          50: "#EAF8F3",
          100: "#CBEDE3",
          200: "#9BD9C8",
          500: "#2FBF8F",
          600: "#249B75",
          700: "#197B5D",
          900: "#0A3D31"
        },
        mint: "#2FBF8F",
        cyber: "#6EC6D9",
        violet: "#7C6EE6",
        amber: "#D9A441",
        coral: "#E16B6B"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0, 0, 0, 0.24)",
        glow: "0 0 0 1px rgba(47, 191, 143, 0.15), 0 22px 70px rgba(47, 191, 143, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
