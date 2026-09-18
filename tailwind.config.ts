import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stone: {
          DEFAULT: '#E6E8EC',
          soft: '#F1F2F4',
          raised: '#FFFFFF',
          sunk: '#D9DDE3',
        },
        coal: {
          DEFAULT: '#0B0C0F',
          soft: '#2A2E36',
          mute: '#6B7280',
          line: 'rgba(11,12,15,0.12)',
        },
        signal: {
          DEFAULT: '#FF3B00',
          deep: '#D93200',
          soft: 'rgba(255,59,0,0.12)',
        },
      },
      fontFamily: {
        display: ['Syne', 'Vazirmatn', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'Vazirmatn', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        shell: '78rem',
      },
      boxShadow: {
        hard: '8px 8px 0 0 #0B0C0F',
        soft: '0 20px 60px rgba(11,12,15,0.08)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseLine: {
          '0%,100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        rise: 'rise 0.9s cubic-bezier(0.16,1,0.3,1) both',
        marquee: 'marquee 38s linear infinite',
        pulseLine: 'pulseLine 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
