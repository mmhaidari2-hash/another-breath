import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F3F5F7',
          raised: '#FFFFFF',
          sunk: '#E8ECF0',
        },
        ink: {
          DEFAULT: '#12141A',
          soft: '#3A3F4B',
          faint: '#7A8090',
          line: 'rgba(18, 20, 26, 0.1)',
        },
        forest: {
          DEFAULT: '#0B6E4F',
          deep: '#085540',
          soft: 'rgba(11, 110, 79, 0.1)',
        },
        navy: {
          DEFAULT: '#1B3A5C',
          soft: 'rgba(27, 58, 92, 0.08)',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Sora"', 'Vazirmatn', 'system-ui', 'sans-serif'],
        fa: ['Vazirmatn', 'Sora', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '72rem',
      },
      boxShadow: {
        lift: '0 18px 50px rgba(18, 20, 26, 0.08)',
        soft: '0 8px 24px rgba(18, 20, 26, 0.05)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        draw: {
          '0%': { strokeDashoffset: '240' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        rise: 'rise 0.85s cubic-bezier(0.22, 1, 0.36, 1) both',
        floaty: 'floaty 9s ease-in-out infinite',
        draw: 'draw 2.4s ease forwards',
      },
    },
  },
  plugins: [],
};

export default config;
