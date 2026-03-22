/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0e0e0e',
        surface: '#0e0e0e',
        'surface-container': '#1a1a1a',
        'surface-container-high': '#20201f',
        'surface-container-highest': '#262626',
        'surface-container-low': '#131313',
        'surface-bright': '#2c2c2c',
        primary: '#61f4d8',
        'primary-container': '#08c1a6',
        'primary-dim': '#4fe5ca',
        secondary: '#45fec9',
        'secondary-container': '#006c52',
        'secondary-dim': '#2cefbc',
        tertiary: '#68ccff',
        'outline-variant': '#484847',
        'on-surface': '#ffffff',
        'on-surface-variant': '#adaaaa',
        'on-primary': '#00594c',
        'on-secondary': '#005d47',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Manrope', 'sans-serif']
      }
    },
  },
  plugins: [],
}
