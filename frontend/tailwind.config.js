/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "Segoe UI", "sans-serif"],
        display: ["DM Serif Display", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(5, 7, 12, 0.10)",
        warm: "0 18px 60px rgba(142, 202, 255, 0.28)"
      },
      keyframes: {
        rise: {
          "0%": { opacity: 0, transform: "translateY(18px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" }
        }
      },
      animation: {
        rise: "rise 0.65s ease-out forwards",
        drift: "drift 7s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
