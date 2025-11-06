// import scrollbarHide from 'tailwind-scrollbar-hide'

/** @type {import('tailwindcss').Config} */
export const content = ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
export const theme = {
  extend: {
    // 設定 Noto Sans TC 為預設字型
    fontFamily: {
      sans: ['Noto Sans TC', 'sans-serif'],
    },
  },
}
export const plugins = []
