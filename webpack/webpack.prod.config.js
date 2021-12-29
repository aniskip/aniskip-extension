/* eslint-disable import/no-extraneous-dependencies */
const { default: merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebExtPlugin = require('@mantiquillal/web-ext-plugin');
const webExtConfig = require('../web-ext.config');
const commonConfig = require('./webpack.common.config');

module.exports = merge(commonConfig, {
  optimization: {
    minimizer: [new CssMinimizerPlugin(), '...'],
  },
  plugins: [
    ...(process.env.ANALYZE === 'true' ? [new BundleAnalyzerPlugin()] : []),
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
