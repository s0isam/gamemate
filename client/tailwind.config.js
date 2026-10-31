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
          50: '#E8FFE6',
          100: '#C8FFC2',
          200: '#A2FF98',
          300: '#7CFF6E',
          400: '#59F542',
          500: '#39D923',
          600: '#27B514',
          700: '#208F12',
          800: '#1C6F13',
          900: '#195A14',
        },
        neon: {
          blue: '#39FF14',
          yellow: '#39FF14',
          orange: '#39FF14',
          red: '#39FF14',
          green: '#39FF14',
        },
        danger: {
          400: '#FF5473',
          500: '#FF1744',
          600: '#D90D35',
        },
        slate: {
          50: '#F5F7FA',
          100: '#E3E7EE',
          200: '#C6CDD8',
          300: '#A6AFBC',
          400: '#8A919F',
          500: '#626A78',
          600: '#454C59',
          700: '#2A303A',
          800: '#1B2029',
          900: '#11151C',
          950: '#080A0F',
        },
      },
      boxShadow: {
        soft: '0 0 0 1px rgba(57,255,20,0.10), 0 0 24px rgba(57,255,20,0.08)',
      },
    },
  },
  plugins: [],
};
