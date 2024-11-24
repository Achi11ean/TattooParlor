/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        stars: 'moveStars 10s linear infinite',
        twinkle: 'twinkle 1.5s infinite',
      },
      keyframes: {
        moveStars: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 0.2 },
        },
      },
    },
  },
  plugins: [],
};