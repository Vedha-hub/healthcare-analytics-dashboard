/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        'doc-body': '1.25rem', // Large, readable text
        'doc-header': '4rem',  // Massive, clean title
      },
      spacing: {
        '100': '25rem',        // Extra wide spacing for neatness
      }
    },
  },
  plugins: [],
}