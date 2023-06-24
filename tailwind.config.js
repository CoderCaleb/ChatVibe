/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#202225",
        secondary: "#5865f2",
        iconContainer: '#373841',
        bgColor:'#303338',
        borderColor:'#181b24'
      },
    },
  },
  plugins: [],
};
