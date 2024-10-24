/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        rem: ["REM", "sans-serif"]
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primaryBlue: "#10439F",
        secondaryPurple: "#874CCC",
        accentPink: "#C65BCF",
        highlightPink: "#F27BBD",
      },
    },
  },
  plugins: [],
};
