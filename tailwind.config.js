module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "background-position-spin":
          "background-position-spin 3000ms infinite alternate",
      },
      keyframes: {
        "background-position-spin": {
          "0%": { backgroundPosition: "top center" },
          "100%": { backgroundPosition: "bottom center" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
