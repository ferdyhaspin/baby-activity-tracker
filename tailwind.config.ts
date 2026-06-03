import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: {
          800: "#1c2433",
          900: "#111827",
          950: "#070b13",
        },
        cream: {
          50: "#fff7ed",
          100: "#ffedd5",
          300: "#d8cbbb",
          400: "#a99d8d",
          500: "#766f66",
        },
        peach: {
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
        },
        mint: {
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
        },
        lilac: {
          200: "#ddd6fe",
          300: "#c4b5fd",
        },
      },
      boxShadow: {
        soft: "0 18px 50px rgba(0, 0, 0, 0.28)",
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "sheet-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 280ms ease both",
        "sheet-up": "sheet-up 240ms cubic-bezier(.2,.8,.2,1)",
      },
    },
  },
  plugins: [],
};
export default config;
