/* eslint-disable import/no-extraneous-dependencies */
const { default: merge } = require('webpack-merge');
const WebExtPlugin = require('@mantiquillal/web-ext-plugin');
const webExtConfig = require('../web-ext.config');
const commonConfig = require('./webpack.common.config');

module.exports = merge(commonConfig, {
  devtool: 'inline-cheap-module-source-map',
  optimization: {
    minimize: false,
    moduleIds: 'named',
    chunkIds: 'named',
    mangleExports: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      // This makes all dependencies of this file - build dependencies
      config: [__filename],
      // By default webpack and loaders are build dependencies
    },
  },
  plugins: [
    new WebExtPlugin({
      sourceDir: webExtConfig.sourceDir,
      ...(process.env.BUILD === 'true'
        ? {
            ...webExtConfig.build,
            buildPackage: true,
          }
        : {
            ...webExtConfig.run,
            target: process.env.BROWSER === 'chromium' ? 'chromium' : undefined,
            lint: false,
          }),
    }),
  ],
});
