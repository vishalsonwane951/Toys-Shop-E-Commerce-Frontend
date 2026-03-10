/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#fef3e2', 100: '#fde0b0', 200: '#fbcc7d', 300: '#f9b84a', 400: '#f7a726', 500: '#f59300', 600: '#e07d00', 700: '#b86500', 800: '#904f00', 900: '#683a00' },
        dark: { 900: '#0a0a0f', 800: '#12121a', 700: '#1a1a26', 600: '#252535' }
      },
      fontFamily: { display: ['"Syne"', 'sans-serif'], body: ['"DM Sans"', 'sans-serif'] },
      animation: { 'fade-up': 'fadeUp 0.5s ease forwards', 'pulse-slow': 'pulse 3s infinite' }
    }
  },
  plugins: []
}
