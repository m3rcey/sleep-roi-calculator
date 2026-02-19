/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0f172a',
        'card-bg': '#1e293b',
        'slate-blue': '#1e3a5f',
        'gold': '#f59e0b',
        'alert-red': '#ef4444',
        'healthy-green': '#22c55e',
        'border-subtle': '#334155',
      },
    },
  },
  plugins: [],
}
