/* eslint-disable import/no-extraneous-dependencies */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const JsonBuilderPlugin = require('./json-builder-webpack-plugin');
const getManifest = require('./manifest');

module.exports = {
  mode: process.env.NODE_ENV,
  context: path.join(__dirname, '..'),
  entry: {
    options: './src/options/index.tsx',
    'background-script': './src/scripts/background/script.ts',
    'content-script': './src/scripts/content/script.ts',
    'player-script': './src/scripts/player/script.ts',
    'window-proxy-script': './src/scripts/window-proxy/script.ts',
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
            loader: 'babel-loader',
          },
        ],
        include: path.join(__dirname, '..', 'src'),
        exclude: /node_modules/,
      },
      {
        test: /\.((s[ac])?|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-import', 'tailwindcss', 'autoprefixer'],
              },
              sourceMap: false,
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
      chunks: ['options'],
    }),
    new JsonBuilderPlugin({
      output: 'manifest.json',
      json: getManifest(),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public/*.png',
          to: '[name].png',
        },
      ],
    }),
  ],
};
