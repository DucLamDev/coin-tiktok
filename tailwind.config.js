/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tiktok-red': '#FE2C55',
        'tiktok-blue': '#25F4EE',
        'tiktok-black': '#161823',
        'tiktok-gray': '#69707D',
        'tiktok-light-gray': '#F1F1F2',
        'tiktok-dark-gray': '#2F2F2F',
      },
      fontFamily: {
        'tiktok': ['Proxima Nova', 'Arial', 'Tahoma', 'PingFangSC', 'sans-serif'],
      },
      boxShadow: {
        'tiktok': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'tiktok-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'tiktok': '8px',
      },
    },
  },
  plugins: [],
}
