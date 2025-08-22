import { heroui } from '@heroui/theme'
import { fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      container: {
        center: true, // برای قرارگیری وسط
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '3rem',
          xl: '4rem',
          '2xl': '5rem',
        },
        screens: {
          sm: '100%',
          md: '100%',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1440px',
        },
      },
      fontFamily: {
        sans: ['var(--font-dana)', ...fontFamily.sans],
      },
      colors: {
        text: {
          light: '#B9BAC0',
          DEFAULT: '#494949',
          dark: '#181818',
          'light-25': '#74757E',
        },
        background: {
          10: '#F8F8F8',
          20: '#f7f7f7',
          50: '#F0F0F0',
          70: '#D7D7D7',
          primary: '#E9EBF4',
          secondary: '#F2EFE6',
        },
        primary: {
          100: '#364274',
          DEFAULT: '#3A4D9A',
          25: '#586AB1',
          15: '#9EAADA',
          5: '#D9DEF1',
        },
        secondary: {
          100: '#C3A542',
          DEFAULT: '#DEC56B',
          25: '#E7DAB2',
          5: '#FCF9F0',
        },
        error: {
          DEFAULT: '#ED2E7E',
          dark: '#C30052',
          light: '#FF84B7',
          bg: '#FFF0F6',
        },
        warning: {
          DEFAULT: '#F4B740',
          dark: '#946200',
          light: '#FFD789',
          bg: '#FFD789',
        },
        success: {
          DEFAULT: '#00BA88',
          dark: '#00966D',
          light: '#34EAB9',
          bg: '#F2FFFB',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom right, theme("colors.primary.DEFAULT"), theme("colors.primary.5"))',
        'gradient-secondary': 'linear-gradient(to bottom right, theme("colors.secondary.100"), theme("colors.secondary.25"))',
        'gradient-accent': 'linear-gradient(to bottom right, theme("colors.primary.15"), theme("colors.secondary.25"))',
        'custom-blue-gradient': 'linear-gradient(to bottom right, theme("colors.primary.DEFAULT"), #14B0BF)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui(),
    function ({ addBase, theme }) {
      addBase({
        body: { color: theme('colors.text.DEFAULT') },
      })
    },
  ],
}
