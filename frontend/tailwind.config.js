/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta institucional UNAMBA
        primary: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#1d4ed8",  // Azul institucional principal
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#1e3270",
        },
        unamba: {
          blue:   "#1e3a8a",  // Azul oscuro institucional
          gold:   "#b45309",  // Dorado para acentos
          light:  "#f0f4ff",  // Fondo suave azulado
          border: "#cbd5e1",  // Bordes suaves
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)",
        form: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)",
      },
      borderRadius: {
        form: "0.625rem",
      },
    },
  },
  plugins: [],
}