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
        oud: {
          50:  "#FAF6F1",
          100: "#F3EAE0",
          200: "#E5D0BA",
          300: "#D4B08A",
          400: "#C2905B",
          500: "#A87040",
          600: "#8A5530",
          700: "#6B3E22",
          800: "#4A2C17",
          900: "#2E1A0E",
          950: "#1A0D07",
        },
        gold: {
          50:  "#FDFAEF",
          100: "#FAF3D3",
          200: "#F4E49A",
          300: "#EDD05F",
          400: "#E5BC32",
          500: "#C9A96E",
          600: "#B8924A",
          700: "#9A7336",
          800: "#7C5828",
          900: "#5E3F1C",
        },
        cream: {
          50:  "#FDFAF6",
          100: "#F9F4EC",
          200: "#F2E9D8",
          300: "#E8D9C0",
          400: "#D9C4A0",
          500: "#C4A97C",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
