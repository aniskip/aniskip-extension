/* eslint-disable import/no-extraneous-dependencies */
const { default: merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WebExtPlugin = require('@mantiquillal/web-ext-plugin');
const webExtConfig = require('../web-ext.config');
const commonConfig = require('./webpack.common.config');

module.exports = merge(commonConfig, {
  optimization: {
    minimizer: [new CssMinimizerPlugin(), '...'],
  },
  plugins: [
    new WebExtPlugin({
      sourceDir: webExtConfig.sourceDir,
      ...(!process.env.BUILD || process.env.BUILD === 'false'
        ? {
            ...webExtConfig.run,
            target: process.env.BROWSER === 'chromium' ? 'chromium' : undefined,
          }
        : {
            ...webExtConfig.build,
            buildPackage: true,
          }),
    }),
  ],
});
