/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Keeping the core blue theme, but refining and extending it.
        'primary': {
          DEFAULT: '#1976D2', // Original primary
          'light': '#63a4ff',
          'dark': '#004ba0',
        },
        'secondary': {
          DEFAULT: '#2196F3', // Original secondary
          'light': '#6ec6ff',
          'dark': '#0069c0',
        },
        'accent': {
          DEFAULT: '#FFC107', // Original accent
          'light': '#fff350',
          'dark': '#c79100',
        },
        'neutral': {
          '50': '#F8F9FA', // Lightest gray for backgrounds
          '100': '#E9ECEF',
          '200': '#DEE2E6',
          '300': '#CED4DA',
          '400': '#ADB5BD',
          '500': '#6C757D', // Muted text
          '600': '#495057',
          '700': '#343A40', // Main text
          '800': '#212529',
          '900': '#1B1B1B', // Darker elements
        },
        'surface': '#FFFFFF',
        'success': '#28a745', // A slightly more modern green
        'danger': '#dc3545',  // A slightly more modern red
      },
      fontFamily: {
        // User wants to keep Noto Serif Lao
        sans: ['Noto Serif Lao', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner-subtle': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}