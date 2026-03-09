/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#64748b',
      },
    },
  },
  corePlugins: {
    // 小程序不需要 preflight
    preflight: false,
  },
  plugins: [],
};
