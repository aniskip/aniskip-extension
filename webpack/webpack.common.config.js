/* eslint-disable import/no-extraneous-dependencies */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const JsonBuilderPlugin = require('./json_builder_webpack_plugin');
const getManifest = require('./manifest');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    options: './src/options/index.tsx',
    popup: './src/popup/index.tsx',
    background_script: './src/background_script.ts',
    content_script: './src/content_script.ts',
    player_script: './src/player_script.ts',
    styles_script: './src/styles_script.ts',
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
      {
        test: /\.((s[ac])?|c)ss$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: (styleTag) => {
                new MutationObserver((_mutations, observer) => {
                  // eslint-disable-next-line no-undef
                  const root = document.getElementById(
                    'opening-skipper-player-submit-button'
                  );
                  if (root) {
                    observer.disconnect();
                    root.shadowRoot.appendChild(styleTag);
                  }
                  // eslint-disable-next-line no-undef
                }).observe(document, {
                  subtree: true,
                  childList: true,
                });
              },
            },
          },
          'css-loader',
          'resolve-url-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
              postcssOptions: {
                plugins: [
                  ['postcss-import', {}],
                  [
                    'tailwindcss',
                    {
                      config: path.join(
                        __dirname,
                        '..',
                        './tailwind.config.js'
                      ),
                    },
                  ],
                  ['autoprefixer', {}],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.join('src', 'options', 'options.html'),
          to: 'options.html',
        },
        { from: path.join('src', 'popup', 'popup.html'), to: 'popup.html' },
      ],
    }),
    new JsonBuilderPlugin({
      output: 'manifest.json',
      json: getManifest(),
    }),
  ],
};
