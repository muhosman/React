/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        main: "#0b377e", // Burada özelleştirilmiş bir renk tanımlanmıştır
        secondary: "#f7931d",
        third: "#cc123c",
        fourth: "#F0F0F0",
        fifth: "#627eab",
      },
    },
  },
  plugins: [],
};
