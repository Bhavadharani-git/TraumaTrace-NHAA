export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        govNavy: "#0A2540",
        govBlue: "#1a56db",
        govHeaderBlue: "#2563eb",
        govCrimson: "#b91c1c",
        govCrimsonDark: "#991b1b",
        govBg: "#f4f7fb",
        govCard: "#ffffff",
        govGold: "#d97706",
        govGreen: "#15803d",
        govPurple: "#6366f1",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
};
