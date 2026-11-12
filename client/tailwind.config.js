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
          red: '#F05252',
          green: '#39D923',
        },
        accent: {
          blue: '#6EA8FE',
        },
        danger: {
          400: '#F87171',
          500: '#F05252',
          600: '#DC2626',
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
        soft: '0 8px 28px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
};
