const plugin = require("tailwindcss/plugin");

const { fontFamily } = require("./fonts.config.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#5847B0",
        "primary-dark": "#3F2B96",
        secondary: "#7C3AED",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        background: {
          light: "#FAF9F6",
          dark: "#140A33",
        },
        "background-dark": "#140A33",
        surface: {
          dark: "#1E1045",
        },
        ivory: "#FAF9F6",
        lavender: "#EDE9FE",
      },
      fontFamily: {
        sans: [fontFamily.regular],
        display: [fontFamily.display],
      },
      fontSize: {
        caption: ["12px", { lineHeight: "16px" }],
        footnote: ["13px", { lineHeight: "18px" }],
        subheadline: ["15px", { lineHeight: "20px" }],
        body: ["17px", { lineHeight: "22px" }],
        title3: ["20px", { lineHeight: "25px" }],
        title2: ["22px", { lineHeight: "28px" }],
        title1: ["28px", { lineHeight: "34px" }],
        largeTitle: ["34px", { lineHeight: "41px" }],
      },
      borderRadius: {
        button: "50px",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".font-sans": { fontFamily: fontFamily.regular },
        ".font-light": { fontFamily: fontFamily.light },
        ".font-normal": { fontFamily: fontFamily.regular },
        ".font-medium": { fontFamily: fontFamily.medium },
        ".font-semibold": { fontFamily: fontFamily.semibold },
        ".font-bold": { fontFamily: fontFamily.bold },
        ".font-display": { fontFamily: fontFamily.display },
        ".font-display-medium": { fontFamily: fontFamily.displayMedium },
        ".font-figtree": { fontFamily: fontFamily.figtree },
        ".font-figtree-medium": { fontFamily: fontFamily.figtreeMedium },
        ".font-figtree-semibold": { fontFamily: fontFamily.figtreeSemibold },
        ".font-figtree-bold": { fontFamily: fontFamily.figtreeBold },
      });
    }),
  ],
};
