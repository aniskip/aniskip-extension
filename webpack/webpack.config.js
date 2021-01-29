const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    options: './src/options/index.tsx',
    popup: './src/popup/index.tsx',
    background: './src/background.ts',
    content: './src/content.ts',
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join('src', 'options', 'options.html'),
          to: 'options.html',
        },
        { from: path.join('src', 'popup', 'popup.html'), to: 'popup.html' },
        { from: 'manifest.json', to: 'manifest.json' },
      ],
    }),
  ],
};
