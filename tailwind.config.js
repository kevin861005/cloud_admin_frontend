// import scrollbarHide from 'tailwind-scrollbar-hide'

/** @type {import('tailwindcss').Config} */
export const content = ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
export const theme = {
  extend: {
    // 設定 Noto Sans TC 為預設字型
    fontFamily: {
      sans: ['Noto Sans TC', 'sans-serif'],
    },

    // 全系統顏色
    colors: {
      gray: {
        10: '#222222',
      },
      neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E4E6EA',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
      primary: {
        500: '#398FF9',
      },
      semantic: {
        positive: '#27BD72',
        warning: '#FD5858',
      },
    },
  },
}
export const plugins = []
