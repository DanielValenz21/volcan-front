/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",  // <--- busca en toda la carpeta src
    ],
    theme: {
      extend: {
        // Aquí pones tus colores (tomados de tu prototipo)
        colors: {
          primary: {
            DEFAULT: "#1E3A8A",
            foreground: "#FFFFFF",
          },
          secondary: {
            DEFAULT: "#3B82F6",
            foreground: "#FFFFFF",
          },
          accent: {
            DEFAULT: "#A5B4FC",
            foreground: "#111827",
          },
          muted: {
            DEFAULT: "#F3F4F6",
            foreground: "#6B7280",
          },
          background: {
            DEFAULT: "#F3F4F6",
          },
          foreground: {
            DEFAULT: "#111827",
          },
          // y así sucesivamente...
        },
        // Otras extensiones si deseas
      },
    },
    plugins: [
      // si deseas animaciones de Tailwind, etc.
    ],
  }
  