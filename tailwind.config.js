/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        "panel": "#111827",
        "panel-light": "#1f2937",
        "panel-border": "#374151",
        "brand": "#6366f1",
      },
    },
  },
  plugins: [],
};
