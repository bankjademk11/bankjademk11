/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2c3e50',       // Navy Blue
        secondary: '#8e95a5',     // Muted Gray
        accent: '#f39c12',        // Golden Yellow
        background: '#f8f9fa',   // Off-white
        surface: '#ffffff',       // Pure White for cards
        success: '#27ae60',      // Green
        danger: '#c0392b',       // Red
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
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