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
        white: '#2C84A0',
        brand: {
          50: '#FFFDE6',
          100: '#FFF9A8',
          200: '#FFF36B',
          300: '#FFED33',
          400: '#FFE600',
          500: '#FFD500',
          600: '#FFE600',
          700: '#E6C900',
          800: '#BFA600',
          900: '#807000',
        },
        neon: {
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
        soft: '0 0 0 1px rgba(255,230,0,0.10), 0 0 24px rgba(255,230,0,0.08)',
      },
    },
  },
  plugins: [],
};
