module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#12121a",
          800: "#1a1a2e",
          700: "#16213e",
        },
        primary: {
          300: "#fcd34d",
          400: "#fbbf24",
        },
        border: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};