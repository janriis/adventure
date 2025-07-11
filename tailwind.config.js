/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'fantasy': ['Cinzel', 'serif'],
        'body': ['Crimson Text', 'serif'],
      },
      colors: {
        'parchment': {
          50: '#faf8f3',
          100: '#f4f1e8',
          200: '#e8e0d0',
          300: '#d4c7a8',
          400: '#b8a67d',
          500: '#a08660',
          600: '#8b7355',
          700: '#6f5c47',
          800: '#5a4d3e',
          900: '#4a3c32',
        },
        'gold': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
      animation: {
        'dice-roll': 'dice-roll 0.8s ease-in-out',
        'text-reveal': 'text-reveal 0.5s ease-out',
        'bounce-gentle': 'bounce-gentle 2s infinite',
      },
      keyframes: {
        'dice-roll': {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '25%': { transform: 'rotateX(90deg) rotateY(90deg)' },
          '50%': { transform: 'rotateX(180deg) rotateY(180deg)' },
          '75%': { transform: 'rotateX(270deg) rotateY(270deg)' },
          '100%': { transform: 'rotateX(360deg) rotateY(360deg)' },
        },
        'text-reveal': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}