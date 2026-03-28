import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          soft: "#EEF2FF",
        },
        navy: {
          DEFAULT: "#0F172A",
          deep: "#020617",
          card: "#1E293B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: [
          "var(--font-display)",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        search:
          "0 3px 12px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        card: "0 6px 24px rgba(0, 0, 0, 0.08)",
        icon: "0 4px 14px rgba(0, 0, 0, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
