/* eslint-disable import/no-extraneous-dependencies */
const { default: merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const WebExtPlugin = require('@mantiquillal/web-ext-plugin');
const webExtConfig = require('../web-ext.config');
const commonConfig = require('./webpack.common.config');

module.exports = merge(commonConfig, {
  optimization: {
    minimizer: [new CssMinimizerPlugin(), '...'],
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    ...(process.env.ANALYSE === 'true' ? [new BundleAnalyzerPlugin()] : []),
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
