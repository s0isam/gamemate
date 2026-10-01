/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9eeff',
          200: '#bcdefd',
          300: '#8cc7ff',
          400: '#56a8ff',
          500: '#2c8dff',
          600: '#156ed8',
          700: '#1456af',
          800: '#184d92',
          900: '#1a426f',
        },
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.2)',
      },
    },
  },
  plugins: [],
};
