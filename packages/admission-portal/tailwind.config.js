import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.resolve(__dirname, '../../frontend/src/pages/admission');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    `${sourceRoot}/index.html`,
    `${sourceRoot}/src/**/*.{js,ts,jsx,tsx}`,
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8eef8',
          100: '#d1ddf1',
          200: '#a3bbe3',
          300: '#7599d5',
          400: '#4777c7',
          500: '#1955b9',
          600: '#1241a1',
          700: '#0d3280',
          800: '#092460',
          900: '#051640',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
