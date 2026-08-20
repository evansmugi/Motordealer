import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf7',
          100: '#f7f2e6',
          400: '#e5c158',
          500: '#c9a84c',
          600: '#ab8b38',
        },
      },
    },
  },
  plugins: [],
};

export default config;
