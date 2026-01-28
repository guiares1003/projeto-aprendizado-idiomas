/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        "panel": "#ffffff",
        "panel-light": "#f8fafc",
        "panel-border": "#e2e8f0",
        "brand": "#4f46e5",
      },
    },
  },
  plugins: [],
};
