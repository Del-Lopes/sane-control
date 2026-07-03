import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta real extraída do site atual da Sane Control (marca vermelho + branco)
        brand: {
          DEFAULT: "#DE1E11", // vermelho principal
          light: "#EB3D3D",   // vermelho de destaque
          dark: "#961B1B",    // vermelho escuro
          soft: "#F6D9D9",    // rosa claro para fundos suaves
        },
        ink: {
          DEFAULT: "#2A2A2A", // títulos / texto forte
          soft: "#54595F",    // texto secundário
          muted: "#7A7A7A",   // texto de apoio
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.25rem",
          lg: "2rem",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
