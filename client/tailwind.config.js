/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: BBC Red (Classic Authority)
        primary: {
          DEFAULT: '#BB1919',
          light: '#D42A2A',
          dark: '#9F1414',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#BB1919',
          600: '#A01616',
          700: '#851313',
          800: '#6A0F0F',
          900: '#4F0C0C',
        },
        // Secondary: Deep Navy Blue (Sophistication)
        secondary: {
          DEFAULT: '#1E2235',
          light: '#2A2F45',
          dark: '#15192B',
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#6C757D',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
        },
        // Accent: Dark Navy (Depth)
        accent: {
          DEFAULT: '#15192B',
          light: '#1E2235',
          dark: '#0F1219',
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#6C757D',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
        },
        // Background: Clean white and light gray
        bg: '#FFFFFF',
        'bg-secondary': '#F7F8FC',

        // Text: Navy primary and gray muted
        text: {
          dark: '#1E2235',
          muted: '#6B7280',
          light: '#9CA3AF',
        },

        // Borders: Light gray
        border: '#E5E7EB',
        'border-light': '#F3F4F6',

        // Status colors
        success: {
          DEFAULT: '#00CC66',
          light: '#E6FFF0',
          dark: '#009944',
        },
        error: {
          DEFAULT: '#FF4444',
          light: '#FFE6E6',
          dark: '#CC3333',
        },
        warning: {
          DEFAULT: '#FFAA00',
          light: '#FFF5E6',
          dark: '#CC8800',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }], // More energy
        'sm': ['0.875rem', { lineHeight: '1.45', letterSpacing: '0.015em' }],
        'base': ['1rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.55', letterSpacing: '0.005em' }],
        'xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],
        '2xl': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
        '4xl': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'card': '16px', // More dynamic
        'button': '12px', // More energetic
        'chip': '24px', // Very energetic
        'input': '12px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '32px', // More dynamic
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'large': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'energy': '0 4px 20px rgba(187, 25, 25, 0.15)', // BBC red shadow
        'energy-strong': '0 8px 30px rgba(187, 25, 25, 0.25)',
        'kinetic': '0 4px 20px rgba(30, 34, 53, 0.15)', // Navy shadow
        'kinetic-strong': '0 8px 30px rgba(30, 34, 53, 0.25)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      transitionTimingFunction: {
        'energy': 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth energy transition
      },
      backgroundImage: {
        'gradient-red': 'linear-gradient(to right, #FF4F5A, #E63A45)',
        'gradient-red-vertical': 'linear-gradient(to bottom, #FF4F5A, #E63A45)',
        'gradient-navy': 'linear-gradient(to right, #1E2235, #15192B)',
        'gradient-navy-vertical': 'linear-gradient(to bottom, #1E2235, #15192B)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}