/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        welfare: {
          primary: "#A45135",
          primaryDark: "#8A3E28",
          primaryLight: "#FDEDE6",

          background: "#FAF6F2",
          surface: "#FFFFFF",

          text: {
            primary: "#2E2A26",
            secondary: "#6B625B",
            muted: "#9A8F86",
          },

          border: "#E7DED6",

          sidebar: "#25211E",
          sidebarHover: "#3A302B",

          success: "#16A34A",
          warning: "#D97706",
          danger: "#DC2626",
        },
      },
    },
  },

  plugins: [],
};