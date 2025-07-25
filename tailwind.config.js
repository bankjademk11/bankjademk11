/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'food-bg': "url('./Assets/BG.png')",
      },
    },
  },
  plugins: [],
}
