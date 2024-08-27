import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "theme-orange": "#ec742e", // Primary orange for branding
        "theme-teal": "#3eb7ae", // Teal for accenting and branding
        "theme-yellow": "#fbba30", // Yellow for highlights
        // Complementary and tonal shades for design flexibility
        "theme-orange-light": "#fbd6bf",
        "theme-teal-dark": "#2e7f76",
        "theme-yellow-light": "#ffdd78",
        // Tailwind's default color shades as fallbacks for variations
        orange: {
          light: "#ffd8cc",
          DEFAULT: "#f97316",
          dark: "#ea580c",
        },
        teal: {
          light: "#7edce0",
          DEFAULT: "#14b8a6",
          dark: "#0d9488",
        },
        yellow: {
          light: "#fde68a",
          DEFAULT: "#fbbf24",
          dark: "#f59e0b",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
