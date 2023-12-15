/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      opacity: {
        16: ".16",
        0: "0",
        100: "100",
      },
      colors: {
        primaryColor: "#6E00FF",
        secondaryColor: "#612DD1",
        messageResponse: "#E7E7E7",
        input: "#EFF6FC",
        text: "#303030",
        warning: "#FFBF00",
        active: "#F3B559",
        clear: "#128745",
        danger: "#DC2A2A",
        shadow: "#79C5EF", //blur 5 spread 2 y 4 38op
      },
      fontSize: {
        xsx: "0.6rem",
        xlx: "1.35rem",
        date: "40px",
        day: "12px",
        small: "11px",
        head: "15px",
        most: "1.125rem",
        extrasmall: "10px",
        filterHead: "16px",
      },
    },
  },
  plugins: [],
};
