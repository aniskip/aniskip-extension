const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: colors.amber[500],
      ...colors,
    },
    fontSize: {
      xs: '0.75em',
      sm: '0.875em',
      base: '1em',
      lg: '1.125em',
      xl: '1.25em',
      '2xl': '1.5em',
      '3xl': '1.875em',
      '4xl': '2.25em',
      '5xl': '3em',
      '6xl': '3.75em',
      '7xl': '4.5em',
    },
    spacing: {
      0: '0px',
      px: '1px',
      0.5: '0.125em',
      1: '0.25em',
      1.5: '0.375em',
      2: '0.5em',
      2.5: '0.625em',
      3: '0.75em',
      3.5: '0.875em',
      4: '1em',
      5: '1.25em',
      6: '1.5em',
      7: '1.75em',
      8: '2em',
      9: '2.25em',
      10: '2.5em',
      11: '2.75em',
      12: '3em',
      14: '3.5em',
      16: '4em',
      20: '5em',
      24: '6em',
      28: '7em',
      32: '8em',
      36: '9em',
      40: '10em',
      44: '11em',
      48: '12em',
      52: '13em',
      56: '14em',
      60: '15em',
      64: '16em',
      72: '18em',
      80: '20em',
      96: '24em',
    },
    borderRadius: {
      none: '0',
      sm: '0.125em',
      DEFAULT: '0.25em',
      md: '0.375em',
      lg: '0.5em',
    },
    inset: {
      0: '0px',
      px: '1px',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
      auto: 'auto',
      full: '100%',
    },
    extend: {
      spacing: {
        '3/2': '150%',
        '2/1': '200%',
      },
      lineHeight: {
        3: '.75em',
        4: '1em',
        5: '1.25em',
        6: '1.5em',
        7: '1.75em',
        8: '2em',
        9: '2.25em',
        10: '2.5em',
      },
    },
  },
  plugins: [],
};
