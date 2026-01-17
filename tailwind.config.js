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
    extend: {
      colors: {
        'navy-dark': '#0F1924',
        'navy-light': '#1A2332',
        'blue-primary': '#0080FF',
        'blue-light': '#00B4FF',
        'blue-accent': '#00D4FF',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      dark: {
        colors: {
          primary: {
            DEFAULT: "#00B4FF",
            foreground: "#ffffff",
          },
          focus: "#00B4FF",
          background: "#0F1924",
        },
      },
    },
  })],
}
