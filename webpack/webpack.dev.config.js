// eslint-disable-next-line import/no-extraneous-dependencies
const { default: merge } = require('webpack-merge');

const commonConfig = require('./webpack.common.config');

module.exports = (env) =>
  merge(commonConfig(env), {
    devtool: 'eval-cheap-module-source-map',
    optimization: {
      minimize: false,
      moduleIds: 'named',
      chunkIds: 'named',
      mangleExports: false,
    },
  });
