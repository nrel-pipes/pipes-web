/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure all your source files are included
  ],
  theme: {
    extend: {
      animation: {
        slide: "slide 2.5s linear infinite",
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateY(100%)", opacity: 0.1 },
          "15%": { transform: "translateY(0)", opacity: 1 },
          "30%": { transform: "translateY(0)", opacity: 1 },
          "45%": { transform: "translateY(-100%)", opacity: 1 },
          "100%": { transform: "translateY(-100%)", opacity: 0.1 },
        },
      },
    },
  },
  plugins: [require('daisyui')], // If you're using daisyUI
};
