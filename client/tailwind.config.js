// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1A1A19',
        leaf: '#31511E',
        lime: '#859F3D',
        pale: '#F6FCDF',
      },
    },
  },
  plugins: [],
};
