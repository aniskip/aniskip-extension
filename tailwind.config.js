module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  prefix: 'tw-',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
