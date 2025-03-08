/* eslint-disable no-dupe-keys */
/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    letterSpacing: {
      wider: ".1em",
      widest: ".25em",
    },

    extend: {
      fontFamily: {
        Hanken: ["Hanken Grotesk", "sans-serif"],
        Hina: ["Hina Mincho"],
        "courier-prime": ["monospace"],
        Mono: ["monospace"],
        typewriter: ["Special Elite"],
        elite: ["Special Elite"],
        merriweather: ["Merriweather", "serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-slower": "pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-slowest": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide"), require("tailwind-scrollbar"), require("daisyui"), require("tailwind-scrollbar")({ nocompatible: true })],
  daisyui: {
    themes: ["dracula"],
  },
};
