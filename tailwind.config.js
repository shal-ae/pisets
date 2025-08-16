/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/front/src/**/*.{html,ts}',
    './libs/front/core/ui/src/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // preflight: false,

  },
}

