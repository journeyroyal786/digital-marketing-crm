import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { ink: "#241516", wine: "#3B080B", gold: "#D7A62A", cream: "#FAF8F4", muted: "#817779" },
    boxShadow: { soft: "0 8px 30px rgba(36,21,22,.06)" }
  }},
  plugins: []
};
export default config;
