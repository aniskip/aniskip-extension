/* eslint-disable import/no-extraneous-dependencies */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const JsonBuilderPlugin = require('./json_builder_webpack_plugin');
const getManifest = require('./manifest');

module.exports = {
  mode: process.env.NODE_ENV,
  context: path.join(__dirname, '..'),
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
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        include: path.join(__dirname, '..', 'src'),
        exclude: /node_modules/,
      },
      {
        test: /\.((s[ac])?|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          {
            loader: 'postcss-loader',
            options: {
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
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: './public/options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './public/popup.html',
      chunks: ['popup'],
    }),
    new JsonBuilderPlugin({
      output: 'manifest.json',
      json: getManifest(),
    }),
  ],
};
