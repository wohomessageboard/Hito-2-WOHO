import { heroui } from "@heroui/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'woho-white': '#FFFFFD',
        'woho-black': '#262525',
        'woho-purple': '#8E0083',
        'woho-orange': '#F86205',
      },
      fontFamily: {
        sans: ['"Albert Sans"', 'sans-serif'],
        cuerpo: ['"Albert Sans"', 'sans-serif'],
        titulo: ['"Kanit"', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};