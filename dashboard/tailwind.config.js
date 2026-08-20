/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#e5c158',
          500: '#c9a84c',
          600: '#ab8b38',
        }
      }
    },
  },
  plugins: [],
};
