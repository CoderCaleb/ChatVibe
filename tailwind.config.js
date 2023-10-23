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
        btnColor:'#00efbb',
        purpleGrad:'#4C4177',
        blueGrad:'#2a5470',
        blackRgba: 'rgba(0, 0, 0, 0.3)',
      },
      minWidth:{
        messageMin: '310px',
        signUpMin:'749px'
      },
      minHeight:{
        emojiMin:'330px'
      },maxHeight:{
        emojiMax:'500px'
      },
      height:{
        halfHeight:'55vh',
        signUpHeight:'400px',
        onePixel:'1px'
      },
      width:{
        signUpWidth:'700px',
      },
      maxWidth:{
        maxSignUp:'1050px'
      },
      
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
};
