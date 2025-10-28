/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f5ff',
          100: '#e6e8ff',
          200: '#c4c9ff',
          300: '#9fa8ff',
          400: '#7c88ff',
          500: '#5a68ff',
          600: '#4450e6',
          700: '#333dba',
          800: '#242b8f',
          900: '#181e66',
        },
      },
      boxShadow: {
        card: '0 20px 45px -20px rgba(29, 78, 216, 0.35)',
      },
    },
  },
  plugins: [],
};
