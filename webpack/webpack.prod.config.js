// eslint-disable-next-line import/no-extraneous-dependencies
const { default: merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const commonConfig = require('./webpack.common.config');

module.exports = merge(commonConfig, {
  optimization: {
    minimizer: [new CssMinimizerPlugin(), '...'],
  },
});
