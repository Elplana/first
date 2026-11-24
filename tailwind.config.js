/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F6F3",
        "primary-text": "#1A1A1A",
        "nav-gray": "#6B6B6B",
        hairline: "#E6E4DF",
        accent: "#F26A1B",
        "btn-dark": "#1F1F1F",
        "btn-dark-hover": "#333333",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        headline: "-0.04em",
        eyebrow: "0.16em",
      },
      maxWidth: {
        navbar: "1290px",
        search: "720px",
      },
      height: {
        navbar: "72px",
        "search-btn": "58px",
      }
    },
  },
  plugins: [],
}
