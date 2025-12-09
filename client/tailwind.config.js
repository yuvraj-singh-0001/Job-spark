/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1769E0',
          light: '#2E8CFF',
        },
        chip: {
          bg: '#E8F1FF',
        },
        bg: '#F5F7FA',
        text: {
          dark: '#111111',
          muted: '#555555',
        },
        border: '#E5E7EB',
        highlight: '#F7C948',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'button': '10px',
        'chip': '20px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}