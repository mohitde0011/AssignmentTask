/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': '#9ff443',
        'blue': '#253bff',
        "primary": "#101828",
        'secondary': "",
        'lightBlack':"#101828",
        'gray':"#475467",
        'lightgray':"#d0d5dd"
      },
    },
  },
  plugins: [],
}