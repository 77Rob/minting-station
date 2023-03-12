/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        //   display: ["Poppins"],
      },

      colors: {
        "base-300": "hsl(225, 75%, 3%)",
        "base-200": "#ffffff1a",
        highlight: "#4D56AF",
        "base-100": "#272d37",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
