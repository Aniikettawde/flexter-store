import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0b",       // core background black
        panel: "#111113",     // slightly lifted glass panel base
        line: "rgba(255,255,255,0.08)",
        paper: "#f2f2ef",     // warm soft white (primary text)
        dim: "#8f8f94",       // cool gray secondary text
        faint: "#5c5c60",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        compress: {
          "0%": { transform: "scaleY(1)", opacity: "0.35" },
          "100%": { transform: "scaleY(0.4)", opacity: "0.12" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floatSlow: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        grain: {
          "0%,100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-2%,-4%)" },
          "30%": { transform: "translate(3%,2%)" },
          "50%": { transform: "translate(-4%,3%)" },
          "70%": { transform: "translate(2%,-3%)" },
          "90%": { transform: "translate(-3%,1%)" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        grain: "grain 8s steps(10) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
