/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#93C6E7",
        secondary: "#d5bdaf",
        third: "#d6ccc2",
        fourth: "#004080",
        fifth: "#F55050",
        sixth: "#CDE990",
        cream: "#d6ccc2",
        browny: "#AA5656",
        sale: "#6F1AB6",
        earning: "#FF0032",
        new: "#FEFCF3",
        newtwo: "#F0DBDB",
        background: "#f7f7f7",
        input: "#e2e8f0",
      },
    },
    fontWeight: {
      Default: "400",
      Medium: "500",
      SemiBold: "600",
      Bold: "700",
    },
    fontSize: {
      SM: "8px",
      BASE: "10px",
      XL: "12px",
      "2xl": "12.5px",
      "3xl": "14px",
      "4xl": "16px",
      "5xl": "20px",
    },
  },
  plugins: [],
};
