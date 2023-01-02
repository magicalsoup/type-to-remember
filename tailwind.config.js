/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main" : "#FEFCE8"
      },
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
        robotomono: ["Roboto Mono", "sans-serif"]
      }
    },
  },
  plugins: [],
}
