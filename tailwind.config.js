/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Stone Palette (Warm Greys)
        'primary': '#0c0a09',    // stone-950: Main Background
        'secondary': '#1c1917',  // stone-900: Cards / Sidebar
        'tertiary': '#292524',   // stone-800: Borders / Inputs / Hover states
        
        // Rose Palette (Connection & Romance)
        'accent': '#e11d48',       // rose-600: Primary Action
        'accent-hover': '#be123c', // rose-700: Hover Action
        'accent-light': '#fda4af', // rose-300: Highlights
        
        // Text Colors (Mapped for consistency)
        'slate': {
          100: '#f5f5f4', // stone-100
          200: '#e7e5e4', // stone-200
          300: '#d6d3d1', // stone-300
          400: '#a8a29e', // stone-400
          500: '#78716c', // stone-500
          600: '#57534e', // stone-600
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
     require('@tailwindcss/typography'),
  ],
}