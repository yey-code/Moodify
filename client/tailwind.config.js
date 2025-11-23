/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954',
        'primary-dark': '#1ed760',
        dark: '#191414',
        'dark-light': '#282828',
        'gray-dark': '#404040',
      },
      fontFamily: {
        sans: ['Circular', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
