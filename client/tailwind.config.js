/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#fffff2',
          100: '#f7ffd0',
          200: '#efff9d',
          300: '#e7ff66',
          400: '#dfff00',
          500: '#d9ff00',
          600: '#dfff00',
          700: '#c8ff00',
          800: '#a8d900',
          900: '#7ca200',
        },
        danger: {
          400: '#ff3f6a',
          500: '#ff1744',
          600: '#e5092f',
        },
        slate: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#111111',
          950: '#0a0a0a',
        },
      },
      boxShadow: {
        soft: '0 0 0 1px rgba(223,255,0,0.08), 0 0 24px rgba(223,255,0,0.08)',
      },
    },
  },
  plugins: [],
};
