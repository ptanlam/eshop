module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'spinner': {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        'fade-in-opacity': {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'fade-out-down': {
          'from': {
            opacity: '1',
            transform: 'translateY(0px)'
          },
          'to': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'fade-out-up': {
          'from': {
            opacity: '1',
            transform: 'translateY(0px)'
          },
          'to': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
        }
      },
      animation: {
        "spinner": "spinner 1.5s linear infinite",
        'fade-in-opacity': 'fade-in-opacity 0.2s ease-in',
        'fade-in-down': 'fade-in-down 0.2s ease-in',
        'fade-out-down': 'fade-out-down 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-out-up': 'fade-out-up 0.5s ease-out'
      },
      blur: {
        xs: '2px',
      }
    },
  },
  variants: {
    extend: {
      animation: ['responsive', 'motion-safe', 'motion-reduce'],
    },
  },
  plugins: [],
}
