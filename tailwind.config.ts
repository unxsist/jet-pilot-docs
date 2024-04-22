import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  darkMode: "class",
  theme: {
    fontSize: {
      xs: "0.75rem",
      md: "1rem",
      lg: "1.25rem",
      xl: "2rem",
      "2xl": "4rem",
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    colors: {
      white: "#FFF",
      black: "#0C0A09",
      gray: "#B0B0B0",
      "dark-gray": "#7B7B7B",
    },
    borderRadius: {
      DEFAULT: "11px",
      full: "9999px",
    },
  },
};
