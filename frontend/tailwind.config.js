/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0c10',
          card: '#12151e',
          border: '#1e2433',
          hover: '#1b202e',
          accent: '#2563eb'
        },
        diff: {
          easy: '#00b8a3',
          medium: '#ffc01e',
          hard: '#ff375f'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
