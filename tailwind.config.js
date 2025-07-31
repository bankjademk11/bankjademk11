/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a3a3a',
        secondary: '#6b7280',
        background: '#f9f9f7',
        surface: '#ffffff',
        accent: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'food-bg': "url('/BG.png')",
      },
    },
  },
  plugins: [],
}
