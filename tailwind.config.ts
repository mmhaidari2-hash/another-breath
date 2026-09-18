import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0c0f12',
          raised: '#141820',
          soft: '#1c222c',
        },
        mist: {
          DEFAULT: '#e8ebe6',
          muted: 'rgba(232,235,230,0.62)',
          faint: 'rgba(232,235,230,0.38)',
        },
        sea: {
          DEFAULT: '#3d9b8f',
          soft: 'rgba(61,155,143,0.16)',
          deep: '#2a6f66',
        },
        bronze: {
          DEFAULT: '#c4a574',
          soft: 'rgba(196,165,116,0.14)',
        },
        line: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Vazirmatn', 'system-ui', 'sans-serif'],
        fa: ['Vazirmatn', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        aura: '0 0 80px rgba(61,155,143,0.12)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(2%, -1%) scale(1.04)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.45' },
          '50%': { transform: 'scale(1.08)', opacity: '0.7' },
        },
      },
      animation: {
        drift: 'drift 22s ease-in-out infinite',
        rise: 'rise 0.8s ease-out both',
        breathe: 'breathe 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
