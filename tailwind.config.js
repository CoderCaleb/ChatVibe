/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#202225",
        secondary: "#5865f2",
        iconContainer: '#373841',
        bgColor:'#13161f',
        borderColor:'#414141',
        inputColor:'#161d26',
        subColor:'#7c828a',
        fireColor:'#FBA587',
      },
      minWidth:{
        messageMin: 270
      }
    },
  },
  plugins: [],
};
