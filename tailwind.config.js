const colours = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ['0.75em', { lineHeight: '1em' }],
        sm: ['0.875em', { lineHeight: '1.25em' }],
        base: ['1em', { lineHeight: '1.5em' }],
        lg: ['1.125em', { lineHeight: '1.75em' }],
        xl: ['1.25em', { lineHeight: '1.75em' }],
        '2xl': ['1.5em', { lineHeight: '2em' }],
        '3xl': ['1.875em', { lineHeight: '2.25em' }],
        '4xl': ['2.25em', { lineHeight: '2.5em' }],
        '5xl': '3em',
        '6xl': '3.75em',
        '7xl': '4.5em',
        '8xl': '6em',
        '9xl': '8em',
      },
      spacing: {
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
        '3/2': '150%',
        '2/1': '200%',
      },
      borderRadius: {
        sm: '0.125em',
        DEFAULT: '0.25em',
        md: '0.375em',
        lg: '0.5em',
        xl: '0.75em',
        '2xl': '1em',
        '3xl': '1.5em',
      },
      maxWidth: {
        0: '0em',
        xs: '20em',
        sm: '24em',
        md: '28em',
        lg: '32em',
        xl: '36em',
        '2xl': '42em',
        '3xl': '48em',
        '4xl': '56em',
        '5xl': '64em',
        '6xl': '72em',
        '7xl': '80em',
      },
      colors: {
        primary: colours.amber[500],
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
