/** @type {import('tailwindcss').Config} */
export default {
 content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Behance-inspired blue palette (primary: #0057FF)
        blue: {
          50: "#F0F5FF",
          100: "#E1EBFF",
          200: "#C3D7FF",
          300: "#94B8FF",
          400: "#4E8BFF",
          500: "#1769FF",
          600: "#0057FF",
          700: "#0046D5",
          800: "#0037A6",
          900: "#002C85",
          950: "#001A52",
        },
      },
    },
  },
  plugins: [],
}
