/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1976D2',       // Dark Blue
        secondary: '#2196F3',     // Medium Blue
        accent: '#FFC107',        // Amber
        background: '#E3F2FD',   // Lightest Blue
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
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '1rem',
      }
    },
  },
  plugins: [],
}