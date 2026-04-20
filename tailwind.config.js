/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'doc-title': '4.5rem', // For the massive blue header
        'doc-label': '1.25rem', // For the neat lab value labels
      },
      colors: {
        'med-blue': '#003b71', // A trustworthy healthcare blue
      },
      borderRadius: {
        'doc-card': '2.5rem', // Extra smooth rounded corners
      }
    },
  },
  plugins: [],
}