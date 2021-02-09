// eslint-disable-next-line import/no-extraneous-dependencies
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const JsonBuilderPlugin = require('./json_builder_webpack_plugin');
const getManifest = require('./manifest');

module.exports = (env) => ({
  mode: env.NODE_ENV,
  entry: {
    options: './src/options/index.tsx',
    popup: './src/popup/index.tsx',
    background_script: './src/background_script.ts',
    content_script: './src/content_script.ts',
    player_script: './src/player_script.ts',
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
          'style-loader',
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
      json: getManifest(env),
    }),
  ],
});
