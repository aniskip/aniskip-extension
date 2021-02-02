// eslint-disable-next-line import/no-extraneous-dependencies
const { default: merge } = require('webpack-merge');

const commonConfig = require('./webpack.common.config');

module.exports = (env) =>
  merge(commonConfig(env), {
    devtool: 'cheap-module-source-map',
  });
