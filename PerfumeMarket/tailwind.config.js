/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    // Core tests
    "text-red-500", 
    "bg-green-500",
    "bg-black",
    // Insens theme
    "bg-ivory",
    "text-oud",
    "bg-indigo",
    // Safe areas (Uniwind)
    "pt-safe",
    "pb-safe",
    "px-safe",
    // Glow/effects
    "blur-xl",
    "blur-2xl",
    "drop-shadow-2xl",
    "shadow-2xl",
    // Layout
    "flex-1",
    "justify-center",
    "items-center",
  ],
  theme: {
    extend: {
      colors: {
        oud: { DEFAULT: '#2B1C17' },      // Oud Brown - wood, depth
        ivory: { DEFAULT: '#F5EFE9' },    // Porcelain Ivory - softness
        indigo: { DEFAULT: '#1E2236' },   // Midnight Indigo - mystery
      },
      fontFamily: {
        display: ['Playfair Display', 'serif', 'system-ui'],
      },
      fontSize: {
        '9xl': '5rem',
      },
    },
  },
};
