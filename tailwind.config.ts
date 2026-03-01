import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pink: { primary: "#FF6B9D" },
        purple: { primary: "#C084FC" },
      },
    },
  },
  plugins: [],
};
export default config;
