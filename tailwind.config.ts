import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tom Noske-inspired color palette
        'dark-green': '#0b372b',
        'darker-green': '#052019',
        'off-white': '#f5ede6',
        'tan': '#b19d7c',
        'muted-green': '#6e857c',
        'error-red': '#dc2626',
        'success-green': '#16a34a',
        // Keep original Z21 colors as secondary options
        'emerald-950': '#0F3B2E',
        'paper': '#F7F5EE',
        'ink': '#0B0B0B',
        'rust': '#C56B36',
      },
      fontFamily: {
        'heading': ['Inter Tight', 'Oswald', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['96px', { lineHeight: '0.9', fontWeight: '900' }],
        'display-lg': ['80px', { lineHeight: '0.95', fontWeight: '900' }],
        'display': ['64px', { lineHeight: '1', fontWeight: '800' }],
        'display-sm': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'heading': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'body-lg': ['20px', { lineHeight: '1.6' }],
        'body': ['16px', { lineHeight: '1.7' }],
        'body-sm': ['14px', { lineHeight: '1.6' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '600' }],
      },
      letterSpacing: {
        'ultra': '.2em',
        'mega': '.15em',
        'wide': '.1em',
        'wider': '.15em',
        'widest': '.25em',
      },
      maxWidth: {
        'screen-xl': '1280px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-up-delayed': 'slideUp 0.5s ease-out 0.2s both',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
        'number-fade': 'numberFade 0.6s ease-out',
        'parallax-slow': 'parallaxSlow 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        numberFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '0.2', transform: 'translateY(0)' },
        },
        parallaxSlow: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'deep': '0 10px 40px rgba(0, 0, 0, 0.15)',
        'noske': '0 20px 60px rgba(11, 55, 43, 0.15)',
      },
      transitionTimingFunction: {
        'out-swift': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'in-swift': 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',
      },
    },
  },
  plugins: [],
};

export default config;
