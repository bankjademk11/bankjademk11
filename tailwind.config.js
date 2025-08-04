/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#388E3C',       // Dark Green
        secondary: '#66BB6A',     // Medium Green
        accent: '#FFC107',        // Amber
        background: '#E8F5E9',   // Lightest Green
        surface: '#FFFFFF',       // Pure White for cards
        success: '#4CAF50',      // Standard Green
        danger: '#F44336',       // Standard Red
      },
      fontFamily: {
        sans: ['Noto Serif Lao', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'medium': '0 8px 24px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
      }
    },
  },
  plugins: [],
}