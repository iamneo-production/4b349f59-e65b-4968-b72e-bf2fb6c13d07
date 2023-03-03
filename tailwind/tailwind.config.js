/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../templates/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      colors: {
        "text": "#342C2F",
        "body": "#FFFFFF",
        "body-secondary": "#f7f8fc",
      },
    },
  },
  plugins: [],
}
