const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#3b82f6",
            foreground: "#ffffff",
          },
          focus: "#3b82f6",
        },
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: "#3b82f6",
            foreground: "#ffffff",
          },
          focus: "#3b82f6",
        },
      },
    },
  })],
}
