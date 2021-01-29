module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
  extends: ['airbnb-typescript', 'prettier', 'prettier/@typescript-eslint'],
  parserOptions: {
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
};
