import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SatQuery Global Dark Enterprise Palette
        brand: {
          bg: '#07111F',
          secondaryBg: '#0B1628',
          panel: '#101C2E',
          elevated: '#142238',
          input: '#0D192A',
          border: '#24344A',
          subtleBorder: '#1A2A3D',
          text: '#F3F7FC',
          secondaryText: '#A8B5C7',
          mutedText: '#718096',
          blue: '#20A4F3',
          cyan: '#22C7D6',
          success: '#19C37D',
          warning: '#F5A524',
          danger: '#F05D6C',
          neutral: '#7D8CA3',
        },
        background: '#07111F',
        foreground: '#F3F7FC',
        card: {
          DEFAULT: '#101C2E',
          foreground: '#F3F7FC',
        },
        popover: {
          DEFAULT: '#101C2E',
          foreground: '#F3F7FC',
        },
        primary: {
          DEFAULT: '#20A4F3',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#142238',
          foreground: '#A8B5C7',
        },
        muted: {
          DEFAULT: '#0D192A',
          foreground: '#718096',
        },
        accent: {
          DEFAULT: '#102B45',
          foreground: '#35B7FF',
        },
        destructive: {
          DEFAULT: '#F05D6C',
          foreground: '#FFFFFF',
        },
        border: '#24344A',
        input: '#0D192A',
        ring: '#20A4F3',
      },
      borderRadius: {
        lg: '12px',
        md: '10px',
        sm: '6px',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.25s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
