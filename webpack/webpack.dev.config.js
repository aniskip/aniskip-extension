// eslint-disable-next-line import/no-extraneous-dependencies
const { default: merge } = require('webpack-merge');

const commonConfig = require('./webpack.common.config');

module.exports = merge(commonConfig, {
  devtool: 'cheap-module-source-map',
  optimization: {
    minimize: false,
    moduleIds: 'named',
    chunkIds: 'named',
    mangleExports: false,
  },
});
