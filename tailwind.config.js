/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#2EC4B6',
        lost: '#EF4444',
        found: '#22C55E',
        adoption: '#EAB308',
      },
    },
  },
  plugins: [],
};
