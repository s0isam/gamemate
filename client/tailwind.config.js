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
          50: '#F5F0FF',
          100: '#EDE2FF',
          200: '#D8C2FF',
          300: '#C4A3FF',
          400: '#8B5CF6',
          500: '#7C3AED',
          600: '#8B5CF6',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#3B147A',
        },
        neon: {
          purple: '#8B5CF6',
          blue: '#00A8FF',
          yellow: '#FFE600',
          orange: '#FF6B00',
          red: '#FF1744',
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
        soft: '0 0 0 1px rgba(139,92,246,0.10), 0 0 24px rgba(139,92,246,0.08)',
      },
    },
  },
  plugins: [],
};
