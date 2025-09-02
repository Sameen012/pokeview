import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(248 250 252)',
        foreground: 'rgb(15 23 42)',
        card: 'rgb(255 255 255)',
        primary: {
          DEFAULT: 'rgb(59 130 246)',
          foreground: 'white',
        },
        muted: 'rgb(241 245 249)',
      },
      boxShadow: {
        soft: '0 6px 24px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config
